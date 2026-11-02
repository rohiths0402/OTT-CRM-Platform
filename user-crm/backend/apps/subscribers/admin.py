from django.contrib import admin
from .models import Subscriber, SubscriptionPlan, Subscription

admin.site.register([Subscriber, SubscriptionPlan, Subscription])
