from django.utils import timezone
from rest_framework import permissions, viewsets, generics, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from apps.core.permissions import IsAdminOrSuperAdmin
from apps.customers.authentication import CustomerJWTAuthentication
from apps.subscribers.models import Subscriber
from apps.verification.models import KYCApplication
from .serializers import KYCSerializer

class KYCViewSet(viewsets.ModelViewSet):
    queryset = KYCApplication.objects.select_related("subscriber__user", "subscriber__customer", "reviewer").all().order_by("-created_at")
    serializer_class = KYCSerializer
    permission_classes = [IsAdminOrSuperAdmin]
    def get_queryset(self):
        qs = super().get_queryset()
        status_value = self.request.query_params.get("status")
        return qs.filter(status=status_value) if status_value else qs
    @action(detail=True, methods=["post"])
    def review(self, request, pk=None):
        obj = self.get_object()
        status_value = request.data.get("status")
        if status_value not in (KYCApplication.Status.APPROVED, KYCApplication.Status.REJECTED, KYCApplication.Status.NEEDS_INFO):
            raise ValidationError({"status": "Invalid review status."})
        obj.status = status_value
        obj.review_note = request.data.get("reviewNote", request.data.get("review_note", ""))
        obj.reviewer = request.user
        obj.reviewed_at = timezone.now()
        obj.save(update_fields=["status", "review_note", "reviewer", "reviewed_at", "updated_at"])
        return Response(self.get_serializer(obj).data)

class CustomerKYCSerializer(serializers.ModelSerializer):
    documentType = serializers.CharField(source="document_type")
    documentReference = serializers.CharField(source="document_reference", required=False, allow_blank=True)
    class Meta:
        model = KYCApplication
        fields = ("id", "documentType", "documentReference", "document_file", "status", "review_note", "created_at")
        read_only_fields = ("id", "status", "review_note", "created_at")

class CustomerKYCView(generics.ListCreateAPIView):
    authentication_classes = [CustomerJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CustomerKYCSerializer
    def get_subscriber(self):
        return Subscriber.objects.get(customer=self.request.user)
    def get_queryset(self):
        return KYCApplication.objects.filter(subscriber=self.get_subscriber()).order_by("-created_at")
    def perform_create(self, serializer):
        if self.get_queryset().filter(status=KYCApplication.Status.PENDING).exists():
            raise ValidationError("You already have a pending KYC application.")
        serializer.save(subscriber=self.get_subscriber())
