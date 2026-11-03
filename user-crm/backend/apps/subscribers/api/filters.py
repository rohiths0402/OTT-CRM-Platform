from django.utils.dateparse import parse_date
from rest_framework.exceptions import ValidationError
from rest_framework.filters import BaseFilterBackend
from apps.subscribers.models import Subscriber, Subscription

class SubscriberFilterBackend(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        params = request.query_params
        status_value = params.get("status")
        if status_value:
            valid = [choice[0] for choice in Subscriber.Status.choices]
            if status_value not in valid:
                raise ValidationError({"status": f"Invalid status. Allowed: {', '.join(valid)}"})
            queryset = queryset.filter(status=status_value)
        for field in ("state", "country", "city"):
            value = params.get(field)
            if value: queryset = queryset.filter(**{f"{field}__iexact": value.strip()})
        subscription_status = params.get("subscriptionStatus") or params.get("subscription_status")
        if subscription_status:
            valid = [choice[0] for choice in Subscription.Status.choices]
            if subscription_status not in valid:
                raise ValidationError({"subscriptionStatus": f"Invalid subscription status. Allowed: {', '.join(valid)}"})
            queryset = queryset.filter(subscriptions__status=subscription_status)
        plan = params.get("plan")
        if plan:
            try: plan_id = int(plan)
            except (TypeError, ValueError): raise ValidationError({"plan": "Plan must be a positive integer."})
            if plan_id <= 0: raise ValidationError({"plan": "Plan must be a positive integer."})
            queryset = queryset.filter(subscriptions__plan_id=plan_id)
        for param, lookup in (("joinedAfter", "gte"), ("joinedBefore", "lte")):
            value = params.get(param)
            if value:
                parsed = parse_date(value)
                if parsed is None: raise ValidationError({param: "Use YYYY-MM-DD format."})
                queryset = queryset.filter(**{f"joined_at__date__{lookup}": parsed})
        return queryset.distinct()
