from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):

    message = "Only Super Admin can perform this action."

    def has_permission(self, request, view):

        return (
            request.user
            and request.user.is_authenticated
            and request.user.has_role("super_admin")
        )