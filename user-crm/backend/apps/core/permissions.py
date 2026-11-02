from rest_framework.permissions import BasePermission
class HasAnyRole(BasePermission):
    allowed_roles=()
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and any(request.user.has_role(r) for r in self.allowed_roles))
class IsAdminOrSuperAdmin(HasAnyRole):
    allowed_roles=("super_admin","admin")
class IsAnalystOrAdmin(HasAnyRole):
    allowed_roles=("super_admin","admin","analyst")
