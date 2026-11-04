from rest_framework.permissions import BasePermission, SAFE_METHODS

READ_ROLES = {"super_admin", "admin", "analyst", "support"}
WRITE_ROLES = {"super_admin", "admin"}


def user_has_any_role(user, allowed_roles):
    if not user or not user.is_authenticated:
        return False

    return any(user.has_role(role) for role in allowed_roles)


class CanManageSubscribers(BasePermission):

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.method in SAFE_METHODS:
            return user_has_any_role(request.user, READ_ROLES)

        return user_has_any_role(request.user, WRITE_ROLES)


class CanManageSubscriptionPlans(BasePermission):

    def has_permission(self, request, view):
        return user_has_any_role(request.user, WRITE_ROLES)


class CanViewSubscriberAnalytics(BasePermission):

    def has_permission(self, request, view):
        return user_has_any_role(
            request.user,
            {"super_admin", "admin", "analyst"},
        )
