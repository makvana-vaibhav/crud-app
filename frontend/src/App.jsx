import { useEffect, useMemo, useState } from "react";
import "./App.css";

const emptyForm = { name: "" };
const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const USERS_API_URL = `${API_BASE_URL}/api/users`;

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingUserId, setEditingUserId] = useState(null);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [loading, setLoading] = useState(true);

  const totalUsers = useMemo(() => users.length, [users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(USERS_API_URL);
      if (!response.ok) {
        throw new Error("Unable to load users");
      }
      const data = await response.json();
      setUsers(data);
      setStatus({ type: "idle", message: "" });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingUserId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = form.name.trim();

    if (!trimmedName) {
      setStatus({ type: "error", message: "Please enter a user name." });
      return;
    }

    try {
      const response = await fetch(
        editingUserId ? `${USERS_API_URL}/${editingUserId}` : USERS_API_URL,
        {
          method: editingUserId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmedName }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Unable to save user");
      }

      await loadUsers();
      resetForm();
      setStatus({
        type: "success",
        message: editingUserId ? "User updated successfully." : "User added successfully.",
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const startEdit = (user) => {
    setEditingUserId(user.id);
    setForm({ name: user.name });
    setStatus({ type: "idle", message: "" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this user?");
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${USERS_API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Unable to delete user");
      }

      await loadUsers();
      if (editingUserId === id) {
        resetForm();
      }
      setStatus({ type: "success", message: "User deleted successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  return (
    <div className="app-shell">
      <main className="dashboard">
        <section className="hero-card">
          <div>
            <p className="eyebrow">Three-tier practice app</p>
            <h1>User Management</h1>
            <p className="subtext">
              Add, update, list, and delete users from a clean demo interface backed by a simple API and PostgreSQL.
            </p>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <span>Total users</span>
              <strong>{totalUsers}</strong>
            </div>
            <div className="stat-card accent">
              <span>Mode</span>
              <strong>{editingUserId ? "Edit" : "Add"}</strong>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <form className="panel form-panel" onSubmit={handleSubmit}>
            <div className="panel-header">
              <div>
                <p className="panel-kicker">User form</p>
                <h2>{editingUserId ? "Update user" : "Add new user"}</h2>
              </div>
              {editingUserId && (
                <button type="button" className="ghost-button" onClick={resetForm}>
                  Cancel edit
                </button>
              )}
            </div>

            <label className="field">
              <span>Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm({ name: event.target.value })}
                placeholder="Enter a user name"
                autoComplete="off"
              />
            </label>

            <button className="primary-button" type="submit">
              {editingUserId ? "Save changes" : "Add user"}
            </button>

            {status.message && <p className={`status ${status.type}`}>{status.message}</p>}
          </form>

          <section className="panel list-panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">User list</p>
                <h2>All users</h2>
              </div>
              <button type="button" className="ghost-button" onClick={loadUsers}>
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="empty-state">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="empty-state">No users yet. Add the first one above.</div>
            ) : (
              <ul className="user-list">
                {users.map((user) => (
                  <li className="user-row" key={user.id}>
                    <div>
                      <p className="user-name">{user.name}</p>
                      <span className="user-id">ID #{user.id}</span>
                    </div>
                    <div className="row-actions">
                      <button type="button" className="secondary-button" onClick={() => startEdit(user)}>
                        Edit
                      </button>
                      <button type="button" className="danger-button" onClick={() => handleDelete(user.id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;