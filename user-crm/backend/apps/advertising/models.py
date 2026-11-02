from django.db import models
from apps.core.models import TimeStampedModel
class Advertiser(TimeStampedModel): name=models.CharField(max_length=160); contact_email=models.EmailField(blank=True)
class AdCampaign(TimeStampedModel):
    advertiser=models.ForeignKey(Advertiser,on_delete=models.PROTECT,related_name="campaigns")
    name=models.CharField(max_length=160)
    starts_at=models.DateTimeField(); ends_at=models.DateTimeField()
    budget=models.DecimalField(max_digits=14,decimal_places=2,default=0)
    is_active=models.BooleanField(default=True,db_index=True)
class AdEvent(models.Model):
    class Kind(models.TextChoices): IMPRESSION="impression","Impression"; COMPLETE="complete","Complete"; CLICK="click","Click"
    campaign=models.ForeignKey(AdCampaign,on_delete=models.PROTECT,related_name="events")
    kind=models.CharField(max_length=12,choices=Kind.choices,db_index=True)
    occurred_at=models.DateTimeField(db_index=True)
    revenue=models.DecimalField(max_digits=12,decimal_places=4,default=0)
    region=models.CharField(max_length=100,blank=True,db_index=True)
