import React, { useMemo, useState } from "react";
import "./BudgetsExpensesPage.css";


const projects = [
  { id: 1, name: "The Last Kingdom", budget: 1800000 },
  { id: 2, name: "City Lights", budget: 1200000 },
  { id: 3, name: "Beyond the Sea", budget: 2000000 },
];

const initialExpenses = [
  {
    id: 1,
    projectId: 1,
    title: "Location advance",
    vendor: "Green Valley Resorts",
    category: "Location",
    date: "2026-10-24",
    amount: 85000,
    status: "Paid",
  },
  {
    id: 2,
    projectId: 1,
    title: "Camera rental",
    vendor: "FrameWorks Rentals",
    category: "Equipment",
    date: "2026-10-25",
    amount: 42000,
    status: "Pending",
  },
  {
    id: 3,
    projectId: 2,
    title: "Cast accommodation",
    vendor: "Sunrise Suites",
    category: "Accommodation",
    date: "2026-10-26",
    amount: 56000,
    status: "Paid",
  },
  {
    id: 4,
    projectId: 3,
    title: "Travel expenses",
    vendor: "Metro Travels",
    category: "Travel",
    date: "2026-10-27",
    amount: 28500,
    status: "Partially Paid",
  },
];

const categories = [
  "Location",
  "Equipment",
  "Travel",
  "Food",
  "Accommodation",
  "Salary",
  "Post-production",
  "Other",
];

const emptyForm = {
  projectId: "1",
  title: "",
  vendor: "",
  category: "Location",
  date: new Date().toISOString().slice(0, 10),
  amount: "",
  status: "Pending",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function BudgetsExpensesPage() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const project = projects.find(
        (item) => item.id === Number(expense.projectId)
      );

      const matchesProject =
        projectFilter === "all" ||
        expense.projectId === Number(projectFilter);

      const matchesStatus =
        statusFilter === "all" || expense.status === statusFilter;

      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        expense.title.toLowerCase().includes(query) ||
        expense.vendor.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query) ||
        project?.name.toLowerCase().includes(query);

      return matchesProject && matchesStatus && matchesSearch;
    });
  }, [expenses, projectFilter, statusFilter, search]);

  const summary = useMemo(() => {
    const selectedProjects =
      projectFilter === "all"
        ? projects
        : projects.filter(
            (project) => project.id === Number(projectFilter)
          );

    const projectIds = selectedProjects.map((project) => project.id);

    const selectedExpenses = expenses.filter((expense) =>
      projectIds.includes(Number(expense.projectId))
    );

    const budget = selectedProjects.reduce(
      (total, project) => total + project.budget,
      0
    );

    const spent = selectedExpenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0
    );

    const unpaid = selectedExpenses
      .filter((expense) => expense.status !== "Paid")
      .reduce((total, expense) => total + Number(expense.amount), 0);

    return {
      budget,
      spent,
      remaining: budget - spent,
      unpaid,
    };
  }, [expenses, projectFilter]);

  function openAddForm() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      projectId: projectFilter === "all" ? "1" : projectFilter,
    });
    setError("");
    setShowForm(true);
  }

  function openEditForm(expense) {
    setEditingId(expense.id);
    setForm({
      ...expense,
      projectId: String(expense.projectId),
      amount: String(expense.amount),
    });
    setError("");
    setShowForm(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const amount = Number(form.amount);

    if (
      !form.title.trim() ||
      !form.vendor.trim() ||
      !form.date ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setError("Please enter all required details and a valid amount.");
      return;
    }

    const expenseData = {
      ...form,
      title: form.title.trim(),
      vendor: form.vendor.trim(),
      projectId: Number(form.projectId),
      amount,
    };

    if (editingId !== null) {
      setExpenses((current) =>
        current.map((expense) =>
          expense.id === editingId
            ? { ...expenseData, id: editingId }
            : expense
        )
      );
    } else {
      setExpenses((current) => [
        { ...expenseData, id: Date.now() },
        ...current,
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  function deleteExpense(id) {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    setExpenses((current) =>
      current.filter((expense) => expense.id !== id)
    );
  }

  return (
    <div className="budgets-page">
      <div className="budgets-heading">
        <div>
          <span className="budgets-eyebrow">FINANCE / OVERVIEW</span>
          <h1>Budgets &amp; Expenses</h1>
          <p>Manage project budgets and track your production expenses.</p>
        </div>

        <button className="budget-primary-btn" onClick={openAddForm}>
          + Add Expense
        </button>
      </div>

      <section className="budget-summary-grid">
        <article className="budget-summary-card">
          <span>Total Budget</span>
          <h2>{formatCurrency(summary.budget)}</h2>
          <small>Allocated project budget</small>
        </article>

        <article className="budget-summary-card">
          <span>Total Expenses</span>
          <h2>{formatCurrency(summary.spent)}</h2>
          <small>Recorded expenses</small>
        </article>

        <article className="budget-summary-card">
          <span>Remaining Budget</span>
          <h2 className={summary.remaining < 0 ? "budget-danger" : "budget-gold"}>
            {formatCurrency(summary.remaining)}
          </h2>
          <small>Available balance</small>
        </article>

        <article className="budget-summary-card">
          <span>Unpaid Expenses</span>
          <h2>{formatCurrency(summary.unpaid)}</h2>
          <small>Pending and partially paid</small>
        </article>
      </section>

      <section className="budget-panel">
        <div className="budget-panel-heading">
          <div>
            <h2>Project Budgets</h2>
            <p>Budget allocation and spending overview.</p>
          </div>
        </div>

        <div className="project-budget-list">
          {projects
            .filter(
              (project) =>
                projectFilter === "all" ||
                project.id === Number(projectFilter)
            )
            .map((project) => {
              const spent = expenses
                .filter(
                  (expense) => expense.projectId === project.id
                )
                .reduce(
                  (total, expense) => total + Number(expense.amount),
                  0
                );

              const percentage =
                project.budget > 0
                  ? (spent / project.budget) * 100
                  : 0;

              return (
                <article className="project-budget-card" key={project.id}>
                  <div className="project-budget-top">
                    <div>
                      <h3>{project.name}</h3>
                      <span>Project #{project.id}</span>
                    </div>
                    <strong>{formatCurrency(spent)}</strong>
                  </div>

                  <div className="budget-progress-track">
                    <div
                      className={
                        percentage > 100
                          ? "budget-progress-fill over-budget"
                          : "budget-progress-fill"
                      }
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                      }}
                    />
                  </div>

                  <div className="project-budget-bottom">
                    <span>{Math.round(percentage)}% used</span>
                    <span>
                      Budget: {formatCurrency(project.budget)}
                    </span>
                  </div>
                </article>
              );
            })}
        </div>
      </section>

      <section className="budget-panel">
        <div className="budget-panel-heading">
          <div>
            <h2>Expense Records</h2>
            <p>View and manage all project expenses.</p>
          </div>
          <span className="budget-record-count">
            {filteredExpenses.length} RECORDS
          </span>
        </div>

        <div className="budget-filters">
          <input
            type="search"
            placeholder="Search expenses or vendors..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partially Paid">Partially Paid</option>
          </select>
        </div>

        <div className="budget-table-wrapper">
          <table className="budget-table">
            <thead>
              <tr>
                <th>Expense</th>
                <th>Project</th>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.map((expense) => {
                const project = projects.find(
                  (item) => item.id === expense.projectId
                );

                return (
                  <tr key={expense.id}>
                    <td>
                      <strong>{expense.title}</strong>
                      <small>{expense.vendor}</small>
                    </td>
                    <td>{project?.name}</td>
                    <td>{expense.date}</td>
                    <td>{expense.category}</td>
                    <td className="budget-table-amount">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td>
                      <span
                        className={`budget-status status-${expense.status
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {expense.status}
                      </span>
                    </td>
                    <td>
                      <div className="budget-actions">
                        <button onClick={() => openEditForm(expense)}>
                          Edit
                        </button>
                        <button onClick={() => deleteExpense(expense.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan="7" className="budget-empty">
                    No expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showForm && (
        <div
          className="budget-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <div
            className="budget-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="budget-form-title"
          >
            <div className="budget-modal-heading">
              <div>
                <span className="budgets-eyebrow">EXPENSE DETAILS</span>
                <h2 id="budget-form-title">
                  {editingId ? "Edit Expense" : "Add Expense"}
                </h2>
              </div>
              <button
                className="budget-modal-close"
                onClick={() => setShowForm(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Project
                <select
                  value={form.projectId}
                  onChange={(event) =>
                    setForm({ ...form, projectId: event.target.value })
                  }
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Expense Name
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="Enter expense name"
                />
              </label>

              <div className="budget-form-grid">
                <label>
                  Category
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                  >
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Amount (₹)
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={form.amount}
                    onChange={(event) =>
                      setForm({ ...form, amount: event.target.value })
                    }
                    placeholder="Enter amount"
                  />
                </label>
              </div>

              <div className="budget-form-grid">
                <label>
                  Date
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) =>
                      setForm({ ...form, date: event.target.value })
                    }
                  />
                </label>

                <label>
                  Payment Status
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({ ...form, status: event.target.value })
                    }
                  >
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Partially Paid</option>
                  </select>
                </label>
              </div>

              <label>
                Vendor / Paid To
                <input
                  value={form.vendor}
                  onChange={(event) =>
                    setForm({ ...form, vendor: event.target.value })
                  }
                  placeholder="Enter vendor name"
                />
              </label>

              {error && <p className="budget-form-error">{error}</p>}

              <div className="budget-modal-actions">
                <button
                  type="button"
                  className="budget-secondary-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="budget-primary-btn">
                  {editingId ? "Save Changes" : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
