from django.db import models
from apps.core.models import TimeStampedModel


class RewardAccount(TimeStampedModel):
    subscriber = models.OneToOneField(
        "subscribers.Subscriber",
        on_delete=models.PROTECT,
        related_name="reward_account",
    )
    points_balance = models.PositiveBigIntegerField(default=0)


class RewardTransaction(models.Model):
    class Kind(models.TextChoices):
        EARN = "earn", "Earn"
        REDEEM = "redeem", "Redeem"
        ADJUST = "adjust", "Adjust"

    account = models.ForeignKey(
        RewardAccount, on_delete=models.PROTECT, related_name="transactions"
    )
    kind = models.CharField(max_length=10, choices=Kind.choices)
    points = models.PositiveIntegerField()
    balance_after = models.PositiveBigIntegerField()
    reference = models.CharField(max_length=100, unique=True)
    reason = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
