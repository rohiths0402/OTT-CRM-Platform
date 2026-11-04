from django.db import transaction
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from apps.subscribers.models import Subscriber
from apps.finance.models import Wallet
from apps.rewards.models import RewardAccount
from .authentication import CustomerJWTAuthentication
from .models import Customer
from .serializers import (
    CustomerRegistrationSerializer,
    CustomerLoginSerializer,
    CustomerProfileSerializer,
)


class CustomerRegisterView(generics.CreateAPIView):
    serializer_class = CustomerRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        customer = serializer.save()
        subscriber = Subscriber.objects.create(customer=customer, phone=customer.phone)
        Wallet.objects.create(subscriber=subscriber)
        RewardAccount.objects.create(subscriber=subscriber)
        refresh = RefreshToken.for_user(customer)
        return Response(
            {
                "customer": CustomerProfileSerializer(customer).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class CustomerLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CustomerLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        customer = serializer.validated_data["customer"]
        refresh = RefreshToken.for_user(customer)
        return Response(
            {
                "customer": CustomerProfileSerializer(customer).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        )


class CustomerMeView(generics.RetrieveUpdateAPIView):
    authentication_classes = [CustomerJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CustomerProfileSerializer

    def get_object(self):
        return self.request.user
