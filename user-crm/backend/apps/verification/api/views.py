from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from apps.core.permissions import IsAdminOrSuperAdmin
from apps.verification.models import KYCApplication
from .serializers import KYCSerializer
class KYCViewSet(viewsets.ModelViewSet):
    queryset=KYCApplication.objects.select_related("subscriber__user","reviewer").all().order_by("-created_at"); serializer_class=KYCSerializer; permission_classes=[IsAdminOrSuperAdmin]
    @action(detail=True,methods=["post"])
    def review(self,request,pk=None):
        obj=self.get_object(); status_value=request.data.get("status")
        if status_value not in (KYCApplication.Status.APPROVED,KYCApplication.Status.REJECTED,KYCApplication.Status.NEEDS_INFO): raise ValidationError({"status":"Invalid review status."})
        obj.status=status_value; obj.review_note=request.data.get("review_note",""); obj.reviewer=request.user; obj.reviewed_at=timezone.now(); obj.save(update_fields=["status","review_note","reviewer","reviewed_at","updated_at"]); return Response(self.get_serializer(obj).data)
