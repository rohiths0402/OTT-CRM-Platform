from django.contrib import admin
from .models import Genre, Title

admin.site.register([Genre, Title])
