from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .admin_views import (
    WalletViewSet,
    RewardAccountViewSet,
    ViewingSessionViewSet,
    EngagementOverviewView,
    BroadcastViewSet,
    RoleViewSet,
    EmployeeRoleView,
    AuditLogViewSet,
    AdvertisingOverviewView,
    AudienceOverviewView,
    RevenueOverviewView,
)

router = DefaultRouter()
router.register("wallets", WalletViewSet, basename="admin-wallets")
router.register(
    "rewards/accounts", RewardAccountViewSet, basename="admin-reward-accounts"
)
router.register(
    "viewing-sessions", ViewingSessionViewSet, basename="admin-viewing-sessions"
)
router.register("broadcast/campaigns", BroadcastViewSet, basename="broadcast-campaigns")
router.register("roles", RoleViewSet, basename="admin-roles")
router.register("audit-logs", AuditLogViewSet, basename="audit-logs")


urlpatterns = [
    path("", include(router.urls)),
    path("employee-roles/", EmployeeRoleView.as_view(), name="employee-roles"),
    path(
        "analytics/engagement/",
        EngagementOverviewView.as_view(),
        name="engagement-overview",
    ),
    path(
        "analytics/advertising/",
        AdvertisingOverviewView.as_view(),
        name="advertising-overview",
    ),
    path(
        "analytics/audience/", AudienceOverviewView.as_view(), name="audience-overview"
    ),
    path("analytics/revenue/", RevenueOverviewView.as_view(), name="revenue-overview"),
]
