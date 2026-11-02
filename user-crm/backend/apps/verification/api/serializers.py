from rest_framework import serializers
from apps.verification.models import KYCApplication
class KYCSerializer(serializers.ModelSerializer):
    class Meta: model=KYCApplication; fields="__all__"; read_only_fields=("reviewer","reviewed_at")
