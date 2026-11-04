from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Customer


class CustomerRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    fullName = serializers.CharField(source="full_name")

    class Meta:
        model = Customer
        fields = ("id", "email", "fullName", "phone", "password")
        read_only_fields = ("id",)

    def create(self, validated_data):
        password = validated_data.pop("password")
        return Customer.objects.create_user(password=password, **validated_data)


class CustomerLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        customer = Customer.objects.filter(email__iexact=attrs["email"].strip()).first()
        if (
            not customer
            or not customer.is_active
            or not customer.check_password(attrs["password"])
        ):
            raise serializers.ValidationError("Invalid email or password.")
        attrs["customer"] = customer
        return attrs


class CustomerProfileSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source="full_name", required=False)

    class Meta:
        model = Customer
        fields = ("id", "email", "fullName", "phone", "email_verified", "created_at")
        read_only_fields = ("id", "email", "email_verified", "created_at")
