from django.contrib import admin
from .models import Role


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("id", "code", "name", "is_active")
    search_fields = ("code", "name")
    list_filter = ("is_active",)