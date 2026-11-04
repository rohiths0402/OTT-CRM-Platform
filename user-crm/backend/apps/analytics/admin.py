from django.contrib import admin
from .models import DailyMetric, StreamingTelemetry

admin.site.register([DailyMetric, StreamingTelemetry])
