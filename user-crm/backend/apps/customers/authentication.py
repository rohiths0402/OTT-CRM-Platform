from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from .models import Customer

class CustomerJWTAuthentication(JWTAuthentication):
    """Validates OTT customer tokens against Customer, never employee User."""
    def get_user(self, validated_token):
        try:
            customer_id = validated_token["user_id"]
            customer = Customer.objects.get(pk=customer_id, is_active=True)
        except (KeyError, Customer.DoesNotExist, ValueError):
            raise AuthenticationFailed("Customer account not found or inactive.")
        return customer
