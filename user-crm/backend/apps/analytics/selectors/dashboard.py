from datetime import timedelta
from django.db.models import Sum,Count,Avg
from django.utils import timezone
from apps.subscribers.models import Subscriber
from apps.playback.models import ViewingSession
from apps.advertising.models import AdEvent
from apps.finance.models import WalletTransaction
from apps.content.models import Title

def overview(days=30):
    since=timezone.now()-timedelta(days=days)
    subscribers=Subscriber.objects.filter(created_at__gte=since).count()
    sessions=ViewingSession.objects.filter(started_at__gte=since)
    active=sessions.values("subscriber_id").distinct().count()
    watch_seconds=sessions.aggregate(total=Sum("watched_seconds"))["total"] or 0
    ad_impressions=AdEvent.objects.filter(kind="impression",occurred_at__gte=since).count()
    return {"new_subscribers":subscribers,"monthly_active_viewers":active,"watch_hours":round(watch_seconds/3600,2),"ad_impressions":ad_impressions}
def top_titles(days=30,limit=10):
    since=timezone.now()-timedelta(days=days)
    # Database performs aggregation and ordering; no full event table is loaded into Python.
    rows=ViewingSession.objects.filter(started_at__gte=since).values("title_id","title__name").annotate(watch_seconds=Sum("watched_seconds")).order_by("-watch_seconds")[:limit]
    return [{"title_id":r["title_id"],"title":r["title__name"],"watch_hours":round((r["watch_seconds"] or 0)/3600,2)} for r in rows]
