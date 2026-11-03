from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.authentication.urls")),
    path("api/customer/", include("apps.customers.urls")),
    path("api/customer/", include("apps.customers.business_urls")),
    path("api/customer/", include("apps.customers.notification_urls")),
    path("api/", include("apps.subscribers.api.urls")),
    path("api/kyc/", include("apps.verification.api.urls")),
    path("api/notifications/", include("apps.communication.api.urls")),
    path("api/content/", include("apps.content.api.urls")),
    path("api/command-center/", include("apps.command_center.api.urls")),
    path("api/admin/", include("apps.core.api.urls")),
]
