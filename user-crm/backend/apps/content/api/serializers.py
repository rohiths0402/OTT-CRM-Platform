from rest_framework import serializers
from apps.content.models import Title
class TitleSerializer(serializers.ModelSerializer):
    releaseDate = serializers.DateField(source="release_date", read_only=True)
    durationSeconds = serializers.IntegerField(source="duration_seconds", read_only=True)
    class Meta:
        model = Title
        fields = ("id", "name", "kind", "language", "durationSeconds", "releaseDate")
