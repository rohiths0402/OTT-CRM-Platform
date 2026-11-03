from rest_framework import serializers
from apps.verification.models import KYCApplication

class KYCSerializer(serializers.ModelSerializer):
    documentType = serializers.CharField(source="document_type")
    documentReference = serializers.CharField(source="document_reference", required=False, allow_blank=True)
    reviewNote = serializers.CharField(source="review_note", read_only=True)
    reviewedAt = serializers.DateTimeField(source="reviewed_at", read_only=True)
    class Meta:
        model = KYCApplication
        fields = ("id", "subscriber", "documentType", "documentReference", "document_file", "status", "reviewer", "reviewedAt", "reviewNote", "created_at")
        read_only_fields = ("id", "status", "reviewer", "reviewedAt", "reviewNote", "created_at")
