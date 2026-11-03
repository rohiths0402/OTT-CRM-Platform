from rest_framework import serializers
from apps.subscribers.models import Subscriber, Subscription, SubscriptionPlan

class SubscriberSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()
    fullName = serializers.SerializerMethodField()
    customerId = serializers.IntegerField(source="customer_id", read_only=True)
    class Meta:
        model = Subscriber
        fields = ("id", "customerId", "email", "fullName", "phone", "country", "state", "city", "status", "joined_at", "created_at", "updated_at")
        read_only_fields = ("id", "email", "fullName", "customerId", "joined_at", "created_at", "updated_at")
    def get_email(self, obj): return obj.email
    def get_fullName(self, obj): return obj.full_name

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = "__all__"

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = "__all__"
