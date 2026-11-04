from django.db import models
from apps.core.models import TimeStampedModel


class ViewingSession(TimeStampedModel):
    subscriber = models.ForeignKey(
        "subscribers.Subscriber",
        on_delete=models.PROTECT,
        related_name="viewing_sessions",
    )
    title = models.ForeignKey(
        "content.Title", on_delete=models.PROTECT, related_name="viewing_sessions"
    )
    started_at = models.DateTimeField(db_index=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    watched_seconds = models.PositiveIntegerField(default=0)
    completion_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    device_type = models.CharField(max_length=20, default="unknown", db_index=True)
    state = models.CharField(max_length=100, blank=True, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=["started_at", "subscriber"]),
            models.Index(fields=["title", "started_at"]),
        ]


class PlaybackEvent(models.Model):
    session = models.ForeignKey(
        ViewingSession, on_delete=models.CASCADE, related_name="events"
    )
    event_type = models.CharField(max_length=40, db_index=True)
    occurred_at = models.DateTimeField(db_index=True)
    metadata = models.JSONField(default=dict, blank=True)
