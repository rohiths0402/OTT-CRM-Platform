from django.db import transaction
from django.core.exceptions import ValidationError
from apps.rewards.models import RewardAccount, RewardTransaction


@transaction.atomic
def post_points(*, account_id, kind, points, reference, reason=""):
    if points <= 0:
        raise ValidationError("Points must be positive.")
    account = RewardAccount.objects.select_for_update().get(pk=account_id)
    if kind == RewardTransaction.Kind.REDEEM:
        if account.points_balance < points:
            raise ValidationError("Insufficient points.")
        account.points_balance -= points
    else:
        account.points_balance += points
    account.save(update_fields=["points_balance", "updated_at"])
    return RewardTransaction.objects.create(
        account=account,
        kind=kind,
        points=points,
        balance_after=account.points_balance,
        reference=reference,
        reason=reason,
    )
