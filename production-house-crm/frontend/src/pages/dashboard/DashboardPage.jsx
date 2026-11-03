import React, { useMemo, useState } from "react";
import {
  Building2,
  Clapperboard,
  Users,
  CalendarDays,
  Wallet,
  FileText,
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowRight,
  Clock3,
  MapPin,
  MoreHorizontal,
  TrendingUp,
  CircleAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

const projects = [
  {
    id: 1,
    name: "Project Alpha",
    platform: "Netflix",
    type: "Web Series",
    manager: "Arjun Kumar",
    progress: 78,
    status: "In Production",
    date: "12 Nov 2026",
  },
  {
    id: 2,
    name: "Project Beta",
    platform: "Amazon Prime",
    type: "Feature Film",
    manager: "Priya Sharma",
    progress: 52,
    status: "Pre Production",
    date: "18 Nov 2026",
  },
  {
    id: 3,
    name: "Project Gamma",
    platform: "Disney+ Hotstar",
    type: "Documentary",
    manager: "Rahul Dev",
    progress: 30,
    status: "Planning",
    date: "25 Nov 2026",
  },
  {
    id: 4,
    name: "Project Delta",
    platform: "ZEE5",
    type: "Web Series",
    manager: "Sneha Reddy",
    progress: 100,
    status: "Completed",
    date: "05 Oct 2026",
  },
];

const schedules = [
  {
    id: 1,
    project: "Project Alpha",
    activity: "Main cast shooting",
    location: "Chennai Film City",
    date: "02 Nov 2026",
    time: "09:00 AM",
    status: "Confirmed",
  },
  {
    id: 2,
    project: "Project Beta",
    activity: "Location scouting",
    location: "Mahabalipuram",
    date: "03 Nov 2026",
    time: "10:30 AM",
    status: "Pending",
  },
  {
    id: 3,
    project: "Project Gamma",
    activity: "Production meeting",
    location: "Studio Office",
    date: "04 Nov 2026",
    time: "02:00 PM",
    status: "Confirmed",
  },
];

const activities = [
  {
    id: 1,
    title: "New project created",
    detail: "Project Alpha was added",
    time: "10 minutes ago",
    icon: Clapperboard,
  },
  {
    id: 2,
    title: "Crew member added",
    detail: "A new cinematographer was added",
    time: "1 hour ago",
    icon: Users,
  },
  {
    id: 3,
    title: "Contract awaiting approval",
    detail: "Project Beta contract",
    time: "3 hours ago",
    icon: FileText,
  },
];

const statusOptions = [
  "All",
  "Planning",
  "Pre Production",
  "In Production",
  "Completed",
];

function DashboardPage() {
  const navigate = useNavigate();
  const [projectFilter, setProjectFilter] = useState("All");
  const [period, setPeriod] = useState("This Month");

  const filteredProjects = useMemo(() => {
    if (projectFilter === "All") return projects;
    return projects.filter((project) => project.status === projectFilter);
  }, [projectFilter]);

  const stats = [
    {
      label: "Production Houses",
      value: "08",
      note: "Registered companies",
      icon: Building2,
      path: "/production-houses",
    },
    {
      label: "Active Projects",
      value: "12",
      note: "3 currently shooting",
      icon: Clapperboard,
      path: "/ott-projects",
    },
    {
      label: "Cast & Crew",
      value: "86",
      note: "Across all projects",
      icon: Users,
      path: "/cast-crew",
    },
    {
      label: "Shooting Locations",
      value: "08",
      note: "Approved & pending",
      icon: MapPin,
      path: "/locations",
    },
  ];

  const quickActions = [
    {
      label: "Add Production House",
      icon: Building2,
      path: "/production-houses",
    },
    {
      label: "Create OTT Project",
      icon: Clapperboard,
      path: "/ott-projects",
    },
    {
      label: "Add Cast & Crew",
      icon: Users,
      path: "/cast-crew",
    },
    {
      label: "View Schedules",
      icon: CalendarDays,
      path: "/schedules",
    },
  ];

  return (
    <div className="crm-dashboard">
      <section className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">PRODUCTION OVERVIEW</span>
          <h1>Dashboard</h1>
          <p>
            Monitor your production operations, projects and team activities.
          </p>
        </div>

        <div className="dashboard-date-control">
          <CalendarDays size={17} />
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
        </div>
      </section>

      <section className="dashboard-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <button
              className="dashboard-stat-card"
              key={stat.label}
              onClick={() => navigate(stat.path)}
            >
              <div className="dashboard-stat-top">
                <div className="dashboard-stat-icon">
                  <Icon size={21} />
                </div>
                <ArrowUpRight size={17} className="stat-arrow" />
              </div>

              <h2>{stat.value}</h2>
              <h3>{stat.label}</h3>
              <p>{stat.note}</p>
            </button>
          );
        })}
      </section>

      <section className="dashboard-main-grid">
        <div className="dashboard-panel projects-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>OTT Project Overview</h2>
              <p>Track the progress of your productions</p>
            </div>

            <button
              className="dashboard-text-link"
              onClick={() => navigate("/ott-projects")}
            >
              View All <ArrowRight size={15} />
            </button>
          </div>

          <div className="project-filter-tabs">
            {statusOptions.map((status) => (
              <button
                key={status}
                className={projectFilter === status ? "active" : ""}
                onClick={() => setProjectFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="dashboard-project-list">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div className="dashboard-project-item" key={project.id}>
                  <div className="project-main-info">
                    <div className="project-cover-icon">
                      <Clapperboard size={20} />
                    </div>

                    <div className="project-name-info">
                      <h3>{project.name}</h3>
                      <p>
                        {project.platform} <span>•</span> {project.type}
                      </p>
                    </div>
                  </div>

                  <div className="project-progress-info">
                    <div className="project-progress-heading">
                      <span>Progress</span>
                      <strong>{project.progress}%</strong>
                    </div>

                    <div className="project-progress-track">
                      <div
                        className="project-progress-fill"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <span
                    className={`project-status status-${project.status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {project.status}
                  </span>

                  <button
                    className="project-more-button"
                    title={`Open ${project.name}`}
                    onClick={() => navigate("/ott-projects")}
                  >
                    <MoreHorizontal size={19} />
                  </button>
                </div>
              ))
            ) : (
              <div className="dashboard-no-results">
                No projects found for this status.
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-panel budget-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Budget Snapshot</h2>
              <p>Production financial overview</p>
            </div>
            <Wallet size={20} className="panel-gold-icon" />
          </div>

          <div className="budget-total">
            <span>Total Allocated Budget</span>
            <h2>₹48,00,000</h2>
          </div>

          <div className="budget-progress-track">
            <div className="budget-progress-fill" />
          </div>

          <div className="budget-legend">
            <span><i className="legend-gold" /> Spent</span>
            <strong>₹31,20,000</strong>
          </div>

          <div className="budget-legend">
            <span><i className="legend-silver" /> Remaining</span>
            <strong>₹16,80,000</strong>
          </div>

          <div className="budget-percentage">
            <TrendingUp size={16} />
            65% of allocated budget used
          </div>

          <button
            className="dashboard-outline-button"
            onClick={() => navigate("/budgets")}
          >
            View Budget Details <ArrowRight size={15} />
          </button>
        </div>
      </section>

      <section className="dashboard-lower-grid">
        <div className="dashboard-panel schedule-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Upcoming Production Schedules</h2>
              <p>Important activities and shooting plans</p>
            </div>

            <button
              className="dashboard-text-link"
              onClick={() => navigate("/schedules")}
            >
              View All <ArrowRight size={15} />
            </button>
          </div>

          <div className="schedule-list">
            {schedules.map((item) => (
              <div className="schedule-item" key={item.id}>
                <div className="schedule-date-box">
                  <CalendarDays size={19} />
                </div>

                <div className="schedule-details">
                  <h3>{item.activity}</h3>
                  <p>{item.project}</p>
                  <span>
                    <MapPin size={12} /> {item.location}
                  </span>
                </div>

                <div className="schedule-time">
                  <strong>{item.date}</strong>
                  <span><Clock3 size={12} /> {item.time}</span>
                  <small className={item.status === "Confirmed" ? "confirmed" : "pending"}>
                    {item.status}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-panel attention-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Pending Actions</h2>
              <p>Items that need your attention</p>
            </div>
            <CircleAlert size={20} className="panel-gold-icon" />
          </div>

          <button
            className="attention-item"
            onClick={() => navigate("/contracts")}
          >
            <div className="attention-icon"><FileText size={18} /></div>
            <div>
              <strong>Contracts Pending</strong>
              <span>3 contracts need approval</span>
            </div>
            <ArrowRight size={16} />
          </button>

          <button
            className="attention-item"
            onClick={() => navigate("/payments")}
          >
            <div className="attention-icon"><CreditCard size={18} /></div>
            <div>
              <strong>Pending Payments</strong>
              <span>₹4,80,000 awaiting payment</span>
            </div>
            <ArrowRight size={16} />
          </button>

          <button
            className="attention-item"
            onClick={() => navigate("/schedules")}
          >
            <div className="attention-icon"><CalendarDays size={18} /></div>
            <div>
              <strong>Schedule Confirmation</strong>
              <span>2 shooting schedules pending</span>
            </div>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        {/* <div className="dashboard-panel quick-actions-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Frequently used production tools</p>
            </div>
          </div>

          <div className="quick-action-grid">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  className="quick-action-card"
                  key={action.label}
                  onClick={() => navigate(action.path)}
                >
                  <Icon size={21} />
                  <span>{action.label}</span>
                  <Plus size={16} className="quick-action-plus" />
                </button>
              );
            })}
          </div>
        </div> */}

        <div className="dashboard-panel activity-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Recent Activities</h2>
              <p>Latest updates across your workspace</p>
            </div>
          </div>

          <div className="activity-list">
            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <div className="activity-item" key={activity.id}>
                  <div className="activity-icon">
                    <Icon size={17} />
                  </div>
                  <div>
                    <strong>{activity.title}</strong>
                    <p>{activity.detail}</p>
                    <span>{activity.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="dashboard-footer-note">
        <span>STUDIOFLOW</span>
        Production House Management Workspace
      </div>
    </div>
  );
}

export default DashboardPage;
