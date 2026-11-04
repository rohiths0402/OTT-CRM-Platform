from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import KYCViewSet, CustomerKYCView

router = DefaultRouter()
router.register("applications", KYCViewSet, basename="kyc-application")
urlpatterns = [
    path("my-application/", CustomerKYCView.as_view(), name="customer-kyc")
] + router.urls
