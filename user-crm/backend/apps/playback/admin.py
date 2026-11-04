from django.contrib import admin
from .models import ViewingSession, PlaybackEvent

admin.site.register([ViewingSession, PlaybackEvent])
