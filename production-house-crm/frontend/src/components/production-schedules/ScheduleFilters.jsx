
import React from "react";
import { Search, Filter } from "lucide-react";
import "./ScheduleFilters.css";

function ScheduleFilters({
  search,
  setSearch,
  status,
  setStatus,
  project,
  setProject,
}) {
  return (
    <div className="schedule-filters">
      <div className="schedule-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search schedule, project or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="schedule-filter-select">
        <Filter size={16} />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Planned">Planned</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="schedule-filter-select">
        <select
          value={project}
          onChange={(e) => setProject(e.target.value)}
        >
          <option value="All">All Projects</option>
          <option value="Project Alpha">Project Alpha</option>
          <option value="Project Beta">Project Beta</option>
          <option value="Project Gamma">Project Gamma</option>
        </select>
      </div>
    </div>
  );
}

export default ScheduleFilters;