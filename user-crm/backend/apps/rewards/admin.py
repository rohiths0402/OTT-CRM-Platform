from django.contrib import admin
from .models import RewardAccount, RewardTransaction

admin.site.register([RewardAccount, RewardTransaction])
