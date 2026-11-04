from django.urls import path
from .notification_views import (
    CustomerNotificationListView,
    CustomerNotificationReadView,
)

urlpatterns = [
    path(
        "notifications/",
        CustomerNotificationListView.as_view(),
        name="customer-notifications",
    ),
    path(
        "notifications/<int:pk>/read/",
        CustomerNotificationReadView.as_view(),
        name="customer-notification-read",
    ),
]
