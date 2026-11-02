from rest_framework.routers import DefaultRouter
from .views import KYCViewSet
router=DefaultRouter(); router.register("applications",KYCViewSet)
urlpatterns=router.urls
