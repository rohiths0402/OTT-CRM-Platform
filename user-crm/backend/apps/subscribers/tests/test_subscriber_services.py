
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

from apps.subscribers.models import Subscriber
from apps.subscribers.services.subscriber_service import (
    create_subscriber,
    update_subscriber,
    retrieve_subscriber,
    delete_subscriber,
)
from apps.subscribers.services.subscriber_status_service import (
    suspend_subscriber,
    activate_subscriber,
    close_subscriber,
    change_subscriber_status,
)

User = get_user_model()


class SubscriberServiceTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="customer@example.com",
            full_name="Test Customer",
            password="TestPassword@123",
        )

        self.subscriber = create_subscriber(
            user=self.user,
            phone="9876543210",
            country="IN",
            state="Tamil Nadu",
            city="Chennai",
        )

    def test_create_subscriber(self):
        self.assertEqual(self.subscriber.user, self.user)
        self.assertEqual(
            self.subscriber.status,
            Subscriber.Status.ACTIVE,
        )

    def test_duplicate_subscriber_rejected(self):
        with self.assertRaises(ValidationError):
            create_subscriber(user=self.user)

    def test_update_subscriber(self):
        result = update_subscriber(
            self.subscriber.id,
            city="Coimbatore",
        )
        self.assertEqual(result.city, "Coimbatore")

    def test_invalid_update_field(self):
        with self.assertRaises(ValidationError):
            update_subscriber(
                self.subscriber.id,
                status=Subscriber.Status.CLOSED,
            )

    def test_retrieve_subscriber(self):
        result = retrieve_subscriber(self.subscriber.id)
        self.assertEqual(result.id, self.subscriber.id)

    def test_suspend_subscriber(self):
        result = suspend_subscriber(self.subscriber.id)
        self.assertEqual(
            result.status,
            Subscriber.Status.SUSPENDED,
        )

    def test_reactivate_subscriber(self):
        suspend_subscriber(self.subscriber.id)
        result = activate_subscriber(self.subscriber.id)

        self.assertEqual(
            result.status,
            Subscriber.Status.ACTIVE,
        )

    def test_close_subscriber(self):
        result = close_subscriber(self.subscriber.id)
        self.assertEqual(
            result.status,
            Subscriber.Status.CLOSED,
        )

    def test_closed_subscriber_cannot_reactivate(self):
        close_subscriber(self.subscriber.id)

        with self.assertRaises(ValidationError):
            activate_subscriber(self.subscriber.id)

    def test_invalid_status_rejected(self):
        with self.assertRaises(ValidationError):
            change_subscriber_status(
                self.subscriber.id,
                "invalid_status",
            )

    def test_soft_delete(self):
        result = delete_subscriber(self.subscriber.id)

        self.assertEqual(
            result.status,
            Subscriber.Status.CLOSED,
        )

        self.assertTrue(
            Subscriber.objects.filter(
                id=self.subscriber.id
            ).exists()
        )
