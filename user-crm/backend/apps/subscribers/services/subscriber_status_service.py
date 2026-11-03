
from django.db import transaction
from django.core.exceptions import ValidationError

from apps.subscribers.models import Subscriber


ALLOWED_TRANSITIONS = {
    Subscriber.Status.ACTIVE: {
        Subscriber.Status.SUSPENDED,
        Subscriber.Status.CLOSED,
    },
    Subscriber.Status.SUSPENDED: {
        Subscriber.Status.ACTIVE,
        Subscriber.Status.CLOSED,
    },
    Subscriber.Status.CLOSED: set(),
}


@transaction.atomic
def change_subscriber_status(
    subscriber_id: int,
    new_status: str,
):

    valid_statuses = Subscriber.Status.values

    if new_status not in valid_statuses:
        raise ValidationError(
            f"Invalid subscriber status: {new_status}"
        )

    try:
        subscriber = (
            Subscriber.objects
            .select_for_update()
            .get(pk=subscriber_id)
        )
    except Subscriber.DoesNotExist:
        raise ValidationError("Subscriber does not exist.")

    current_status = subscriber.status

    if current_status == new_status:
        return subscriber

    allowed = ALLOWED_TRANSITIONS.get(current_status, set())

    if new_status not in allowed:
        raise ValidationError(
            f"Cannot change subscriber status "
            f"from {current_status} to {new_status}."
        )

    subscriber.status = new_status

    subscriber.save(update_fields=["status", "updated_at"])

    return subscriber


def suspend_subscriber(subscriber_id: int):
    return change_subscriber_status(
        subscriber_id,
        Subscriber.Status.SUSPENDED,
    )


def activate_subscriber(subscriber_id: int):
    return change_subscriber_status(
        subscriber_id,
        Subscriber.Status.ACTIVE,
    )


def close_subscriber(subscriber_id: int):
    return change_subscriber_status(
        subscriber_id,
        Subscriber.Status.CLOSED,
    )
