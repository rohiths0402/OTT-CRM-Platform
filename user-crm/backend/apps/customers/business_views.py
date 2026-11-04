from rest_framework import generics, permissions, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.customers.authentication import CustomerJWTAuthentication
from apps.subscribers.models import Subscriber, Subscription
from apps.finance.models import Wallet, WalletTransaction
from apps.rewards.models import RewardAccount, RewardTransaction
from apps.playback.models import ViewingSession


class CustomerBaseView(APIView):
    authentication_classes = [CustomerJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_subscriber(self):
        return Subscriber.objects.select_related("customer").get(
            customer=self.request.user
        )


class CustomerWalletView(CustomerBaseView):
    def get(self, request):
        wallet = Wallet.objects.filter(subscriber=self.get_subscriber()).first()
        if not wallet:
            return Response({"balance": "0.00", "currency": "INR", "transactions": []})
        transactions = wallet.transactions.order_by("-created_at")[:50]
        return Response(
            {
                "balance": str(wallet.balance),
                "currency": wallet.currency,
                "transactions": [
                    {
                        "id": t.id,
                        "kind": t.kind,
                        "amount": str(t.amount),
                        "balanceAfter": str(t.balance_after),
                        "reference": t.reference,
                        "description": t.description,
                        "createdAt": t.created_at,
                    }
                    for t in transactions
                ],
            }
        )


class CustomerRewardsView(CustomerBaseView):
    def get(self, request):
        account = RewardAccount.objects.filter(subscriber=self.get_subscriber()).first()
        if not account:
            return Response({"pointsBalance": 0, "transactions": []})
        txns = account.transactions.order_by("-created_at")[:50]
        return Response(
            {
                "pointsBalance": account.points_balance,
                "transactions": [
                    {
                        "id": t.id,
                        "kind": t.kind,
                        "points": t.points,
                        "balanceAfter": t.balance_after,
                        "reference": t.reference,
                        "reason": t.reason,
                        "createdAt": t.created_at,
                    }
                    for t in txns
                ],
            }
        )


class CustomerSubscriptionsView(CustomerBaseView):
    def get(self, request):
        rows = (
            Subscription.objects.filter(subscriber=self.get_subscriber())
            .select_related("plan")
            .order_by("-starts_at")
        )
        return Response(
            [
                {
                    "id": s.id,
                    "plan": s.plan.name,
                    "planCode": s.plan.code,
                    "status": s.status,
                    "startsAt": s.starts_at,
                    "endsAt": s.ends_at,
                    "price": str(s.plan.price),
                }
                for s in rows
            ]
        )


class CustomerViewingHistoryView(CustomerBaseView):
    def get(self, request):
        rows = (
            ViewingSession.objects.filter(subscriber=self.get_subscriber())
            .select_related("title")
            .order_by("-started_at")[:100]
        )
        return Response(
            [
                {
                    "id": s.id,
                    "titleId": s.title_id,
                    "title": s.title.name,
                    "kind": s.title.kind,
                    "startedAt": s.started_at,
                    "endedAt": s.ended_at,
                    "watchedSeconds": s.watched_seconds,
                    "completionPercent": str(s.completion_percent),
                    "deviceType": s.device_type,
                }
                for s in rows
            ]
        )
