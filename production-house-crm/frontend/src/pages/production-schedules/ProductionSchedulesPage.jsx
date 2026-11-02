
import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Plus,
  CalendarRange,
  List,
} from "lucide-react";

import ScheduleTable from "../../components/production-schedules/ScheduleTable";
import ScheduleFilters from "../../components/production-schedules/ScheduleFilters";
import ScheduleModal from "../../components/production-schedules/ScheduleModal";

import "./ProductionSchedulesPage.css";

const initialSchedules = [
  {
    id: 1,
    title: "Main Cast Shooting",
    project: "Project Alpha",
    date: "2026-11-02",
    startTime: "09:00",
    endTime: "18:00",
    location: "Chennai Film City",
    crew: "Arjun Kumar, Priya Sharma",
    status: "Confirmed",
    description: "Main cast outdoor shooting.",
  },
  {
    id: 2,
    title: "Location Scouting",
    project: "Project Beta",
    date: "2026-11-03",
    startTime: "10:30",
    endTime: "13:00",
    location: "Mahabalipuram",
    crew: "Rahul Dev",
    status: "Planned",
    description: "Scouting locations for upcoming scenes.",
  },
  {
    id: 3,
    title: "Production Meeting",
    project: "Project Gamma",
    date: "2026-11-04",
    startTime: "14:00",
    endTime: "16:00",
    location: "Studio Office",
    crew: "Sneha Reddy",
    status: "Completed",
    description: "Production planning meeting.",
  },
  {
    id: 4,
    title: "Camera Test",
    project: "Project Alpha",
    date: "2026-11-06",
    startTime: "08:00",
    endTime: "12:00",
    location: "Studio 2, Chennai",
    crew: "Arjun Kumar, Rahul Dev",
    status: "Planned",
    description: "Camera and lighting test.",
  },
  {
    id: 5,
    title: "Outdoor Shooting",
    project: "Project Beta",
    date: "2026-11-08",
    startTime: "06:00",
    endTime: "17:00",
    location: "Pondicherry",
    crew: "Priya Sharma, Sneha Reddy",
    status: "Cancelled",
    description: "Outdoor production schedule.",
  },
];

function ProductionSchedulesPage() {
  const [schedules, setSchedules] = useState(initialSchedules);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [project, setProject] = useState("All");

  const [view, setView] = useState("list");
  const [selectedDate, setSelectedDate] = useState("2026-11-02");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [viewingSchedule, setViewingSchedule] = useState(null);

  // Search and filters
  const filteredSchedules = useMemo(() => {
    const query = search.toLowerCase().trim();

    return schedules.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.project.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.crew.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || item.status === status;

      const matchesProject =
        project === "All" || item.project === project;

      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [schedules, search, status, project]);

  // Dashboard statistics
  const stats = [
    {
      label: "Total Schedules",
      value: schedules.length,
      icon: CalendarDays,
    },
    {
      label: "Confirmed",
      value: schedules.filter((item) => item.status === "Confirmed").length,
      icon: CheckCircle2,
    },
    {
      label: "Planned",
      value: schedules.filter((item) => item.status === "Planned").length,
      icon: Clock,
    },
    {
      label: "Completed",
      value: schedules.filter((item) => item.status === "Completed").length,
      icon: CalendarRange,
    },
  ];

  // Modal handlers
  const openAddModal = () => {
    setEditingSchedule(null);
    setViewingSchedule(null);
    setIsModalOpen(true);
  };

  const openEditModal = (schedule) => {
    setEditingSchedule(schedule);
    setViewingSchedule(null);
    setIsModalOpen(true);
  };

  const openViewModal = (schedule) => {
    setViewingSchedule(schedule);
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
    setViewingSchedule(null);
  };

  // Create and update schedule
  const handleSave = (formData) => {
    const cleanedData = {
      ...formData,
      title: formData.title.trim(),
      project: formData.project.trim(),
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location.trim(),
      crew: formData.crew.trim(),
      description: formData.description.trim(),
    };

    if (
      !cleanedData.title ||
      !cleanedData.date ||
      !cleanedData.startTime ||
      !cleanedData.endTime ||
      !cleanedData.location
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (cleanedData.endTime <= cleanedData.startTime) {
      alert("End time must be later than start time.");
      return;
    }

    if (editingSchedule) {
      setSchedules((previous) =>
        previous.map((item) =>
          item.id === editingSchedule.id
            ? { ...cleanedData, id: item.id }
            : item
        )
      );
    } else {
      const newSchedule = {
        ...cleanedData,
        id: Date.now(),
      };

      setSchedules((previous) => [
        newSchedule,
        ...previous,
      ]);
    }

    // Reset filters so the saved record is visible.
    setSearch("");
    setStatus("All");
    setProject("All");
    setView("list");

    closeModal();
  };

  // Delete schedule
  const handleDelete = (schedule) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${schedule.title}"?`
    );

    if (!confirmed) return;

    setSchedules((previous) =>
      previous.filter((item) => item.id !== schedule.id)
    );
  };

  // Calendar date filtering
  const selectedDateSchedules = filteredSchedules.filter(
    (item) => item.date === selectedDate
  );

  return (
    <div className="production-schedules-page">

      {/* Page Header */}
      <div className="schedules-page-header">
        <div>
          <span className="schedules-eyebrow">
            PRODUCTION MANAGEMENT
          </span>

          <h1>Production Schedules</h1>

          <p>
            Plan and manage your shooting schedules and production activities.
          </p>
        </div>

        <button
          type="button"
          className="add-schedule-btn"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Create Schedule
        </button>
      </div>

      {/* Statistics */}
      <div className="schedule-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="schedule-stat-card" key={stat.label}>
              <div className="schedule-stat-icon">
                <Icon size={21} />
              </div>

              <div>
                <span>{stat.label}</span>
                <h2>{stat.value}</h2>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <ScheduleFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        project={project}
        setProject={setProject}
      />

      {/* Schedule Content */}
      <div className="schedules-content-panel">

        <div className="schedules-toolbar">
          <div>
            <h2>Production Calendar</h2>
            <p>Manage all your production activities.</p>
          </div>

          <div className="schedule-view-toggle">
            <button
              type="button"
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
            >
              <List size={16} />
              List
            </button>

            <button
              type="button"
              className={view === "calendar" ? "active" : ""}
              onClick={() => setView("calendar")}
            >
              <CalendarDays size={16} />
              Calendar
            </button>
          </div>
        </div>

        {view === "list" ? (
          <ScheduleTable
            schedules={filteredSchedules}
            onView={openViewModal}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        ) : (
          <div className="schedule-calendar-view">

            <div className="calendar-date-picker">
              <label htmlFor="schedule-date">
                Select shooting date
              </label>

              <input
                id="schedule-date"
                type="date"
                value={selectedDate}
                onChange={(event) =>
                  setSelectedDate(event.target.value)
                }
              />
            </div>

            {selectedDateSchedules.length > 0 ? (
              selectedDateSchedules.map((item) => (
                <button
                  type="button"
                  className="calendar-schedule-card"
                  key={item.id}
                  onClick={() => openViewModal(item)}
                >
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.project}</span>
                  </div>

                  <div className="calendar-schedule-meta">
                    <span>
                      <Clock size={14} />
                      {item.startTime} - {item.endTime}
                    </span>

                    <span>
                      <MapPin size={14} />
                      {item.location}
                    </span>

                    <span>
                      <Users size={14} />
                      {item.crew || "No crew assigned"}
                    </span>
                  </div>

                  <span
                    className={`schedule-status status-${item.status.toLowerCase()}`}
                  >
                    {item.status}
                  </span>
                </button>
              ))
            ) : (
              <div className="schedule-empty-state">
                <CalendarDays size={32} />
                <h3>No schedules for this date</h3>
                <p>
                  Choose another date or create a new schedule.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="schedules-results-count">
          Showing {filteredSchedules.length} of {schedules.length} schedules
        </div>
      </div>

      {/* Add / Edit / View Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSave}
        editingSchedule={editingSchedule}
        viewingSchedule={viewingSchedule}
      />
    </div>
  );
}

export default ProductionSchedulesPage;
