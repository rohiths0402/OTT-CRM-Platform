from django.urls import path
from .views import PublishedTitleListView
urlpatterns = [path("titles/", PublishedTitleListView.as_view(), name="published-titles")]
