
import React, { useMemo, useState } from "react";
import { Plus, Users, UserCheck, UserX, Briefcase } from "lucide-react";
import CastCrewTable from "../../components/cast-crew/CastCrewTable";
import CastCrewFilters from "../../components/cast-crew/CastCrewFilters";
import CastCrewModal from "../../components/cast-crew/CastCrewModal";
import "./CastCrewPage.css";

const initialMembers = [
  {
    id: 1,
    name: "Arjun Kumar",
    role: "Actor",
    email: "arjun@example.com",
    phone: "+91 9876543210",
    experience: "8 Years",
    location: "Chennai",
    status: "Available",
    project: "Project Alpha",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Director",
    email: "priya@example.com",
    phone: "+91 9876543211",
    experience: "10 Years",
    location: "Mumbai",
    status: "On Project",
    project: "Project Beta",
  },
  {
    id: 3,
    name: "Rahul Dev",
    role: "Cinematographer",
    email: "rahul@example.com",
    phone: "+91 9876543212",
    experience: "5 Years",
    location: "Bangalore",
    status: "Available",
    project: "None",
  },
  {
    id: 4,
    name: "Sneha Reddy",
    role: "Editor",
    email: "sneha@example.com",
    phone: "+91 9876543213",
    experience: "6 Years",
    location: "Hyderabad",
    status: "Unavailable",
    project: "None",
  },
];

function CastCrewPage() {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);

  const pageSize = 5;

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = role === "All" || member.role === role;
      const matchesStatus = status === "All" || member.status === status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, search, role, status]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openAddModal = () => {
    setEditingMember(null);
    setViewingMember(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setViewingMember(null);
    setIsModalOpen(true);
  };

  const openViewModal = (member) => {
    setViewingMember(member);
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleSave = (formData) => {
    if (editingMember) {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === editingMember.id
            ? { ...formData, id: member.id }
            : member
        )
      );
    } else {
      setMembers((prev) => [
        { ...formData, id: Date.now() },
        ...prev,
      ]);
      setCurrentPage(1);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (member) => {
    const confirmed = window.confirm(
      `Delete ${member.name} from Cast & Crew?`
    );

    if (!confirmed) return;

    setMembers((prev) =>
      prev.filter((item) => item.id !== member.id)
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    setViewingMember(null);
  };

  const availableCount = members.filter(
    (member) => member.status === "Available"
  ).length;

  const onProjectCount = members.filter(
    (member) => member.status === "On Project"
  ).length;

  return (
    <div className="cast-crew-page">
      <div className="cast-crew-header">
        <div>
          <span className="page-eyebrow">TEAM MANAGEMENT</span>
          <h1>Cast & Crew</h1>
          <p>Manage actors, directors and production professionals.</p>
        </div>

        <button className="add-member-btn" onClick={openAddModal}>
          <Plus size={18} />
          Add Member
        </button>
      </div>

      <div className="cast-crew-stats">
        <div className="cast-stat-card">
          <div className="cast-stat-icon"><Users /></div>
          <div>
            <span>Total Members</span>
            <h2>{members.length}</h2>
          </div>
        </div>

        <div className="cast-stat-card">
          <div className="cast-stat-icon"><UserCheck /></div>
          <div>
            <span>Available</span>
            <h2>{availableCount}</h2>
          </div>
        </div>

        <div className="cast-stat-card">
          <div className="cast-stat-icon"><Briefcase /></div>
          <div>
            <span>On Project</span>
            <h2>{onProjectCount}</h2>
          </div>
        </div>

        <div className="cast-stat-card">
          <div className="cast-stat-icon"><UserX /></div>
          <div>
            <span>Unavailable</span>
            <h2>{members.filter((m) => m.status === "Unavailable").length}</h2>
          </div>
        </div>
      </div>

      <CastCrewFilters
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        role={role}
        setRole={(value) => {
          setRole(value);
          setCurrentPage(1);
        }}
        status={status}
        setStatus={(value) => {
          setStatus(value);
          setCurrentPage(1);
        }}
      />

      <CastCrewTable
        members={paginatedMembers}
        onView={openViewModal}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <div className="cast-crew-pagination">
        <span>
          Showing {filteredMembers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          {" "}to {Math.min(currentPage * pageSize, filteredMembers.length)}
          {" "}of {filteredMembers.length} members
        </span>

        <div>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            Previous
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <CastCrewModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSave}
        editingMember={editingMember}
        viewingMember={viewingMember}
      />
    </div>
  );
}

export default CastCrewPage;
