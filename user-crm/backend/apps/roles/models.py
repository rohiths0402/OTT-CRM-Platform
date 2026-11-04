from django.db import models


class Role(models.Model):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    ANALYST = "analyst"
    SUPPORT = "support"

    ROLE_CHOICES = [
        (SUPER_ADMIN, "Super Admin"),
        (ADMIN, "Admin"),
        (ANALYST, "Analyst"),
        (SUPPORT, "Support"),
    ]

    code = models.CharField(
        max_length=30,
        choices=ROLE_CHOICES,
        unique=True
    )

    name = models.CharField(max_length=80)
    description = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name