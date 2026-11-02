import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CircleUserRound,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import { getDashboard } from "../api/dashboardApi";
import {
  addTask,
  addTeamMember,
  getTasks,
  getTeam,
  removeTask,
  removeTeamMember,
  toggleTask,
} from "../api/managerApi";

function ManagerForm({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    focus: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.role.trim()) {
      setError("Enter a name and role to add a team member.");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        name: form.name.trim(),
        role: form.role.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        focus: form.focus.trim(),
      });
    } catch {
      setError("Could not save this contact. Try again.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-3xl border border-line bg-ink-900 p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-300">
              Your team
            </p>
            <h3 className="mt-2 font-display text-3xl text-ivory">
              Add a contact
            </h3>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}>
            <X className="h-5 w-5 text-mute" />
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ["name", "Name", "e.g. Ananya Rao"],
            ["role", "Role", "e.g. Publicist"],
            ["phone", "Phone", "+91 98765 43210"],
            ["email", "Email", "name@example.com"],
            ["focus", "Focus area", "Press and interviews"],
          ].map(([field, label, placeholder]) => (
            <label key={field} className="text-xs text-mute">
              {label}
              <input
                autoFocus={field === "name"}
                type={field === "email" ? "email" : "text"}
                value={form[field]}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [field]: event.target.value,
                  }))
                }
                placeholder={placeholder}
                className="mt-2 w-full rounded-xl border border-line bg-ink-800 px-3 py-3 text-sm text-ivory placeholder:text-mute/70"
              />
            </label>
          ))}
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-rose-400">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line px-4 py-2.5 text-sm text-mute hover:text-ivory"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="gold-btn inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            {saving ? "Saving..." : "Add contact"}
          </button>
        </div>
      </form>
    </div>
  );
}

function TaskForm({ members, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!title.trim()) {
      setError("Add a task title before saving.");
      return;
    }
    setSaving(true);
    try {
      await onSave({ title: title.trim(), dueDate, assignee });
    } catch {
      setError("Could not save this task. Try again.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-3xl border border-line bg-ink-900 p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-300">
              Follow-up
            </p>
            <h3 className="mt-2 font-display text-3xl text-ivory">New task</h3>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}>
            <X className="h-5 w-5 text-mute" />
          </button>
        </div>
        <label className="mt-6 block text-xs text-mute">
          Task
          <input
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Confirm campaign shoot dates"
            className="mt-2 w-full rounded-xl border border-line bg-ink-800 px-3 py-3 text-sm text-ivory placeholder:text-mute/70"
          />
        </label>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-xs text-mute">
            Due date
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-ink-800 px-3 py-3 text-sm text-ivory"
            />
          </label>
          <label className="text-xs text-mute">
            Assign to
            <select
              value={assignee}
              onChange={(event) => setAssignee(event.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-ink-800 px-3 py-3 text-sm text-ivory"
            >
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.id} value={member.name}>{member.name}</option>
              ))}
            </select>
          </label>
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-rose-400">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line px-4 py-2.5 text-sm text-mute hover:text-ivory"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="gold-btn inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            {saving ? "Saving..." : "Save task"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ContactCard({ member, primary, onRemove }) {
  return (
    <article className="rounded-2xl border border-line bg-ink-900 p-5 transition hover:border-gold-400/30">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-400/10 font-display text-xl text-gold-300">
          {member.name?.slice(0, 1).toUpperCase() || <CircleUserRound />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-ivory">{member.name}</h3>
              <p className="mt-1 text-xs text-gold-300">{member.role}</p>
            </div>
            {!primary && (
              <button
                type="button"
                aria-label={`Remove ${member.name}`}
                onClick={onRemove}
                className="rounded-lg p-2 text-mute hover:bg-rose-400/10 hover:text-rose-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          {member.focus && <p className="mt-3 text-xs leading-5 text-mute">{member.focus}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            {member.phone && (
              <>
                <a
                  href={`tel:${member.phone.replace(/[^\d+]/g, "")}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs text-mute hover:text-ivory"
                >
                  <Phone className="h-3.5 w-3.5" /> Call
                </a>
                <a
                  href={`https://wa.me/${member.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs text-mute hover:text-ivory"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
              </>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs text-mute hover:text-ivory"
              >
                <Mail className="h-3.5 w-3.5" /> Email
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function TalentManagersView() {
  const [primaryManager, setPrimaryManager] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([getDashboard(), getTeam(), getTasks()])
      .then(([dashboard, team, taskList]) => {
        if (!active) return;
        setPrimaryManager(
          dashboard.manager?.name
            ? {
                id: "primary-manager",
                name: dashboard.manager.name,
                role: "Primary talent manager",
                phone: dashboard.manager.phone || "",
                display: dashboard.manager.display || "",
              }
            : null,
        );
        setMembers(team);
        setTasks(taskList);
      })
      .catch(() => {
        if (active) setError("Could not load your manager workspace. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const allMembers = useMemo(
    () => [...(primaryManager ? [primaryManager] : []), ...members],
    [primaryManager, members],
  );
  const visibleMembers = allMembers.filter((member) =>
    `${member.name} ${member.role} ${member.focus || ""}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  const saveMember = async (member) => {
    const saved = await addTeamMember(member);
    setMembers((current) => [saved, ...current]);
    setError("");
    setModal("");
  };

  const deleteMember = async (id) => {
    try {
      await removeTeamMember(id);
      setMembers((current) => current.filter((entry) => entry.id !== id));
    } catch {
      setError("Could not remove this contact. Try again.");
    }
  };

  const saveTask = async (task) => {
    const saved = await addTask(task);
    setTasks((current) => [saved, ...current]);
    setError("");
    setModal("");
  };

  const flipTask = async (id) => {
    try {
      const updated = await toggleTask(id);
      setTasks((current) => current.map((item) => (item.id === id ? updated : item)));
    } catch {
      setError("Could not update this task. Try again.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await removeTask(id);
      setTasks((current) => current.filter((item) => item.id !== id));
    } catch {
      setError("Could not delete this task. Try again.");
    }
  };

  if (loading) return <p className="text-sm text-mute">Loading your manager workspace...</p>;

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-3xl border border-gold-400/20 bg-gradient-to-br from-gold-400/10 via-ink-900 to-ink-900 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-300">
              <UsersRound className="h-4 w-4" /> Your people
            </div>
            <h2 className="mt-3 font-display text-4xl font-light text-ivory sm:text-5xl">
              Talent managers
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-mute">
              Keep your manager, representatives and follow-ups in one place.
            </p>
            <p className="mt-2 text-xs text-mute/80">
              Your primary manager comes from your profile. Added contacts and tasks are saved to your account.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModal("member")}
            className="gold-btn inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" /> Add team contact
          </button>
        </div>
      </section>

      {error && <p role="alert" className="rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">{error}</p>}

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-mute">People and roles</p>
            <h3 className="mt-1 font-display text-2xl text-ivory">Your team</h3>
          </div>
          <label className="relative block w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search contacts"
              aria-label="Search team contacts"
              className="w-full rounded-xl border border-line bg-ink-900 py-2.5 pl-9 pr-3 text-sm text-ivory placeholder:text-mute/70"
            />
          </label>
        </div>
        {visibleMembers.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {visibleMembers.map((member) => (
              <ContactCard
                key={member.id}
                member={member}
                primary={member.id === "primary-manager"}
                onRemove={() => deleteMember(member.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-ink-900/60 p-8 text-center">
            <UsersRound className="mx-auto h-7 w-7 text-gold-400" />
            <p className="mt-3 font-display text-xl text-ivory">
              {query ? "No contacts match your search" : "Build your support team"}
            </p>
            <p className="mt-1 text-sm text-mute">
              Add agents, publicists, legal contacts or anyone who helps manage your work.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-line bg-ink-900 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-mute">Stay on top of it</p>
            <h3 className="mt-1 font-display text-2xl text-ivory">Manager tasks</h3>
          </div>
          <button
            type="button"
            onClick={() => setModal("task")}
            className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm text-gold-300 transition hover:border-gold-400/40"
          >
            <Plus className="h-4 w-4" /> Add task
          </button>
        </div>
        {tasks.length ? (
          <ul className="mt-4 divide-y divide-line">
            {[...tasks]
              .sort((a, b) => Number(a.done) - Number(b.done) || (a.dueDate || "").localeCompare(b.dueDate || ""))
              .map((task) => (
                <li key={task.id} className="flex items-center gap-3 py-3">
                  <button
                    type="button"
                    aria-label={task.done ? `Mark ${task.title} incomplete` : `Complete ${task.title}`}
                    onClick={() => flipTask(task.id)}
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${task.done ? "border-aqua-400 bg-aqua-400/15 text-aqua-400" : "border-line text-transparent hover:border-gold-400"}`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm ${task.done ? "text-mute line-through" : "text-ivory"}`}>{task.title}</p>
                    <p className="mt-1 text-xs text-mute">
                      {[task.assignee, task.dueDate && `Due ${new Date(`${task.dueDate}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`].filter(Boolean).join(" · ") || "No assignee or due date"}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Delete ${task.title}`}
                    onClick={() => deleteTask(task.id)}
                    className="rounded-lg p-2 text-mute hover:text-rose-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-mute">
            No follow-ups yet. Add a task to track an audition, campaign deadline or manager check-in.
          </p>
        )}
      </section>

      <AnimatePresence>
        {modal === "member" && (
          <motion.div key="member-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ManagerForm onClose={() => setModal("")} onSave={saveMember} />
          </motion.div>
        )}
        {modal === "task" && (
          <motion.div key="task-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TaskForm members={allMembers} onClose={() => setModal("")} onSave={saveTask} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}