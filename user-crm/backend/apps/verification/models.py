from django.conf import settings
from django.db import models
from apps.core.models import TimeStampedModel


class KYCApplication(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        NEEDS_INFO = "needs_info", "Needs information"

    subscriber = models.ForeignKey(
        "subscribers.Subscriber",
        on_delete=models.PROTECT,
        related_name="kyc_applications",
    )
    document_type = models.CharField(max_length=40)
    document_reference = models.CharField(max_length=120, blank=True)
    document_file = models.FileField(upload_to="kyc/%Y/%m/", blank=True)
    status = models.CharField(
        max_length=15, choices=Status.choices, default=Status.PENDING, db_index=True
    )
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="kyc_reviews",
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    review_note = models.TextField(blank=True)

    class Meta:
        indexes = [models.Index(fields=["status", "created_at"])]
