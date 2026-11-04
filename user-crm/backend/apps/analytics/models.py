from django.db import models


class DailyMetric(models.Model):
    metric_date = models.DateField(db_index=True)
    metric_key = models.CharField(max_length=80, db_index=True)
    dimension = models.CharField(max_length=100, blank=True, default="", db_index=True)
    value = models.DecimalField(max_digits=20, decimal_places=4, default=0)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["metric_date", "metric_key", "dimension"],
                name="unique_daily_metric_dimension",
            )
        ]
        indexes = [models.Index(fields=["metric_key", "metric_date"])]


class StreamingTelemetry(models.Model):
    recorded_at = models.DateTimeField(db_index=True)
    cdn_cache_hit_ratio = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    playback_start_success = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    startup_latency_seconds = models.DecimalField(
        max_digits=8, decimal_places=3, null=True, blank=True
    )
    playback_failure_rate = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    concurrent_viewers = models.PositiveIntegerField(default=0)
    provider = models.CharField(max_length=80, blank=True)

    class Meta:
        indexes = [models.Index(fields=["recorded_at"])]
