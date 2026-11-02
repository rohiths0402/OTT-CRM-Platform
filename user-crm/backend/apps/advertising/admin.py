from django.contrib import admin
from .models import Advertiser, AdCampaign, AdEvent

admin.site.register([Advertiser, AdCampaign, AdEvent])
