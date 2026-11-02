from django.db import models
from django.db.models import Q
from apps.core.models import TimeStampedModel
class Wallet(TimeStampedModel):
    subscriber=models.OneToOneField("subscribers.Subscriber",on_delete=models.PROTECT,related_name="wallet")
    balance=models.DecimalField(max_digits=14,decimal_places=2,default=0)
    currency=models.CharField(max_length=3,default="INR")
    class Meta: constraints=[models.CheckConstraint(condition=Q(balance__gte=0),name="wallet_balance_nonnegative")]
class WalletTransaction(models.Model):
    class Kind(models.TextChoices): CREDIT="credit","Credit"; DEBIT="debit","Debit"; REFUND="refund","Refund"
    wallet=models.ForeignKey(Wallet,on_delete=models.PROTECT,related_name="transactions")
    kind=models.CharField(max_length=10,choices=Kind.choices)
    amount=models.DecimalField(max_digits=14,decimal_places=2)
    balance_after=models.DecimalField(max_digits=14,decimal_places=2)
    reference=models.CharField(max_length=100,unique=True)
    description=models.CharField(max_length=255,blank=True)
    created_at=models.DateTimeField(auto_now_add=True,db_index=True)
    class Meta: ordering=["-created_at"]; indexes=[models.Index(fields=["wallet","created_at"])]
