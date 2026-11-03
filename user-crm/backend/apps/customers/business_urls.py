from django.urls import path
from .business_views import CustomerWalletView, CustomerRewardsView, CustomerSubscriptionsView, CustomerViewingHistoryView
from .subscription_views import CustomerSubscriptionPurchaseView
urlpatterns = [
 path("wallet/", CustomerWalletView.as_view(), name="customer-wallet"),
 path("rewards/", CustomerRewardsView.as_view(), name="customer-rewards"),
 path("subscriptions/", CustomerSubscriptionsView.as_view(), name="customer-subscriptions"),
 path("subscriptions/purchase/", CustomerSubscriptionPurchaseView.as_view(), name="customer-subscription-purchase"),
 path("viewing-history/", CustomerViewingHistoryView.as_view(), name="customer-viewing-history"),
]
