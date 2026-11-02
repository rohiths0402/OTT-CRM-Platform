from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.communication.models import Notification
from .serializers import NotificationSerializer
class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class=NotificationSerializer
    def get_queryset(self): return Notification.objects.filter(recipient=self.request.user).order_by("-created_at")
    @action(detail=True,methods=["post"])
    def mark_read(self,request,pk=None):
        item=self.get_object(); item.is_read=True; item.read_at=timezone.now(); item.save(update_fields=["is_read","read_at"]); return Response(self.get_serializer(item).data)
