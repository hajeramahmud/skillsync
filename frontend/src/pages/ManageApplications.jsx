import { useEffect, useState } from "react";
import axios from "axios";

function ManageApplications() {
  const [myProjects, setMyProjects] = useState([]);
  const [applications, setApplications] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, projectsRes] = await Promise.all([
          axios.get("/api/users/profile", { headers }),
          axios.get("/api/projects"),
        ]);

        const userId = profileRes.data._id;
        setCurrentUserId(userId);

        const owned = projectsRes.data.filter(
          (p) => p.owner._id === userId || p.owner === userId
        );
        setMyProjects(owned);

        const appMap = {};
        await Promise.all(
          owned.map(async (p) => {
            const res = await axios.get(`/api/projects/${p._id}/applications`, { headers });
            appMap[p._id] = res.data;
          })
        );
        setApplications(appMap);
      } catch (err) {
        setMessage("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateStatus = async (applicationId, projectId, status) => {
    try {
      await axios.put(`/api/projects/status/${applicationId}`, { status }, { headers });
      setApplications((prev) => ({
        ...prev,
        [projectId]: prev[projectId].map((a) =>
          a._id === applicationId ? { ...a, status } : a
        ),
      }));
      setMessage(`Application ${status}.`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to update status.");
    }
  };

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: "6px" }}>Manage Applications</h2>
      <p style={styles.sub}>Review applicants for your projects</p>

      {message && <p style={styles.msg}>{message}</p>}

      {myProjects.length === 0 && (
        <p style={styles.empty}>You have not created any projects yet.</p>
      )}

      {myProjects.map((project) => {
        const apps = applications[project._id] || [];
        return (
          <div key={project._id} style={styles.projectBlock}>
            <div style={styles.projectHeader}>
              <h3 style={{ margin: 0 }}>{project.title}</h3>
              <span style={styles.countBadge}>
                {apps.length} applicant{apps.length !== 1 ? "s" : ""}
              </span>
            </div>

            {apps.length === 0 ? (
              <p style={styles.noApps}>No applications yet.</p>
            ) : (
              apps.map((app) => (
                <div key={app._id} style={styles.appCard}>
                  <div style={styles.appTop}>
                    <div>
                      <p style={styles.appName}>{app.applicant.name}</p>
                      <p style={styles.appEmail}>{app.applicant.email}</p>
                      <div style={styles.skillsRow}>
                        {app.applicant.skills.length > 0
                          ? app.applicant.skills.map((s) => {
                              const isNeeded = project.skillsNeeded
                                .map((x) => x.toLowerCase())
                                .includes(s.toLowerCase());
                              return (
                                <span
                                  key={s}
                                  style={isNeeded ? styles.skillMatch : styles.skillTag}
                                >
                                  {s}
                                </span>
                              );
                            })
                          : <span style={styles.noSkills}>No skills listed</span>}
                      </div>
                    </div>
                    <span style={statusBadge(app.status)}>{app.status}</span>
                  </div>

                  {app.status === "pending" && (
                    <div style={styles.actions}>
                      <button
                        style={styles.acceptBtn}
                        onClick={() => updateStatus(app._id, project._id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        style={styles.rejectBtn}
                        onClick={() => updateStatus(app._id, project._id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}

const statusBadge = (status) => {
  const colors = {
    pending: { background: "#fef3c7", color: "#92400e" },
    accepted: { background: "#dcfce7", color: "#15803d" },
    rejected: { background: "#fee2e2", color: "#991b1b" },
  };
  return {
    ...colors[status],
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    alignSelf: "flex-start",
  };
};

const styles = {
  container: { maxWidth: "750px", margin: "40px auto", padding: "24px" },
  sub: { color: "#666", marginBottom: "24px" },
  msg: { background: "#e0f2fe", padding: "10px", borderRadius: "4px", marginBottom: "16px" },
  empty: { color: "#888", textAlign: "center", marginTop: "40px" },
  projectBlock: {
    background: "#fff",
    borderRadius: "10px",
    marginBottom: "24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    overflow: "hidden",
  },
  projectHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#4f46e5",
    color: "#fff",
    padding: "14px 20px",
  },
  countBadge: {
    background: "rgba(255,255,255,0.2)",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "13px",
  },
  noApps: { color: "#888", padding: "16px 20px", margin: 0 },
  appCard: {
    borderBottom: "1px solid #f0f0f0",
    padding: "16px 20px",
  },
  appTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  appName: { fontWeight: "600", margin: "0 0 2px" },
  appEmail: { color: "#666", fontSize: "13px", margin: "0 0 8px" },
  skillsRow: { display: "flex", flexWrap: "wrap", gap: "6px" },
  skillTag: {
    background: "#f3f4f6",
    color: "#374151",
    borderRadius: "4px",
    padding: "2px 8px",
    fontSize: "12px",
  },
  skillMatch: {
    background: "#dcfce7",
    color: "#15803d",
    borderRadius: "4px",
    padding: "2px 8px",
    fontSize: "12px",
    fontWeight: "600",
  },
  noSkills: { color: "#aaa", fontSize: "12px" },
  actions: { display: "flex", gap: "10px", marginTop: "12px" },
  acceptBtn: {
    padding: "6px 18px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
  rejectBtn: {
    padding: "6px 18px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default ManageApplications;
