import React, { useState } from "react";
import API from "../../api";
import Header from "../../components/Common/Header";

function Admin() {
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [view, setView] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/admin/users");
      setUsers(res.data);
      setMetrics(null);
      setView("users");
    } catch (err) {
      alert("Cannot fetch users");
      console.error(err);
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await API.get("/auth/admin/metrics");
      setMetrics(res.data);
      setUsers([]);
      setView("metrics");
    } catch (err) {
      alert("Cannot fetch metrics");
      console.error(err);
    }
  };

  const toggleBlock = async (id, block) => {
    try {
      await API.post("/auth/admin/block-user", {
        user_id: id,
        block: block,
      });
      fetchUsers();
    } catch (err) {
      alert("Action failed");
    }
  };

  return (
    <>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>👑 Admin Panel</h2>

        <div style={{ display: "flex", gap: "1rem", margin: "1.5rem 0" }}>
          <button style={btn} onClick={fetchUsers}>
            View Registered Users
          </button>
          <button style={btn} onClick={fetchMetrics}>
            View System Metrics
          </button>
        </div>

        {/* USERS */}
        {view === "users" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Email</th>
                <th style={th}>Role</th>
                <th style={th}>Status</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={td}>{u.email}</td>
                  <td style={td}>{u.role}</td>
                  <td style={td}>
                    {u.blocked ? "🚫 Blocked" : "✅ Active"}
                  </td>
                  <td style={td}>
                    {u.role !== "admin" && (
                      <button
                        onClick={() => toggleBlock(u.id, !u.blocked)}
                        style={{
                          padding: "6px 10px",
                          border: "none",
                          borderRadius: "6px",
                          background: u.blocked ? "#2ecc71" : "#ff4d4d",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        {u.blocked ? "Unblock" : "Block"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* METRICS */}
        {view === "metrics" && metrics && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <Metric title="Total Users" value={metrics.total_users} />
            <Metric title="Active Users" value={metrics.active_users} />
            <Metric title="Blocked Users" value={metrics.blocked_users} />
            <Metric title="Watchlist Items" value={metrics.watchlist_items} />
            <Metric title="Server Uptime" value={`${metrics.server_uptime_seconds}s`} />
          </div>
        )}
      </div>
    </>
  );
}

function Metric({ title, value }) {
  return (
    <div style={{
      background: "#111",
      padding: "1.2rem",
      borderRadius: "12px",
      textAlign: "center",
      border: "1px solid #222",
    }}>
      <p style={{ color: "#aaa" }}>{title}</p>
      <h2 style={{ color: "#3a80e9" }}>{value}</h2>
    </div>
  );
}

const btn = {
  padding: "10px 18px",
  borderRadius: "999px",
  border: "none",
  background: "#3a80e9",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
};

const th = { padding: "10px", borderBottom: "1px solid #333" };
const td = { padding: "10px", borderBottom: "1px solid #222" };

export default Admin;
