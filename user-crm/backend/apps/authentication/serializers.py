from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers

from apps.roles.models import Role
from .models import AuditLog

User = get_user_model()


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    remember_me = serializers.BooleanField(required=False, default=False)

    def validate(self, attrs):
        user = authenticate(
            request=self.context.get("request"),
            username=attrs["email"].lower(),
            password=attrs["password"],
        )

        if not user or not user.is_active:
            raise serializers.ValidationError("Invalid email or password.")

        # Fetch the employee's assigned active roles from MySQL.
        active_roles = list(
            user.roles.filter(is_active=True).values_list("code", flat=True)
        )

        role_priority = [
            "super_admin",
            "admin",
            "analyst",
            "support",
        ]

        selected_role = next(
            (role for role in role_priority if role in active_roles), None
        )

        if not selected_role:
            raise serializers.ValidationError(
                "No active role is assigned to this account."
            )

        attrs["user"] = user
        attrs["role"] = selected_role

        return attrs


class UserSerializer(serializers.ModelSerializer):

    roles = serializers.SlugRelatedField(many=True, read_only=True, slug_field="code")

    class Meta:
        model = User

        fields = ["id", "email", "full_name", "is_active", "roles", "created_at"]


class CreateEmployeeSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, validators=[validate_password])

    role = serializers.ChoiceField(
        choices=[
            (Role.ADMIN, "Admin"),
            (Role.ANALYST, "Analyst"),
            (Role.SUPPORT, "Support"),
        ]
    )

    class Meta:
        model = User

        fields = ["email", "full_name", "password", "role"]

    def create(self, validated_data):

        role_code = validated_data.pop("role")
        password = validated_data.pop("password")

        user = User.objects.create_user(password=password, **validated_data)

        role = Role.objects.get(code=role_code, is_active=True)

        request = self.context.get("request")

        user.assign_role(role, assigned_by=request.user)

        AuditLog.objects.create(
            user=request.user,
            action="employee.created",
            details={"created_user_id": user.pk, "assigned_role": role_code},
        )

        return user
