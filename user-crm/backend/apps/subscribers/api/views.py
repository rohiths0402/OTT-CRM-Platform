from rest_framework import filters, viewsets
from apps.core.permissions import IsAdminOrSuperAdmin
from apps.subscribers.models import Subscriber, Subscription, SubscriptionPlan
from apps.subscribers.permissions import (
    CanManageSubscribers,
    CanManageSubscriptionPlans,
)
from .filters import SubscriberFilterBackend
from .serializers import (
    SubscriberSerializer,
    SubscriptionSerializer,
    SubscriptionPlanSerializer,
)


class SubscriberViewSet(viewsets.ModelViewSet):
    queryset = (
        Subscriber.objects.select_related("user", "customer")
        .all()
        .order_by("-created_at")
    )
    serializer_class = SubscriberSerializer
    permission_classes = [CanManageSubscribers]
    filter_backends = [
        SubscriberFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = [
        "customer__email",
        "customer__full_name",
        "user__email",
        "user__full_name",
        "phone",
        "state",
        "city",
        "country",
    ]
    ordering_fields = ["created_at", "joined_at", "state"]
    ordering = ["-created_at"]


class SubscriptionPlanViewSet(viewsets.ModelViewSet):
    queryset = SubscriptionPlan.objects.all().order_by("price")
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [CanManageSubscriptionPlans]


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.select_related(
        "subscriber__user", "subscriber__customer", "plan"
    ).all()
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAdminOrSuperAdmin]
