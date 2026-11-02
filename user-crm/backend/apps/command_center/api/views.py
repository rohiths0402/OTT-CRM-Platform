from rest_framework.views import APIView
from rest_framework.response import Response
from apps.core.permissions import IsAnalystOrAdmin
from apps.analytics.selectors.dashboard import overview,top_titles
from apps.analytics.models import StreamingTelemetry
from django.utils import timezone
from datetime import timedelta
class OverviewView(APIView):
    permission_classes=[IsAnalystOrAdmin]
    def get(self,request):
        days=min(max(int(request.query_params.get("days",30)),1),365)
        return Response({"period_days":days,"metrics":overview(days)})
class ContentIntelligenceView(APIView):
    permission_classes=[IsAnalystOrAdmin]
    def get(self,request):
        days=min(max(int(request.query_params.get("days",30)),1),365)
        return Response({"period_days":days,"top_titles":top_titles(days)})
class StreamingHealthView(APIView):
    permission_classes=[IsAnalystOrAdmin]
    def get(self,request):
        cutoff=timezone.now()-timedelta(hours=24); row=StreamingTelemetry.objects.filter(recorded_at__gte=cutoff).order_by("-recorded_at").first()
        if not row: return Response({"status":"no_telemetry","message":"No streaming telemetry received in the last 24 hours."})
        return Response({"recorded_at":row.recorded_at,"cdn_cache_hit_ratio":row.cdn_cache_hit_ratio,"playback_start_success":row.playback_start_success,"startup_latency_seconds":row.startup_latency_seconds,"playback_failure_rate":row.playback_failure_rate,"concurrent_viewers":row.concurrent_viewers,"provider":row.provider})
