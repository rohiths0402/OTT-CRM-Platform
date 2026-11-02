from rest_framework import serializers
from apps.subscribers.models import Subscriber, Subscription, SubscriptionPlan
class SubscriberSerializer(serializers.ModelSerializer):
    email=serializers.EmailField(source="user.email",read_only=True); full_name=serializers.CharField(source="user.full_name",read_only=True)
    class Meta: model=Subscriber; fields="__all__"
class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta: model=SubscriptionPlan; fields="__all__"
class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta: model=Subscription; fields="__all__"
