from rest_framework import viewsets,filters
from apps.core.permissions import IsAdminOrSuperAdmin,IsAnalystOrAdmin
from apps.subscribers.models import Subscriber,Subscription,SubscriptionPlan
from .serializers import SubscriberSerializer,SubscriptionSerializer,SubscriptionPlanSerializer
class SubscriberViewSet(viewsets.ModelViewSet):
    queryset=Subscriber.objects.select_related("user").all().order_by("-created_at"); serializer_class=SubscriberSerializer; permission_classes=[IsAdminOrSuperAdmin]; filter_backends=[filters.SearchFilter,filters.OrderingFilter]; search_fields=["user__email","user__full_name","phone","state"]; ordering_fields=["created_at","joined_at","state"]
class SubscriptionPlanViewSet(viewsets.ModelViewSet):
    queryset=SubscriptionPlan.objects.all().order_by("price"); serializer_class=SubscriptionPlanSerializer; permission_classes=[IsAdminOrSuperAdmin]
class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset=Subscription.objects.select_related("subscriber__user","plan").all(); serializer_class=SubscriptionSerializer; permission_classes=[IsAdminOrSuperAdmin]
