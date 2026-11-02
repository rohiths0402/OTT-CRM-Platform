from django.contrib import admin
from django.urls import path,include
urlpatterns=[
 path("admin/",admin.site.urls),
 path("api/auth/",include("apps.authentication.urls")),
 path("api/",include("apps.subscribers.api.urls")),
 path("api/kyc/",include("apps.verification.api.urls")),
 path("api/notifications/",include("apps.communication.api.urls")),
 path("api/command-center/",include("apps.command_center.api.urls")),
]
