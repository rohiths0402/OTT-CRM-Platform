from django.core.exceptions import ValidationError
from django.db import transaction
from ..models import Subscriber
from ..selectors.subscriber_selectors import (
    get_subscriber_by_id,
    get_subscriber_by_email,
)
from .subscriber_status_service import close_subscriber


@transaction.atomic
def create_subscriber(
    *, user=None, customer=None, phone="", country="IN", state="", city=""
):
    if bool(user) == bool(customer):
        raise ValidationError("Provide exactly one of user or customer.")
    if user and Subscriber.objects.filter(user=user).exists():
        raise ValidationError("A subscriber profile already exists for this user.")
    if customer and Subscriber.objects.filter(customer=customer).exists():
        raise ValidationError("A subscriber profile already exists for this customer.")
    return Subscriber.objects.create(
        user=user,
        customer=customer,
        phone=phone,
        country=country,
        state=state,
        city=city,
    )


@transaction.atomic
def update_subscriber(subscriber_id, **validated_data):
    subscriber = Subscriber.objects.select_for_update().filter(pk=subscriber_id).first()
    if subscriber is None:
        raise ValidationError("Subscriber does not exist.")
    allowed = {"phone", "country", "state", "city"}
    invalid = set(validated_data) - allowed
    if invalid:
        raise ValidationError(
            {"fields": "These fields cannot be updated: " + ", ".join(sorted(invalid))}
        )
    for field, value in validated_data.items():
        setattr(subscriber, field, value)
    if validated_data:
        subscriber.save(update_fields=[*validated_data.keys(), "updated_at"])
    return subscriber


def retrieve_subscriber(subscriber_id):
    item = get_subscriber_by_id(subscriber_id)
    if item is None:
        raise ValidationError("Subscriber does not exist.")
    return item


def retrieve_subscriber_by_email(email):
    item = get_subscriber_by_email(email)
    if item is None:
        raise ValidationError("Subscriber does not exist.")
    return item


def delete_subscriber(subscriber_id):
    return close_subscriber(subscriber_id)
