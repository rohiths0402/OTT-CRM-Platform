from decimal import Decimal
from django.db import transaction
from django.core.exceptions import ValidationError
from django.db.models import F
from apps.finance.models import Wallet, WalletTransaction
@transaction.atomic
def post_wallet_transaction(*, wallet_id, kind, amount, reference, description=""):
    amount=Decimal(str(amount))
    if amount <= 0: raise ValidationError("Amount must be greater than zero.")
    wallet=Wallet.objects.select_for_update().get(pk=wallet_id)
    if kind == WalletTransaction.Kind.DEBIT:
        if wallet.balance < amount: raise ValidationError("Insufficient wallet balance.")
        wallet.balance=F("balance")-amount
    elif kind in (WalletTransaction.Kind.CREDIT, WalletTransaction.Kind.REFUND):
        wallet.balance=F("balance")+amount
    else: raise ValidationError("Unsupported transaction type.")
    wallet.save(update_fields=["balance","updated_at"]); wallet.refresh_from_db(fields=["balance"])
    return WalletTransaction.objects.create(wallet=wallet,kind=kind,amount=amount,balance_after=wallet.balance,reference=reference,description=description)
