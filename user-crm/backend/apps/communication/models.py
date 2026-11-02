from django.conf import settings
from django.db import models
class Notification(models.Model):
    class Channel(models.TextChoices): IN_APP="in_app","In app"; EMAIL="email","Email"; SMS="sms","SMS"; PUSH="push","Push"
    recipient=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="notifications")
    title=models.CharField(max_length=160); body=models.TextField()
    channel=models.CharField(max_length=10,choices=Channel.choices,default=Channel.IN_APP)
    is_read=models.BooleanField(default=False,db_index=True)
    created_at=models.DateTimeField(auto_now_add=True,db_index=True)
    read_at=models.DateTimeField(null=True,blank=True)
