from decimal import Decimal, InvalidOperation
from uuid import uuid4
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Sum, Count, Avg, F
from django.utils import timezone
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.analytics.selectors.revenue import revenue_overview
from apps.core.permissions import IsAdminOrSuperAdmin, IsAnalystOrAdmin
from apps.authentication.models import UserRole, AuditLog
from apps.roles.models import Role
from apps.subscribers.models import Subscriber
from apps.finance.models import Wallet, WalletTransaction
from apps.rewards.models import RewardAccount, RewardTransaction
from apps.playback.models import ViewingSession
from apps.communication.models import Notification
from apps.analytics.models import DailyMetric
from apps.advertising.models import AdEvent, AdCampaign

User = get_user_model()


def audit(request, action_name, details=None):
    ip = request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[
        0
    ].strip() or request.META.get("REMOTE_ADDR")
    AuditLog.objects.create(
        user=request.user,
        action=action_name,
        details=details or {},
        ip_address=ip or None,
    )


class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = (
            "id",
            "kind",
            "amount",
            "balance_after",
            "reference",
            "description",
            "created_at",
        )
        read_only_fields = fields


class WalletAdminSerializer(serializers.ModelSerializer):
    subscriber_id = serializers.IntegerField(read_only=True)
    email = serializers.CharField(source="subscriber.email", read_only=True)
    full_name = serializers.CharField(source="subscriber.full_name", read_only=True)
    transactions = WalletTransactionSerializer(many=True, read_only=True)

    class Meta:
        model = Wallet
        fields = (
            "id",
            "subscriber_id",
            "email",
            "full_name",
            "balance",
            "currency",
            "created_at",
            "updated_at",
            "transactions",
        )


class WalletViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = WalletAdminSerializer
    permission_classes = [IsAdminOrSuperAdmin]
    queryset = (
        Wallet.objects.select_related("subscriber__customer", "subscriber__user")
        .prefetch_related("transactions")
        .all()
        .order_by("-updated_at")
    )

    @action(detail=True, methods=["post"])
    def adjust(self, request, pk=None):
        wallet = self.get_object()
        kind = request.data.get("kind")
        if kind not in ("credit", "debit", "refund"):
            return Response(
                {"detail": "kind must be credit, debit, or refund."}, status=400
            )
        try:
            amount = Decimal(str(request.data.get("amount", "")))
            if not amount.is_finite() or amount <= 0:
                raise InvalidOperation
        except (InvalidOperation, ValueError):
            return Response(
                {"detail": "amount must be a positive decimal."}, status=400
            )
        with transaction.atomic():
            wallet = Wallet.objects.select_for_update().get(pk=wallet.pk)
            new_balance = (
                wallet.balance + amount
                if kind in ("credit", "refund")
                else wallet.balance - amount
            )
            if new_balance < 0:
                return Response({"detail": "Insufficient wallet balance."}, status=400)
            wallet.balance = new_balance
            wallet.save(update_fields=["balance", "updated_at"])
            tx = WalletTransaction.objects.create(
                wallet=wallet,
                kind=kind,
                amount=amount,
                balance_after=new_balance,
                reference=f"ADMIN-{uuid4().hex}",
                description=str(request.data.get("description", "Admin adjustment"))[
                    :255
                ],
            )
            audit(
                request,
                "wallet.adjust",
                {
                    "wallet_id": wallet.pk,
                    "transaction_id": tx.pk,
                    "kind": kind,
                    "amount": str(amount),
                },
            )
        return Response(
            {
                "wallet": WalletAdminSerializer(wallet).data,
                "transaction": WalletTransactionSerializer(tx).data,
            }
        )


class RewardTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardTransaction
        fields = (
            "id",
            "kind",
            "points",
            "balance_after",
            "reference",
            "reason",
            "created_at",
        )
        read_only_fields = fields


class RewardAccountSerializer(serializers.ModelSerializer):
    subscriber_id = serializers.IntegerField(read_only=True)
    email = serializers.CharField(source="subscriber.email", read_only=True)
    full_name = serializers.CharField(source="subscriber.full_name", read_only=True)
    transactions = RewardTransactionSerializer(many=True, read_only=True)

    class Meta:
        model = RewardAccount
        fields = (
            "id",
            "subscriber_id",
            "email",
            "full_name",
            "points_balance",
            "created_at",
            "updated_at",
            "transactions",
        )


class RewardAccountViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RewardAccountSerializer
    permission_classes = [IsAdminOrSuperAdmin]
    queryset = (
        RewardAccount.objects.select_related("subscriber__customer", "subscriber__user")
        .prefetch_related("transactions")
        .all()
        .order_by("-updated_at")
    )

    @action(detail=True, methods=["post"])
    def adjust(self, request, pk=None):
        account = self.get_object()
        kind = request.data.get("kind", "adjust")
        if kind not in ("earn", "redeem", "adjust"):
            return Response(
                {"detail": "kind must be earn, redeem, or adjust."}, status=400
            )
        try:
            points = int(request.data.get("points"))
            if points <= 0:
                raise ValueError
        except (TypeError, ValueError):
            return Response(
                {"detail": "points must be a positive integer."}, status=400
            )
        with transaction.atomic():
            account = RewardAccount.objects.select_for_update().get(pk=account.pk)
            balance = (
                account.points_balance + points
                if kind in ("earn", "adjust")
                else account.points_balance - points
            )
            if balance < 0:
                return Response({"detail": "Insufficient reward points."}, status=400)
            account.points_balance = balance
            account.save(update_fields=["points_balance", "updated_at"])
            tx = RewardTransaction.objects.create(
                account=account,
                kind=kind,
                points=points,
                balance_after=balance,
                reference=f"ADMIN-{uuid4().hex}",
                reason=str(request.data.get("reason", "Admin adjustment"))[:255],
            )
            audit(
                request,
                "rewards.adjust",
                {
                    "account_id": account.pk,
                    "transaction_id": tx.pk,
                    "kind": kind,
                    "points": points,
                },
            )
        return Response(
            {
                "account": RewardAccountSerializer(account).data,
                "transaction": RewardTransactionSerializer(tx).data,
            }
        )


class ViewingSessionSerializer(serializers.ModelSerializer):
    subscriber_email = serializers.CharField(source="subscriber.email", read_only=True)
    subscriber_name = serializers.CharField(
        source="subscriber.full_name", read_only=True
    )
    title_name = serializers.CharField(source="title.name", read_only=True)

    class Meta:
        model = ViewingSession
        fields = (
            "id",
            "subscriber_id",
            "subscriber_email",
            "subscriber_name",
            "title_id",
            "title_name",
            "started_at",
            "ended_at",
            "watched_seconds",
            "completion_percent",
            "device_type",
            "state",
        )


class ViewingSessionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ViewingSessionSerializer
    permission_classes = [IsAnalystOrAdmin]
    queryset = (
        ViewingSession.objects.select_related(
            "subscriber__customer", "subscriber__user", "title"
        )
        .all()
        .order_by("-started_at")
    )

    def get_queryset(self):
        qs = super().get_queryset()
        subscriber_id = self.request.query_params.get("subscriber")
        title_id = self.request.query_params.get("title")
        device = self.request.query_params.get("device")
        if subscriber_id:
            qs = qs.filter(subscriber_id=subscriber_id)
        if title_id:
            qs = qs.filter(title_id=title_id)
        if device:
            qs = qs.filter(device_type=device)
        return qs


class EngagementOverviewView(APIView):
    permission_classes = [IsAnalystOrAdmin]

    def get(self, request):
        try:
            days = min(max(int(request.query_params.get("days", 30)), 1), 365)
        except ValueError:
            return Response({"detail": "days must be an integer."}, status=400)
        since = timezone.now() - timedelta(days=days)
        sessions = ViewingSession.objects.filter(started_at__gte=since)
        return Response(
            {
                "period_days": days,
                "total_sessions": sessions.count(),
                "unique_viewers": sessions.values("subscriber_id").distinct().count(),
                "watch_hours": round(
                    (sessions.aggregate(v=Sum("watched_seconds"))["v"] or 0) / 3600, 2
                ),
                "average_completion_percent": sessions.aggregate(
                    v=Avg("completion_percent")
                )["v"]
                or 0,
                "device_breakdown": list(
                    sessions.values("device_type")
                    .annotate(sessions=Count("id"))
                    .order_by("-sessions")
                ),
                "daily_watch_seconds": list(
                    sessions.values("started_at__date")
                    .annotate(watch_seconds=Sum("watched_seconds"))
                    .order_by("started_at__date")
                ),
            }
        )


class BroadcastViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminOrSuperAdmin]

    def list(self, request):
        rows = AuditLog.objects.filter(action="broadcast.created").order_by(
            "-created_at"
        )[:100]
        return Response(
            [{"id": r.id, "created_at": r.created_at, **r.details} for r in rows]
        )

    def create(self, request):
        title = str(request.data.get("title", "")).strip()
        body = str(request.data.get("body", "")).strip()
        channel = request.data.get("channel", "in_app")
        ids = request.data.get("subscriber_ids")
        if not title or not body:
            return Response({"detail": "title and body are required."}, status=400)
        if channel not in Notification.Channel.values:
            return Response({"detail": "Invalid notification channel."}, status=400)
        qs = Subscriber.objects.filter(status=Subscriber.Status.ACTIVE).select_related(
            "customer", "user"
        )
        if ids is not None:
            if not isinstance(ids, list):
                return Response(
                    {"detail": "subscriber_ids must be a list."}, status=400
                )
            qs = qs.filter(id__in=ids)
        customers = []
        for sub in qs.iterator():
            if sub.customer_id:
                customers.append(
                    Notification(
                        customer_id=sub.customer_id,
                        title=title[:160],
                        body=body,
                        channel=channel,
                    )
                )
            elif sub.user_id:
                customers.append(
                    Notification(
                        recipient_id=sub.user_id,
                        title=title[:160],
                        body=body,
                        channel=channel,
                    )
                )
        Notification.objects.bulk_create(customers, batch_size=1000)
        details = {
            "title": title[:160],
            "body": body,
            "channel": channel,
            "recipient_count": len(customers),
            "subscriber_ids": ids,
        }
        audit(request, "broadcast.created", details)
        return Response(details, status=status.HTTP_201_CREATED)


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ("id", "code", "name", "description", "is_active", "created_at")
        read_only_fields = ("id", "created_at")


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all().order_by("name")
    serializer_class = RoleSerializer
    permission_classes = [IsAdminOrSuperAdmin]


class EmployeeRoleView(APIView):
    permission_classes = [IsAdminOrSuperAdmin]

    def get(self, request):
        rows = User.objects.prefetch_related("roles").order_by("email")
        return Response(
            [
                {
                    "id": u.id,
                    "email": u.email,
                    "full_name": u.full_name,
                    "is_active": u.is_active,
                    "roles": [
                        {"id": r.id, "code": r.code, "name": r.name}
                        for r in u.roles.all()
                    ],
                }
                for u in rows
            ]
        )

    def post(self, request):
        user_id, role_id = request.data.get("user_id"), request.data.get("role_id")
        try:
            user, role = User.objects.get(pk=user_id), Role.objects.get(pk=role_id)
        except (User.DoesNotExist, Role.DoesNotExist, TypeError, ValueError):
            return Response(
                {"detail": "Valid user_id and role_id are required."}, status=400
            )
        UserRole.objects.get_or_create(
            user=user, role=role, defaults={"assigned_by": request.user}
        )
        audit(request, "roles.assign", {"user_id": user.pk, "role_id": role.pk})
        return Response(
            {"detail": "Role assigned.", "user_id": user.pk, "role_id": role.pk},
            status=201,
        )

    def delete(self, request):
        user_id, role_id = request.data.get("user_id"), request.data.get("role_id")
        deleted, _ = UserRole.objects.filter(user_id=user_id, role_id=role_id).delete()
        if deleted:
            audit(request, "roles.revoke", {"user_id": user_id, "role_id": role_id})
        return Response({"deleted": bool(deleted)})


class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(
        source="user.email", read_only=True, default=None
    )

    class Meta:
        model = AuditLog
        fields = (
            "id",
            "user_id",
            "user_email",
            "action",
            "details",
            "ip_address",
            "created_at",
        )


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminOrSuperAdmin]
    queryset = AuditLog.objects.select_related("user").all().order_by("-created_at")

    def get_queryset(self):
        qs = super().get_queryset()
        action_name = self.request.query_params.get("action")
        user_id = self.request.query_params.get("user")
        if action_name:
            qs = qs.filter(action=action_name)
        if user_id:
            qs = qs.filter(user_id=user_id)
        return qs


class AdvertisingOverviewView(APIView):
    permission_classes = [IsAnalystOrAdmin]

    def get(self, request):
        try:
            days = min(max(int(request.query_params.get("days", 30)), 1), 365)
        except ValueError:
            return Response({"detail": "days must be an integer."}, status=400)
        since = timezone.now() - timedelta(days=days)
        events = AdEvent.objects.filter(occurred_at__gte=since)
        impressions = events.filter(kind=AdEvent.Kind.IMPRESSION).count()
        completions = events.filter(kind=AdEvent.Kind.COMPLETE).count()
        revenue = events.aggregate(v=Sum("revenue"))["v"] or 0
        campaigns = AdCampaign.objects.filter(is_active=True).count()
        return Response(
            {
                "period_days": days,
                "impressions": impressions,
                "completions": completions,
                "completion_rate": (
                    round(completions / impressions * 100, 2) if impressions else 0
                ),
                "revenue": revenue,
                "active_campaigns": campaigns,
                "events_by_region": list(
                    events.values("region")
                    .annotate(impressions=Count("id"))
                    .order_by("-impressions")[:20]
                ),
            }
        )


class AudienceOverviewView(APIView):
    permission_classes = [IsAnalystOrAdmin]

    def get(self, request):
        try:
            days = min(max(int(request.query_params.get("days", 30)), 1), 365)
        except ValueError:
            return Response({"detail": "days must be an integer."}, status=400)
        since = timezone.now() - timedelta(days=days)
        subs = Subscriber.objects.filter(joined_at__gte=since)
        sessions = ViewingSession.objects.filter(started_at__gte=since)
        regions = (
            Subscriber.objects.values("state")
            .annotate(subscribers=Count("id"))
            .order_by("-subscribers")[:30]
        )
        session_regions = sessions.values("subscriber__state").annotate(
            active_viewers=Count("subscriber_id", distinct=True),
            watch_seconds=Sum("watched_seconds"),
        )
        session_by_state = {row["subscriber__state"]: row for row in session_regions}
        region_rows = []
        for row in regions:
            session_row = session_by_state.get(row["state"], {})
            region_rows.append(
                {
                    "state": row["state"] or "Unknown",
                    "subscribers": row["subscribers"],
                    "active_viewers": session_row.get("active_viewers", 0),
                    "watch_hours": round(
                        (session_row.get("watch_seconds") or 0) / 3600, 2
                    ),
                }
            )
        return Response(
            {
                "period_days": days,
                "new_subscribers": subs.count(),
                "subscribers_by_state": region_rows,
                "active_viewers": sessions.values("subscriber_id").distinct().count(),
                "watch_hours": round(
                    (sessions.aggregate(v=Sum("watched_seconds"))["v"] or 0) / 3600, 2
                ),
            }
        )


class RevenueOverviewView(APIView):
    permission_classes = [IsAnalystOrAdmin]

    def get(self, request):
        try:
            days = int(request.query_params.get("days", 30))
            days = min(max(days, 1), 365)
        except (TypeError, ValueError):
            return Response(
                {"detail": "days must be an integer."},
                status=400,
            )

        data = revenue_overview(days)

        return Response(data)
