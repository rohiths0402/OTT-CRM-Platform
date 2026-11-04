from django.utils import timezone
from rest_framework import permissions, serializers
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.customers.authentication import CustomerJWTAuthentication
from apps.communication.models import Notification


class CustomerNotificationSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    isRead = serializers.BooleanField(source="is_read", read_only=True)
    readAt = serializers.DateTimeField(source="read_at", read_only=True)

    class Meta:
        model = Notification
        fields = ("id", "title", "body", "channel", "isRead", "createdAt", "readAt")


class CustomerNotificationListView(APIView):
    authentication_classes = [CustomerJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        rows = Notification.objects.filter(customer=request.user).order_by(
            "-created_at"
        )[:100]
        return Response(
            {
                "unreadCount": Notification.objects.filter(
                    customer=request.user, is_read=False
                ).count(),
                "results": CustomerNotificationSerializer(rows, many=True).data,
            }
        )


class CustomerNotificationReadView(APIView):
    authentication_classes = [CustomerJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        item = Notification.objects.filter(pk=pk, customer=request.user).first()
        if not item:
            return Response({"detail": "Notification not found."}, status=404)
        if not item.is_read:
            item.is_read = True
            item.read_at = timezone.now()
            item.save(update_fields=["is_read", "read_at"])
        return Response(CustomerNotificationSerializer(item).data)
