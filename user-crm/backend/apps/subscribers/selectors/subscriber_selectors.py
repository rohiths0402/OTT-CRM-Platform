from django.db.models import Count
from apps.subscribers.models import Subscriber, Subscription


def get_subscriber_queryset():
    return Subscriber.objects.select_related("user", "customer").prefetch_related(
        "subscriptions__plan"
    )


def get_subscriber_by_id(subscriber_id):
    return get_subscriber_queryset().filter(pk=subscriber_id).first()


def get_subscriber_by_email(email):
    return (
        get_subscriber_queryset().filter(customer__email__iexact=email.strip()).first()
        or get_subscriber_queryset().filter(user__email__iexact=email.strip()).first()
    )


def get_active_subscribers():
    return get_subscriber_queryset().filter(status=Subscriber.Status.ACTIVE)


def get_subscribers_by_state(state):
    return get_subscriber_queryset().filter(state__iexact=state.strip())


def get_subscriber_statistics():
    counts = Subscriber.objects.values("status").annotate(total=Count("id"))
    return {row["status"]: row["total"] for row in counts}
