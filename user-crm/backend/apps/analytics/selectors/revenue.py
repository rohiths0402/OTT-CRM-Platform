from collections import defaultdict
from decimal import Decimal

from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta

from apps.finance.models import WalletTransaction
from apps.advertising.models import AdEvent


def revenue_overview(days=30):

    days = max(1, min(int(days), 365))

    since = timezone.now() - timedelta(days=days)
    subscription_transactions = WalletTransaction.objects.filter(
        created_at__gte=since,
        kind=WalletTransaction.Kind.DEBIT,
        description__startswith="Subscription purchase:",
    )

    subscription_summary = subscription_transactions.aggregate(
        total=Sum("amount"),
        count=Count("id"),
    )

    subscription_total = subscription_summary["total"] or Decimal("0.00")
    subscription_count = subscription_summary["count"] or 0

    advertising_events = AdEvent.objects.filter(
        occurred_at__gte=since,
    )

    advertising_summary = advertising_events.aggregate(
        total=Sum("revenue"),
        count=Count("id"),
    )
    advertising_total = advertising_summary["total"] or Decimal("0.00")
    advertising_count = advertising_summary["count"] or 0
    total_revenue = subscription_total + advertising_total

    monthly_data = defaultdict(
        lambda: {
            "subscription_revenue": Decimal("0.00"),
            "advertising_revenue": Decimal("0.00"),
        }
    )
    subscription_rows = subscription_transactions.values_list(
        "created_at",
        "amount",
    ).iterator(chunk_size=2000)

    for created_at, amount in subscription_rows:
        month = created_at.strftime("%Y-%m")

        monthly_data[month]["subscription_revenue"] += amount or Decimal("0.00")

    advertising_rows = advertising_events.values_list(
        "occurred_at",
        "revenue",
    ).iterator(chunk_size=2000)

    for occurred_at, amount in advertising_rows:
        month = occurred_at.strftime("%Y-%m")

        monthly_data[month]["advertising_revenue"] += amount or Decimal("0.00")

    monthly_trend = []

    for month in sorted(monthly_data.keys()):
        subscription_amount = monthly_data[month]["subscription_revenue"]

        advertising_amount = monthly_data[month]["advertising_revenue"]

        monthly_total = subscription_amount + advertising_amount

        monthly_trend.append(
            {
                "month": month,
                "subscription_revenue": round(float(subscription_amount), 2),
                "advertising_revenue": round(float(advertising_amount), 2),
                "total_revenue": round(float(monthly_total), 2),
            }
        )

    return {
        "period_days": days,
        "currency": "INR",
        "subscription_revenue": round(float(subscription_total), 2),
        "advertising_revenue": round(float(advertising_total), 2),
        "total_revenue": round(float(total_revenue), 2),
        "subscription_transactions": subscription_count,
        "advertising_events": advertising_count,
        "monthly_trend": monthly_trend,
        "revenue_definitions": {
            "subscription": (
                "Wallet-funded subscription purchases recorded "
                "as debit transactions."
            ),
            "advertising": (
                "Revenue recorded against advertising events. "
                "This is not independently verified settlement revenue."
            ),
        },
    }
