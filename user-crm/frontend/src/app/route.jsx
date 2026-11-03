
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LoginPage from "../features/auth/pages/LoginPage";
import { useAuth } from "../features/auth/context/AuthContext";

import AdminLayout from "../components/layout/AdminLayout";

import DashboardPage from "../features/dashboard/pages/SuperAdminDashboard";
import SubscribersPage from "../features/subscribers/pages/SubscribersPage";
import IdentityVaultPage from "../features/identityVault/pages/IdentityVaultPage";
import WalletPage from "../features/wallet/pages/WalletPage";
import RewardsPage from "../features/rewards/pages/RewardsPage";
import EngagementPage from "../features/engagement/pages/EngagementPage";
import ViewingInsightsPage from "../features/viewingInsights/pages/ViewingInsightsPage";
import BroadcastPage from "../features/broadcast/pages/BroadcastPage";
import RolesPage from "../features/roles/pages/RolesPage";
import AuditLogsPage from "../features/auditLogs/pages/AuditLogsPage";
import PreferencesPage from "../features/preferences/pages/PreferencesPage";

import EmployeeCreatePage from "../features/roles/pages/EmployeeCreatePage";

// Normalize roles
const normalizeRole = (role) => {
  return String(role || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
};

// Role-based landing paths
const getRolePath = (role) => {
  const normalizedRole = normalizeRole(role);

  switch (normalizedRole) {
    case "super_admin":
      return "/super-admin";

    case "admin":
    case "analyst":
      return "/admin";

    case "support":
    case "employee":
      return "/employee";

    default:
      return "/login";
  }
};

// Protected route
function ProtectedRole({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="auth-loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = normalizeRole(user.role);
  const permittedRoles = allowedRoles.map(normalizeRole);

  if (!permittedRoles.includes(userRole)) {
    return (
      <Navigate
        to={getRolePath(userRole)}
        replace
      />
    );
  }

  return children;
}

// Landing page
function RoleLanding() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="auth-loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate
      to={getRolePath(user.role)}
      replace
    />
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/"
          element={<RoleLanding />}
        />

        {/* ADMIN WORKSPACE */}
        <Route
          path="/admin"
          element={
            <ProtectedRole
              allowedRoles={["admin", "super_admin", "analyst"]}
            >
              <AdminLayout />
            </ProtectedRole>
          }
        >
          <Route index element={<DashboardPage />} />

          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="subscribers" element={<SubscribersPage />} />
          <Route path="identity-vault" element={<IdentityVaultPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="rewards" element={<RewardsPage />} />
          <Route path="engagement" element={<EngagementPage />} />
          <Route path="viewing-insights" element={<ViewingInsightsPage />} />
          <Route path="broadcast" element={<BroadcastPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="preferences" element={<PreferencesPage />} />
        </Route>

        {/* SUPER ADMIN WORKSPACE */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRole
              allowedRoles={["super_admin"]}
            >
              <AdminLayout />
            </ProtectedRole>
          }
        >
          <Route index element={<DashboardPage />} />

          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="subscribers" element={<SubscribersPage />} />
          <Route path="identity-vault" element={<IdentityVaultPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="rewards" element={<RewardsPage />} />
          <Route path="engagement" element={<EngagementPage />} />
          <Route path="viewing-insights" element={<ViewingInsightsPage />} />
          <Route path="broadcast" element={<BroadcastPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="preferences" element={<PreferencesPage />} />

          {/* Employee Registration - Super Admin Only */}
          <Route
            path="employees/create"
            element={<EmployeeCreatePage />}
          />
        </Route>

        {/* EMPLOYEE WORKSPACE */}
        <Route
          path="/employee"
          element={
            <ProtectedRole
              allowedRoles={["employee", "support"]}
            >
              <AdminLayout />
            </ProtectedRole>
          }
        >
          <Route index element={<DashboardPage />} />
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={<RoleLanding />}
        />

      </Routes>
    </BrowserRouter>
  );
}
