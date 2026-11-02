import React from "react";
import {
  LayoutDashboard,
  Building2,
  Clapperboard,
  Users,
  CalendarDays,
  MapPin,
  Wallet,
  FileText,
  CreditCard,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const menuGroups = [
  {
    id: "dashboard",
    items: [
      {
        name: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: "production",
    title: "PRODUCTION",
    items: [
      {
        name: "Production Houses",
        path: "/production-houses",
        icon: Building2,
      },
      {
        name: "OTT Projects",
        path: "/ott-projects",
        icon: Clapperboard,
      },
      {
        name: "Cast & Crew",
        path: "/cast-crew",
        icon: Users,
      },
      {
        name: "Schedules",
        path: "/schedules",
        icon: CalendarDays,
      },
      {
        name: "Shooting Locations",
        path: "/locations",
        icon: MapPin,
      },
    ],
  },
  {
    id: "operations",
    title: "OPERATIONS",
    items: [
      {
        name: "Budgets & Expenses",
        path: "/budgets",
        icon: Wallet,
      },
      {
        name: "Contracts",
        path: "/contracts",
        icon: FileText,
      },
      {
        name: "Team Coordination",
        path: "/coordination",
        icon: Users,
      },
      {
        name: "Payments",
        path: "/payments",
        icon: CreditCard,
      },
    ],
  },
];

function Sidebar({ onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-navigation">
        {menuGroups.map((group) => (
          <div className="sidebar-section" key={group.id}>
            {group.title && (
              <p className="sidebar-label">{group.title}</p>
            )}

            <nav className="sidebar-menu">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? "active" : ""}`
                    }
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.8}
                      className="sidebar-link-icon"
                    />

                    <span className="sidebar-link-text">
                      {item.name}
                    </span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-profile">
          <div className="profile-avatar">AD</div>

          <div className="profile-info">
            <h4>Admin User</h4>
            <span>Administrator</span>
          </div>

          <button
            className="profile-logout"
            type="button"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;