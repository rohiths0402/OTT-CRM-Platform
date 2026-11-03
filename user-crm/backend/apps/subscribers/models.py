from django.conf import settings
from django.db import models
from django.db.models import Q
from apps.core.models import TimeStampedModel

class Subscriber(TimeStampedModel):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        SUSPENDED = "suspended", "Suspended"
        CLOSED = "closed", "Closed"

    # user is retained temporarily for compatibility with existing CRM-created test/data rows.
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="subscriber_profile", null=True, blank=True)
    customer = models.OneToOneField("customers.Customer", on_delete=models.PROTECT, related_name="subscriber_profile", null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True, db_index=True)
    country = models.CharField(max_length=2, default="IN")
    state = models.CharField(max_length=100, blank=True, db_index=True)
    city = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.ACTIVE, db_index=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["status", "joined_at"]), models.Index(fields=["state", "status"])]
        constraints = [models.CheckConstraint(condition=(Q(user__isnull=False, customer__isnull=True) | Q(user__isnull=True, customer__isnull=False)), name="subscriber_one_identity_only")]

    @property
    def email(self):
        return self.customer.email if self.customer_id else (self.user.email if self.user_id else "")

    @property
    def full_name(self):
        return self.customer.full_name if self.customer_id else (self.user.full_name if self.user_id else "")

    def __str__(self):
        return self.email

class SubscriptionPlan(TimeStampedModel):
    name = models.CharField(max_length=80, unique=True)
    code = models.SlugField(unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.PositiveSmallIntegerField(default=30)
    is_active = models.BooleanField(default=True)

class Subscription(TimeStampedModel):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        EXPIRED = "expired", "Expired"
        CANCELLED = "cancelled", "Cancelled"
    subscriber = models.ForeignKey(Subscriber, on_delete=models.PROTECT, related_name="subscriptions")
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.PROTECT)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.ACTIVE, db_index=True)
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField(db_index=True)
    class Meta:
        indexes = [models.Index(fields=["status", "ends_at"])]
