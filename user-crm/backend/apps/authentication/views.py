from datetime import timedelta

from django.contrib.auth import get_user_model

from django.utils import timezone

from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken

from .models import LoginSession, AuditLog
from .serializers import (
    LoginSerializer,
    UserSerializer,
    CreateEmployeeSerializer
)
from .permissions import IsSuperAdmin

User = get_user_model()


def get_client_ip(request):

    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")

    if forwarded:
        return forwarded.split(",")[0].strip()

    return request.META.get("REMOTE_ADDR")


class LoginView(APIView):

    permission_classes = [permissions.AllowAny]

    def post(self, request):

        serializer = LoginSerializer(
            data=request.data,
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        remember_me = serializer.validated_data["remember_me"]

        refresh = RefreshToken.for_user(user)

        expiry = timedelta(
            days=30 if remember_me else 1
        )

        refresh.set_exp(lifetime=expiry)

        refresh["role"] = serializer.validated_data["role"]

        access = refresh.access_token

        LoginSession.objects.create(
            user=user,
            refresh_jti=str(refresh["jti"]),
            remember_me=remember_me,
            user_agent=request.META.get(
                "HTTP_USER_AGENT", ""
            )[:1000],
            ip_address=get_client_ip(request),
            expires_at=timezone.now() + expiry
        )

        AuditLog.objects.create(
            user=user,
            action="auth.login",
            details={
                "remember_me": remember_me,
                "role": serializer.validated_data["role"]
            },
            ip_address=get_client_ip(request)
        )

        return Response({
            "access": str(access),
            "refresh": str(refresh),
            "user": UserSerializer(user).data
        })


class LogoutView(APIView):

    def post(self, request):

        refresh_token = request.data.get("refresh")

        if not refresh_token:

            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            token = RefreshToken(refresh_token)

            if token["user_id"] != str(request.user.pk):
                return Response(
                    {"detail": "Invalid refresh token."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token.blacklist()

            LoginSession.objects.filter(
                user=request.user,
                refresh_jti=str(token["jti"]),
                revoked_at__isnull=True
            ).update(
                revoked_at=timezone.now()
            )

            AuditLog.objects.create(
                user=request.user,
                action="auth.logout",
                ip_address=get_client_ip(request)
            )

        except Exception:

            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


class MeView(APIView):

    def get(self, request):

        return Response(
            UserSerializer(request.user).data
        )


class CreateEmployeeView(generics.CreateAPIView):

    queryset = User.objects.all()

    serializer_class = CreateEmployeeSerializer

    permission_classes = [IsSuperAdmin]