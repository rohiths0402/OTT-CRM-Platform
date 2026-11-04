
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient

from apps.roles.models import Role
from apps.subscribers.models import Subscriber

User = get_user_model()


class SubscriberAPITests(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.admin = self.create_user_with_role(
            "admin@example.com", "admin"
        )

        self.analyst = self.create_user_with_role(
            "analyst@example.com", "analyst"
        )

        self.support = self.create_user_with_role(
            "support@example.com", "support"
        )

        self.customer = User.objects.create_user(
            email="customer@example.com",
            full_name="Customer One",
            password="CustomerPassword@123",
        )

        self.subscriber = Subscriber.objects.create(
            user=self.customer,
            phone="9876543210",
            country="IN",
            state="Tamil Nadu",
            city="Chennai",
        )

        self.list_url = reverse("subscriber-list")

    def create_user_with_role(self, email, role_code):
        user = User.objects.create_user(
            email=email,
            full_name=role_code.title(),
            password="TestPassword@123",
        )

        role, _ = Role.objects.get_or_create(
            code=role_code,
            defaults={
                "name": role_code.replace("_", " ").title(),
                "is_active": True,
            },
        )

        user.assign_role(role)
        return user

    def test_unauthenticated_access_denied(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 401)

    def test_admin_can_list_subscribers(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 200)

    def test_analyst_can_list_subscribers(self):
        self.client.force_authenticate(user=self.analyst)

        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 200)

    def test_support_can_list_subscribers(self):
        self.client.force_authenticate(user=self.support)

        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 200)

    def test_analyst_cannot_create_subscribers(self):
        self.client.force_authenticate(user=self.analyst)

        response = self.client.post(
            self.list_url,
            {},
            format="json",
        )

        self.assertEqual(response.status_code, 403)

    def test_filter_by_state(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.get(
            self.list_url,
            {"state": "Tamil Nadu"},
        )

        self.assertEqual(response.status_code, 200)

    def test_invalid_status_returns_400(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.get(
            self.list_url,
            {"status": "unknown"},
        )

        self.assertEqual(response.status_code, 400)
