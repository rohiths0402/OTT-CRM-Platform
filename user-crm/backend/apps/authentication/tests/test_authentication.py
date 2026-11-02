from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

User = get_user_model()

class AuthenticationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="admin@loop.test", password="StrongPassword@123",
            first_name="Loop", role=User.Role.SUPER_ADMIN,
            is_staff=True, is_superuser=True,
        )
    def test_login_with_correct_role(self):
        response = self.client.post(reverse("login"), {
            "email": "admin@loop.test", "password": "StrongPassword@123",
            "role": "super_admin", "remember_me": True,
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data["data"]["tokens"])
    def test_login_rejects_wrong_role(self):
        response = self.client.post(reverse("login"), {
            "email": "admin@loop.test", "password": "StrongPassword@123",
            "role": "analyst", "remember_me": False,
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    def test_registration_by_super_admin(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(reverse("register"), {
            "email": "analyst@loop.test", "password": "StrongPassword@123",
            "first_name": "Loop", "last_name": "Analyst", "role": "analyst",
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
