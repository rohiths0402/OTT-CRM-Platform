import uuid
from datetime import timedelta
from django.db import transaction
from django.utils import timezone
from rest_framework import permissions
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.customers.authentication import CustomerJWTAuthentication
from apps.subscribers.models import Subscriber, Subscription, SubscriptionPlan
from apps.finance.models import Wallet, WalletTransaction
from apps.finance.services.wallet import post_wallet_transaction

class CustomerSubscriptionPurchaseView(APIView):
    authentication_classes = [CustomerJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        try:
            plan_id = int(request.data.get("planId"))
        except (TypeError, ValueError):
            raise ValidationError({"planId": "A valid planId is required."})
        plan = SubscriptionPlan.objects.select_for_update().filter(pk=plan_id, is_active=True).first()
        if not plan:
            raise ValidationError({"planId": "Subscription plan not found or inactive."})
        subscriber = Subscriber.objects.select_for_update().get(customer=request.user)
        now = timezone.now()
        active = Subscription.objects.filter(subscriber=subscriber, status=Subscription.Status.ACTIVE, ends_at__gt=now).order_by("-ends_at").first()
        if active:
            raise ValidationError({"subscription": "An active subscription already exists."})
        wallet = Wallet.objects.select_for_update().filter(subscriber=subscriber).first()
        if not wallet:
            raise ValidationError({"wallet": "Wallet is not initialized."})
        reference = f"SUB-{uuid.uuid4().hex.upper()}"
        transaction_record = None
        if plan.price > 0:
            try:
                transaction_record = post_wallet_transaction(wallet_id=wallet.id, kind=WalletTransaction.Kind.DEBIT, amount=plan.price, reference=reference, description=f"Subscription purchase: {plan.name}")
            except Exception as exc:
                raise ValidationError({"payment": str(exc)})
        subscription = Subscription.objects.create(subscriber=subscriber, plan=plan, status=Subscription.Status.ACTIVE, starts_at=now, ends_at=now + timedelta(days=plan.duration_days))
        return Response({"subscriptionId": subscription.id, "plan": plan.name, "status": subscription.status, "startsAt": subscription.starts_at, "endsAt": subscription.ends_at, "amountPaid": str(plan.price), "walletBalance": str(transaction_record.balance_after) if transaction_record else str(wallet.balance)}, status=201)
