from django.urls import path
from .views import OverviewView,ContentIntelligenceView,StreamingHealthView
urlpatterns=[path("overview/",OverviewView.as_view()),path("content/top-titles/",ContentIntelligenceView.as_view()),path("streaming/health/",StreamingHealthView.as_view())]
