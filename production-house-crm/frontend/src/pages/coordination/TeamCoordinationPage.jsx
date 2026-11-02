
import React, { useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  Building2,
  Flag,
  Mail,
  Phone,
  User,
} from "lucide-react";
import "./TeamCoordinationPage.css";

const initialTasks = [
  {
    id: 1,
    title: "Finalize shooting schedule",
    description: "Prepare and confirm the shooting schedule for the next phase.",
    project: "City Lights",
    assignee: "Rahul Sharma",
    department: "Direction",
    priority: "High",
    status: "In Progress",
    startDate: "2026-10-25",
    dueDate: "2026-11-02",
  },
  {
    id: 2,
    title: "Arrange camera equipment",
    description: "Coordinate with the equipment rental vendor.",
    project: "The Last Kingdom",
    assignee: "Arun Kumar",
    department: "Camera",
    priority: "Medium",
    status: "To Do",
    startDate: "2026-10-29",
    dueDate: "2026-11-04",
  },
  {
    id: 3,
    title: "Complete actor costume selection",
    description: "Finalize costumes and obtain approval from the director.",
    project: "City Lights",
    assignee: "Priya Nair",
    department: "Costume",
    priority: "High",
    status: "Completed",
    startDate: "2026-10-20",
    dueDate: "2026-10-28",
  },
  {
    id: 4,
    title: "Review location arrangements",
    description: "Confirm location permissions and transportation.",
    project: "The Last Kingdom",
    assignee: "Vikram Raj",
    department: "Production",
    priority: "Urgent",
    status: "On Hold",
    startDate: "2026-10-26",
    dueDate: "2026-10-31",
  },
  {
    id: 5,
    title: "Prepare editing workflow",
    description: "Coordinate footage transfer and editing requirements.",
    project: "City Lights",
    assignee: "Meena Das",
    department: "Post Production",
    priority: "Medium",
    status: "In Progress",
    startDate: "2026-10-27",
    dueDate: "2026-11-08",
  },
];

const initialMembers = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Director",
    department: "Direction",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
  },
  {
    id: 2,
    name: "Arun Kumar",
    role: "Camera Supervisor",
    department: "Camera",
    email: "arun@example.com",
    phone: "+91 98765 43211",
  },
  {
    id: 3,
    name: "Priya Nair",
    role: "Costume Designer",
    department: "Costume",
    email: "priya@example.com",
    phone: "+91 98765 43212",
  },
  {
    id: 4,
    name: "Vikram Raj",
    role: "Production Manager",
    department: "Production",
    email: "vikram@example.com",
    phone: "+91 98765 43213",
  },
  {
    id: 5,
    name: "Meena Das",
    role: "Video Editor",
    department: "Post Production",
    email: "meena@example.com",
    phone: "+91 98765 43214",
  },
];

const emptyTask = {
  title: "",
  description: "",
  project: "",
  assignee: "",
  department: "Production",
  priority: "Medium",
  status: "To Do",
  startDate: "",
  dueDate: "",
};

const emptyMember = {
  name: "",
  role: "",
  department: "Production",
  email: "",
  phone: "",
};

const departments = [
  "Production",
  "Direction",
  "Camera",
  "Costume",
  "Art",
  "Sound",
  "Lighting",
  "Post Production",
  "Marketing",
];

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function TeamCoordinationPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [members, setMembers] = useState(initialMembers);

  const [activeTab, setActiveTab] = useState("tasks");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [modal, setModal] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const [taskForm, setTaskForm] = useState(emptyTask);
  const [memberForm, setMemberForm] = useState(emptyMember);
  const [formError, setFormError] = useState("");

  const stats = useMemo(() => ({
    members: members.length,
    tasks: tasks.length,
    completed: tasks.filter((task) => task.status === "Completed").length,
    inProgress: tasks.filter((task) => task.status === "In Progress").length,
    overdue: tasks.filter(
      (task) =>
        task.status !== "Completed" &&
        task.status !== "On Hold" &&
        task.dueDate &&
        task.dueDate < new Date().toLocaleDateString("en-CA")
    ).length,
  }), [tasks, members]);

  const filteredTasks = useMemo(() => {
    const term = search.toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch = [
        task.title,
        task.project,
        task.assignee,
        task.department,
      ].some((value) => value?.toLowerCase().includes(term));

      return (
        matchesSearch &&
        (statusFilter === "All" || task.status === statusFilter) &&
        (departmentFilter === "All" ||
          task.department === departmentFilter)
      );
    });
  }, [tasks, search, statusFilter, departmentFilter]);

  const filteredMembers = useMemo(() => {
    const term = search.toLowerCase();

    return members.filter((member) => {
      const matchesSearch = [
        member.name,
        member.role,
        member.email,
        member.department,
      ].some((value) => value?.toLowerCase().includes(term));

      return (
        matchesSearch &&
        (departmentFilter === "All" ||
          member.department === departmentFilter)
      );
    });
  }, [members, search, departmentFilter]);

  const openAddTask = () => {
    setTaskForm(emptyTask);
    setSelectedTask(null);
    setFormError("");
    setModal("addTask");
  };

  const openEditTask = (task) => {
    setSelectedTask(task);
    setTaskForm({ ...task });
    setFormError("");
    setModal("editTask");
  };

  const openAddMember = () => {
    setMemberForm(emptyMember);
    setSelectedMember(null);
    setFormError("");
    setModal("addMember");
  };

  const openEditMember = (member) => {
    setSelectedMember(member);
    setMemberForm({ ...member });
    setFormError("");
    setModal("editMember");
  };

  const handleTaskChange = (event) => {
    const { name, value } = event.target;
    setTaskForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleMemberChange = (event) => {
    const { name, value } = event.target;
    setMemberForm((previous) => ({ ...previous, [name]: value }));
  };

  const submitTask = (event) => {
    event.preventDefault();
    setFormError("");

    if (
      !taskForm.title.trim() ||
      !taskForm.project.trim() ||
      !taskForm.assignee ||
      !taskForm.startDate ||
      !taskForm.dueDate
    ) {
      setFormError("Please complete all required task fields.");
      return;
    }

    if (taskForm.dueDate < taskForm.startDate) {
      setFormError("Due date cannot be earlier than the start date.");
      return;
    }

    const data = {
      ...taskForm,
      title: taskForm.title.trim(),
      project: taskForm.project.trim(),
    };

    if (modal === "editTask" && selectedTask) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === selectedTask.id
            ? { ...data, id: selectedTask.id }
            : task
        )
      );
    } else {
      setTasks((previous) => [{ ...data, id: Date.now() }, ...previous]);
    }

    setModal("");
  };

  const submitMember = (event) => {
    event.preventDefault();
    setFormError("");

    if (
      !memberForm.name.trim() ||
      !memberForm.role.trim() ||
      !memberForm.email.trim()
    ) {
      setFormError("Name, role and email are required.");
      return;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberForm.email);

    if (!emailValid) {
      setFormError("Enter a valid email address.");
      return;
    }

    const data = {
      ...memberForm,
      name: memberForm.name.trim(),
      role: memberForm.role.trim(),
      email: memberForm.email.trim(),
    };

    if (modal === "editMember" && selectedMember) {
      setMembers((previous) =>
        previous.map((member) =>
          member.id === selectedMember.id
            ? { ...data, id: selectedMember.id }
            : member
        )
      );
    } else {
      setMembers((previous) => [{ ...data, id: Date.now() }, ...previous]);
    }

    setModal("");
  };

  const deleteTask = (id) => {
    if (!window.confirm("Delete this task?")) return;
    setTasks((previous) => previous.filter((task) => task.id !== id));
    setModal("");
  };

  const deleteMember = (id) => {
    const assigned = tasks.some(
      (task) => task.assignee === members.find((member) => member.id === id)?.name
    );

    if (assigned) {
      window.alert("This member has assigned tasks. Reassign those tasks before deleting the member.");
      return;
    }

    if (!window.confirm("Delete this team member?")) return;
    setMembers((previous) => previous.filter((member) => member.id !== id));
    setModal("");
  };

  const openViewTask = (task) => {
    setSelectedTask(task);
    setModal("viewTask");
  };

  const openViewMember = (member) => {
    setSelectedMember(member);
    setModal("viewMember");
  };

  const statCards = [
    { label: "Team Members", value: stats.members, icon: Users, color: "gold" },
    { label: "Total Tasks", value: stats.tasks, icon: ClipboardList, color: "blue" },
    { label: "In Progress", value: stats.inProgress, icon: Clock, color: "purple" },
    { label: "Completed", value: stats.completed, icon: CheckCircle, color: "green" },
    { label: "Overdue Tasks", value: stats.overdue, icon: AlertTriangle, color: "red" },
  ];

  return (
    <div className="coordination-page">
      <div className="coordination-heading">
        <div>
          <span className="coordination-eyebrow">PRODUCTION MANAGEMENT</span>
          <h1>Team Coordination</h1>
          <p>Manage your production team, assign tasks and track progress.</p>
        </div>

        <button
          className="coord-primary-btn"
          onClick={activeTab === "tasks" ? openAddTask : openAddMember}
        >
          <Plus size={17} />
          {activeTab === "tasks" ? "Assign New Task" : "Add Team Member"}
        </button>
      </div>

      <div className="coord-stats-grid">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="coord-stat-card" key={stat.label}>
              <div className={`coord-stat-icon ${stat.color}`}>
                <Icon size={20} />
              </div>
              <p>{stat.label}</p>
              <h2>{stat.value}</h2>
            </div>
          );
        })}
      </div>

      <section className="coord-content-card">
        <div className="coord-tabs">
          <button
            className={activeTab === "tasks" ? "active" : ""}
            onClick={() => {
              setActiveTab("tasks");
              setSearch("");
            }}
          >
            <ClipboardList size={16} />
            Task Management
          </button>
          <button
            className={activeTab === "members" ? "active" : ""}
            onClick={() => {
              setActiveTab("members");
              setSearch("");
            }}
          >
            <Users size={16} />
            Team Members
          </button>
        </div>

        <div className="coord-toolbar">
          <div className="coord-search">
            <Search size={17} />
            <input
              placeholder={
                activeTab === "tasks"
                  ? "Search tasks, projects or assignees..."
                  : "Search team members..."
              }
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="coord-filters">
            {activeTab === "tasks" && (
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            )}

            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
            >
              <option value="All">All Departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeTab === "tasks" ? (
          <div className="coord-table-wrapper">
            <table className="coord-table">
              <thead>
                <tr>
                  <th>TASK</th>
                  <th>PROJECT</th>
                  <th>ASSIGNEE</th>
                  <th>DEPARTMENT</th>
                  <th>PRIORITY</th>
                  <th>DUE DATE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length ? (
                  filteredTasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <strong className="coord-task-title">{task.title}</strong>
                      </td>
                      <td>{task.project}</td>
                      <td>{task.assignee}</td>
                      <td>{task.department}</td>
                      <td>
                        <span className={`coord-priority ${task.priority.toLowerCase()}`}>
                          <Flag size={12} />
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <span className="coord-date">
                          <CalendarDays size={13} />
                          {formatDate(task.dueDate)}
                        </span>
                      </td>
                      <td>
                        <span className={`coord-status ${task.status.toLowerCase().replaceAll(" ", "-")}`}>
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <div className="coord-actions">
                          <button title="View" onClick={() => openViewTask(task)}>
                            <Eye size={15} />
                          </button>
                          <button title="Edit" onClick={() => openEditTask(task)}>
                            <Pencil size={15} />
                          </button>
                          <button
                            title="Delete"
                            className="delete"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">
                      <div className="coord-empty">
                        <ClipboardList size={30} />
                        <h3>No tasks found</h3>
                        <p>Try another filter or assign a new task.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="coord-members-grid">
            {filteredMembers.length ? (
              filteredMembers.map((member) => (
                <div className="coord-member-card" key={member.id}>
                  <div className="coord-member-top">
                    <div className="coord-avatar">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="coord-department-tag">{member.department}</span>
                  </div>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                  <div className="coord-member-info">
                    <span><Mail size={14} />{member.email}</span>
                    <span><Phone size={14} />{member.phone || "Not provided"}</span>
                  </div>
                  <div className="coord-member-footer">
                    <button onClick={() => openViewMember(member)}>
                      <Eye size={15} /> View
                    </button>
                    <button onClick={() => openEditMember(member)}>
                      <Pencil size={15} /> Edit
                    </button>
                    <button className="delete" onClick={() => deleteMember(member.id)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="coord-empty">
                <Users size={30} />
                <h3>No team members found</h3>
                <p>Add a member or change your search.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {(modal === "addTask" || modal === "editTask") && (
        <div className="coord-modal-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModal("");
        }}>
          <div className="coord-modal">
            <div className="coord-modal-header">
              <div>
                <span>TASK MANAGEMENT</span>
                <h2>{modal === "addTask" ? "Assign New Task" : "Edit Task"}</h2>
              </div>
              <button className="coord-close" onClick={() => setModal("")}>
                <X size={19} />
              </button>
            </div>

            <form onSubmit={submitTask}>
              <div className="coord-form-grid">
                <label className="full">
                  Task Title *
                  <input name="title" value={taskForm.title} onChange={handleTaskChange} placeholder="Enter task title" />
                </label>

                <label>
                  Project *
                  <input name="project" value={taskForm.project} onChange={handleTaskChange} placeholder="Project name" />
                </label>

                <label>
                  Assign To *
                  <select name="assignee" value={taskForm.assignee} onChange={(event) => {
                    const member = members.find((item) => item.name === event.target.value);
                    setTaskForm((previous) => ({
                      ...previous,
                      assignee: event.target.value,
                      department: member?.department || previous.department,
                    }));
                  }}>
                    <option value="">Select team member</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.name}>
                        {member.name} — {member.role}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Department
                  <select name="department" value={taskForm.department} onChange={handleTaskChange}>
                    {departments.map((department) => (
                      <option key={department}>{department}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Priority
                  <select name="priority" value={taskForm.priority} onChange={handleTaskChange}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </label>

                <label>
                  Status
                  <select name="status" value={taskForm.status} onChange={handleTaskChange}>
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>On Hold</option>
                  </select>
                </label>

                <label>
                  Start Date *
                  <input type="date" name="startDate" value={taskForm.startDate} onChange={handleTaskChange} />
                </label>

                <label>
                  Due Date *
                  <input type="date" name="dueDate" value={taskForm.dueDate} onChange={handleTaskChange} />
                </label>

                <label className="full">
                  Description
                  <textarea name="description" rows="3" value={taskForm.description} onChange={handleTaskChange} placeholder="Describe the task and expected outcome..." />
                </label>
              </div>

              {formError && <p className="coord-form-error">{formError}</p>}

              <div className="coord-modal-footer">
                <button type="button" className="coord-secondary-btn" onClick={() => setModal("")}>Cancel</button>
                <button type="submit" className="coord-primary-btn">
                  {modal === "addTask" ? "Assign Task" : "Update Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {(modal === "addMember" || modal === "editMember") && (
        <div className="coord-modal-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModal("");
        }}>
          <div className="coord-modal">
            <div className="coord-modal-header">
              <div>
                <span>TEAM MANAGEMENT</span>
                <h2>{modal === "addMember" ? "Add Team Member" : "Edit Team Member"}</h2>
              </div>
              <button className="coord-close" onClick={() => setModal("")}>
                <X size={19} />
              </button>
            </div>

            <form onSubmit={submitMember}>
              <div className="coord-form-grid">
                <label className="full">
                  Full Name *
                  <input name="name" value={memberForm.name} onChange={handleMemberChange} placeholder="Enter full name" />
                </label>

                <label>
                  Role *
                  <input name="role" value={memberForm.role} onChange={handleMemberChange} placeholder="e.g. Production Manager" />
                </label>

                <label>
                  Department
                  <select name="department" value={memberForm.department} onChange={handleMemberChange}>
                    {departments.map((department) => (
                      <option key={department}>{department}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Email *
                  <input type="email" name="email" value={memberForm.email} onChange={handleMemberChange} placeholder="name@company.com" />
                </label>

                <label>
                  Phone
                  <input name="phone" value={memberForm.phone} onChange={handleMemberChange} placeholder="+91 XXXXX XXXXX" />
                </label>
              </div>

              {formError && <p className="coord-form-error">{formError}</p>}

              <div className="coord-modal-footer">
                <button type="button" className="coord-secondary-btn" onClick={() => setModal("")}>Cancel</button>
                <button type="submit" className="coord-primary-btn">
                  {modal === "addMember" ? "Add Member" : "Update Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === "viewTask" && selectedTask && (
        <div className="coord-modal-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModal("");
        }}>
          <div className="coord-modal coord-view-modal">
            <div className="coord-modal-header">
              <div>
                <span>TASK DETAILS</span>
                <h2>{selectedTask.title}</h2>
              </div>
              <button className="coord-close" onClick={() => setModal("")}><X size={19} /></button>
            </div>
            <div className="coord-detail-grid">
              <div><span>Project</span><strong>{selectedTask.project}</strong></div>
              <div><span>Assigned To</span><strong>{selectedTask.assignee}</strong></div>
              <div><span>Department</span><strong>{selectedTask.department}</strong></div>
              <div><span>Priority</span><strong>{selectedTask.priority}</strong></div>
              <div><span>Status</span><strong>{selectedTask.status}</strong></div>
              <div><span>Start Date</span><strong>{formatDate(selectedTask.startDate)}</strong></div>
              <div><span>Due Date</span><strong>{formatDate(selectedTask.dueDate)}</strong></div>
              <div className="full"><span>Description</span><strong>{selectedTask.description || "No description provided."}</strong></div>
            </div>
            <div className="coord-modal-footer">
              <button className="coord-secondary-btn" onClick={() => setModal("")}>Close</button>
              <button className="coord-primary-btn" onClick={() => openEditTask(selectedTask)}><Pencil size={15} /> Edit Task</button>
            </div>
          </div>
        </div>
      )}

      {modal === "viewMember" && selectedMember && (
        <div className="coord-modal-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModal("");
        }}>
          <div className="coord-modal coord-view-modal">
            <div className="coord-modal-header">
              <div>
                <span>TEAM MEMBER DETAILS</span>
                <h2>{selectedMember.name}</h2>
              </div>
              <button className="coord-close" onClick={() => setModal("")}><X size={19} /></button>
            </div>
            <div className="coord-detail-grid">
              <div><span>Full Name</span><strong>{selectedMember.name}</strong></div>
              <div><span>Role</span><strong>{selectedMember.role}</strong></div>
              <div><span>Department</span><strong>{selectedMember.department}</strong></div>
              <div><span>Email</span><strong>{selectedMember.email}</strong></div>
              <div><span>Phone</span><strong>{selectedMember.phone || "Not provided"}</strong></div>
              <div><span>Assigned Tasks</span><strong>{tasks.filter((task) => task.assignee === selectedMember.name).length}</strong></div>
            </div>
            <div className="coord-modal-footer">
              <button className="coord-secondary-btn" onClick={() => setModal("")}>Close</button>
              <button className="coord-primary-btn" onClick={() => openEditMember(selectedMember)}><Pencil size={15} /> Edit Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamCoordinationPage;
