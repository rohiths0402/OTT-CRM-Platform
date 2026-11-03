from rest_framework import generics, permissions, filters
from apps.content.models import Title
from .serializers import TitleSerializer
class PublishedTitleListView(generics.ListAPIView):
    queryset = Title.objects.filter(is_published=True).prefetch_related("genres").order_by("name")
    serializer_class = TitleSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "language", "genres__name"]
    ordering_fields = ["name", "release_date"]
