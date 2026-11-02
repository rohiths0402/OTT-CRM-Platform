
import React, { useMemo, useState, useEffect } from "react";
import { Plus, Clapperboard, Film, CheckCircle, Clock } from "lucide-react";

import OTTProjectTable from "../../components/ott-projects/OTTProjectTable";
import OTTProjectFilters from "../../components/ott-projects/OTTProjectFilters";
import OTTProjectModal from "../../components/ott-projects/OTTProjectModal";
import DeleteProjectModal from "../../components/ott-projects/DeleteProjectModal";

import "./OTTProjectsPage.css";

const initialProjects = [
  {
    id: 1,
    projectName: "The Last Kingdom",
    platform: "Netflix",
    projectType: "Web Series",
    genre: "Thriller",
    language: "Tamil",
    startDate: "2026-11-01",
    endDate: "2027-03-30",
    budget: "50000000",
    projectManager: "Arun Kumar",
    status: "In Progress",
    description: "A Tamil action thriller web series.",
  },
  {
    id: 2,
    projectName: "City of Dreams",
    platform: "Amazon Prime Video",
    projectType: "Web Series",
    genre: "Drama",
    language: "Tamil",
    startDate: "2026-10-15",
    endDate: "2027-02-15",
    budget: "35000000",
    projectManager: "Vijay Raj",
    status: "Planning",
    description: "A drama series based on city life.",
  },
  {
    id: 3,
    projectName: "Beyond Limits",
    platform: "Disney+ Hotstar",
    projectType: "Movie",
    genre: "Action",
    language: "Telugu",
    startDate: "2026-08-01",
    endDate: "2026-12-20",
    budget: "80000000",
    projectManager: "Karthik",
    status: "In Progress",
    description: "An action drama feature film.",
  },
  {
    id: 4,
    projectName: "The Silent House",
    platform: "Netflix",
    projectType: "Movie",
    genre: "Horror",
    language: "Malayalam",
    startDate: "2026-04-01",
    endDate: "2026-09-30",
    budget: "20000000",
    projectManager: "Priya",
    status: "Completed",
    description: "A supernatural horror film.",
  },
  {
    id: 5,
    projectName: "Food Stories",
    platform: "ZEE5",
    projectType: "Documentary",
    genre: "Documentary",
    language: "Tamil",
    startDate: "2026-12-01",
    endDate: "2027-01-30",
    budget: "8000000",
    projectManager: "Suresh",
    status: "On Hold",
    description: "A documentary about regional food culture.",
  },
  {
    id: 6,
    projectName: "One More Chance",
    platform: "Sony LIV",
    projectType: "Web Series",
    genre: "Romance",
    language: "Hindi",
    startDate: "2026-11-15",
    endDate: "2027-04-15",
    budget: "25000000",
    projectManager: "Meena",
    status: "Planning",
    description: "A romantic drama series.",
  },
];

function OTTProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("All");
  const [status, setStatus] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredProjects = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        project.projectName.toLowerCase().includes(searchText) ||
        project.projectManager.toLowerCase().includes(searchText) ||
        project.genre.toLowerCase().includes(searchText) ||
        project.language.toLowerCase().includes(searchText);

      const matchesPlatform =
        platform === "All" || project.platform === platform;

      const matchesStatus =
        status === "All" || project.status === status;

      return matchesSearch && matchesPlatform && matchesStatus;
    });
  }, [projects, search, platform, status]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }

    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePlatformChange = (value) => {
    setPlatform(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const openAddModal = () => {
    setEditingProject(null);
    setViewingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setViewingProject(null);
    setIsModalOpen(true);
  };

  const openViewModal = (project) => {
    setEditingProject(null);
    setViewingProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setViewingProject(null);
  };

  const handleSubmit = (formData) => {
    if (editingProject) {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === editingProject.id
            ? { ...formData, id: editingProject.id }
            : project
        )
      );
    } else {
      setProjects((prev) => [
        { ...formData, id: Date.now() },
        ...prev,
      ]);
      setCurrentPage(1);
    }

    closeModal();
  };

  const handleDelete = (id) => {
    const selectedProject = projects.find((project) => project.id === id);
    if (selectedProject) setDeleteTarget(selectedProject);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    setProjects((prev) =>
      prev.filter((project) => project.id !== deleteTarget.id)
    );

    setDeleteTarget(null);
  };

  const activeCount = projects.filter(
    (project) => project.status === "In Progress"
  ).length;

  const completedCount = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const planningCount = projects.filter(
    (project) => project.status === "Planning"
  ).length;

  return (
    <div className="ott-projects-page">
      <div className="ott-page-heading">
        <div>
          <span className="ott-eyebrow">PRODUCTION MANAGEMENT</span>
          <h1>OTT Projects</h1>
          <p>Manage movies, web series and OTT productions.</p>
        </div>

        <button
          type="button"
          className="ott-add-btn"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      <div className="ott-stats-grid">
        <div className="ott-stat-card">
          <div className="ott-stat-icon"><Clapperboard size={21} /></div>
          <div><span>Total Projects</span><h2>{projects.length}</h2></div>
        </div>

        <div className="ott-stat-card">
          <div className="ott-stat-icon"><Clock size={21} /></div>
          <div><span>In Progress</span><h2>{activeCount}</h2></div>
        </div>

        <div className="ott-stat-card">
          <div className="ott-stat-icon"><CheckCircle size={21} /></div>
          <div><span>Completed</span><h2>{completedCount}</h2></div>
        </div>

        <div className="ott-stat-card">
          <div className="ott-stat-icon"><Film size={21} /></div>
          <div><span>Planning</span><h2>{planningCount}</h2></div>
        </div>
      </div>

      <div className="ott-list-section">
        <div className="ott-list-heading">
          <div>
            <h2>All OTT Projects</h2>
            <p>{filteredProjects.length} projects found</p>
          </div>
        </div>

        <OTTProjectFilters
          search={search}
          setSearch={handleSearchChange}
          platform={platform}
          setPlatform={handlePlatformChange}
          status={status}
          setStatus={handleStatusChange}
        />

        <OTTProjectTable
          projects={paginatedProjects}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />

        <div className="ott-pagination">
          <span>
            Showing {filteredProjects.length === 0 ? 0 : startIndex + 1}
            {"–"}
            {Math.min(startIndex + itemsPerPage, filteredProjects.length)}
            {" "}of {filteredProjects.length} projects
          </span>

          <div className="ott-pagination-buttons">
            <button
              type="button"
              disabled={currentPage === 1 || totalPages === 0}
              onClick={() => goToPage(currentPage - 1)}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;

              return (
                <button
                  type="button"
                  key={page}
                  className={currentPage === page ? "current-page" : ""}
                  onClick={() => goToPage(page)}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages || totalPages === 0}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <OTTProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingProject={editingProject}
        viewingProject={viewingProject}
      />

      <DeleteProjectModal
        isOpen={Boolean(deleteTarget)}
        projectName={deleteTarget?.projectName || ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default OTTProjectsPage;
