import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { adminCreate, adminDelete, adminList, adminUpdate } from "../api/admin";
import "../styles/admin_style.css";

const yesNo = (v) => (v ? "Yes" : "No");
const date = (v) => (v ? new Date(v).toLocaleString() : "");

// Each tab describes its table columns and the fields shown in the edit form.
const TABS = {
  users: {
    label: "Users",
    icon: "fa-users",
    canAdd: true,
    cols: [
      ["ID", (r) => r.id],
      ["Name", (r) => [r.first_name, r.last_name].filter(Boolean).join(" ") || "—"],
      ["Email", (r) => r.email],
      ["Phone", (r) => r.phone || "—"],
      ["Orders", (r) => r.orders_count],
      [
        "Order details",
        (r) =>
          r.orders.length
            ? r.orders.map((o) => `#${o.id} ${o.status} ₹${o.total_amount}`).join(", ")
            : "—",
      ],
      ["Role", (r) => (r.is_staff ? "Admin" : "User")],
      ["Active", (r) => yesNo(r.is_active)],
    ],
    fields: [
      { name: "first_name", label: "First name" },
      { name: "last_name", label: "Last name" },
      { name: "email", label: "Email", type: "email" },
      { name: "username", label: "Username (login id)", createOnly: false },
      { name: "phone", label: "Phone" },
      {
        name: "password",
        label: "Password",
        type: "password",
        hint: "Passwords are stored encrypted and can't be viewed. Type a new one to reset it; leave blank to keep the current one.",
      },
      { name: "is_active", label: "Active (can log in)", type: "checkbox" },
      { name: "is_staff", label: "Admin (staff access)", type: "checkbox" },
    ],
    blank: { is_active: true, is_staff: false },
  },
  orders: {
    label: "Orders",
    icon: "fa-suitcase-rolling",
    cols: [
      ["ID", (r) => r.id],
      ["User", (r) => `${r.user_name} (${r.user_email})`],
      ["Phone", (r) => r.phone],
      ["Travel date", (r) => r.travel_date],
      ["Items", (r) => r.items.map((i) => `${i.quantity} × ${i.destination_name}`).join(", ")],
      ["Total", (r) => `₹${r.total_amount}`],
      ["Status", (r) => r.status],
      ["Placed", (r) => date(r.created_at)],
    ],
    fields: [
      { name: "status", label: "Status", type: "select", options: ["PENDING", "CONFIRMED", "CANCELLED"] },
      { name: "phone", label: "Phone" },
      { name: "travel_date", label: "Travel date", type: "date" },
    ],
  },
  destinations: {
    label: "Destinations",
    icon: "fa-location-dot",
    canAdd: true,
    cols: [
      ["ID", (r) => r.id],
      ["Name", (r) => r.name],
      ["Category", (r) => r.category],
      ["Price", (r) => r.price],
      ["Slug", (r) => r.slug],
      ["Description", (r) => r.description],
    ],
    fields: [
      { name: "name", label: "Name" },
      { name: "slug", label: "Slug (e.g. goa)" },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: ["beach", "mountain", "city", "nature", "adventure"],
      },
      { name: "description", label: "Description" },
      { name: "price", label: "Price label (e.g. ₹15000)" },
      { name: "price_amount", label: "Price amount (number)", type: "number" },
    ],
    blank: { category: "beach" },
  },
  messages: {
    label: "Messages",
    icon: "fa-envelope",
    cols: [
      ["ID", (r) => r.id],
      ["Name", (r) => r.name],
      ["Email", (r) => r.email],
      ["Subject", (r) => r.subject],
      ["Message", (r) => r.message],
      ["Received", (r) => date(r.created_at)],
    ],
    fields: [],
  },
  subscribers: {
    label: "Subscribers",
    icon: "fa-newspaper",
    cols: [
      ["ID", (r) => r.id],
      ["Email", (r) => r.email],
      ["Subscribed", (r) => date(r.subscribed_at)],
    ],
    fields: [],
  },
};

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [tab, setTab] = useState("users");
  // Rows are stored together with the tab they belong to, so switching tabs
  // never tries to draw the previous tab's rows with the new tab's columns.
  const [result, setResult] = useState({ tab: null, rows: [] });
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const cfg = TABS[tab];

  const rows = result.tab === tab ? result.rows : [];
  const loading = result.tab !== tab;

  const load = useCallback(async () => {
    try {
      const data = await adminList(tab);
      setResult({ tab, rows: Array.isArray(data) ? data : data.results ?? [] });
    } catch (err) {
      setResult({ tab, rows: [] });
      showToast(err.message, "error");
    }
  }, [tab, showToast]);

  useEffect(() => {
    setEditing(null);
    setSearch("");
    setError("");
    load();
  }, [load]);

  const handleDelete = async (row) => {
    const warn =
      tab === "users"
        ? "Delete this user? Their orders and cart will be deleted too. (Untick 'Active' instead to just block login.)"
        : "Delete this record?";
    if (!window.confirm(warn)) return;
    try {
      await adminDelete(tab, row.id);
      showToast("Deleted");
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const body = { ...editing };
    if (!body.password) delete body.password; // blank = keep current password
    try {
      if (editing.id) await adminUpdate(tab, editing.id, body);
      else await adminCreate(tab, body);
      showToast("Saved");
      setEditing(null);
      load();
    } catch (err) {
      const first = err.data && typeof err.data === "object" ? Object.entries(err.data)[0] : null;
      setError(first ? `${first[0]}: ${[].concat(first[1]).join(" ")}` : err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const filtered = rows.filter((r) =>
    JSON.stringify(r).toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <i className="fa-solid fa-plane"></i> Wanderly
          <small>Admin</small>
        </div>
        {Object.entries(TABS).map(([key, t]) => (
          <button
            key={key}
            className={`admin-tab ${tab === key ? "active" : ""}`}
            onClick={() => setTab(key)}
          >
            <i className={`fa-solid ${t.icon}`}></i> {t.label}
          </button>
        ))}
        <div className="admin-sidebar-bottom">
          <Link to="/" className="admin-tab">
            <i className="fa-solid fa-globe"></i> View site
          </Link>
          <button className="admin-tab" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h1>{cfg.label}</h1>
          <span className="admin-who">Signed in as {user?.first_name || user?.email}</span>
        </div>

        <div className="admin-toolbar">
          <input
            type="search"
            placeholder={`Search ${cfg.label.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {cfg.canAdd && (
            <button className="admin-btn primary" onClick={() => { setError(""); setEditing({ ...(cfg.blank || {}) }); }}>
              + Add new
            </button>
          )}
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {cfg.cols.map(([label]) => (
                  <th key={label}>{label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={cfg.cols.length + 1}>Loading...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={cfg.cols.length + 1}>Nothing found.</td></tr>
              )}
              {!loading &&
                filtered.map((r) => (
                  <tr key={r.id}>
                    {cfg.cols.map(([label, render]) => (
                      <td key={label}>{render(r)}</td>
                    ))}
                    <td className="admin-actions">
                      {cfg.fields.length > 0 && (
                        <button className="admin-btn" onClick={() => { setError(""); setEditing({ ...r, password: "" }); }}>
                          Edit
                        </button>
                      )}
                      <button className="admin-btn danger" onClick={() => handleDelete(r)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {editing && (
          <div className="admin-modal" onClick={() => setEditing(null)}>
            <form className="admin-form" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
              <h2>{editing.id ? `Edit ${cfg.label.slice(0, -1)} #${editing.id}` : `Add ${cfg.label.slice(0, -1)}`}</h2>

              {cfg.fields.map((f) => {
                const value = editing[f.name] ?? "";
                const set = (v) => setEditing({ ...editing, [f.name]: v });
                if (f.type === "checkbox")
                  return (
                    <label key={f.name} className="admin-check">
                      <input type="checkbox" checked={!!editing[f.name]} onChange={(e) => set(e.target.checked)} />
                      {f.label}
                    </label>
                  );
                return (
                  <label key={f.name}>
                    {f.label}
                    {f.type === "select" ? (
                      <select value={value} onChange={(e) => set(e.target.value)}>
                        {f.options.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={f.type || "text"}
                        value={value}
                        autoComplete={f.type === "password" ? "new-password" : "off"}
                        placeholder={f.type === "password" && editing.id ? "New password (optional)" : ""}
                        onChange={(e) => set(e.target.value)}
                      />
                    )}
                    {f.hint && <small>{f.hint}</small>}
                  </label>
                );
              })}

              {error && <p className="admin-error">{error}</p>}
              <div className="admin-form-buttons">
                <button type="button" className="admin-btn" onClick={() => setEditing(null)}>Cancel</button>
                <button type="submit" className="admin-btn primary" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
