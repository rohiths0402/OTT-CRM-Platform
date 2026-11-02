from rest_framework.routers import DefaultRouter
from .views import SubscriberViewSet,SubscriptionViewSet,SubscriptionPlanViewSet
router=DefaultRouter(); router.register("subscribers",SubscriberViewSet); router.register("subscriptions",SubscriptionViewSet); router.register("plans",SubscriptionPlanViewSet)
urlpatterns=router.urls
