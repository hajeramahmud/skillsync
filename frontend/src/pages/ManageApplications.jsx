import { useEffect, useState } from "react";
import axios from "axios";
import { colors, shadow } from "../theme";
import Spinner from "../components/Spinner";
import Avatar from "../components/Avatar";
import Toast from "../components/Toast";

function ManageApplications() {
  const [myProjects, setMyProjects] = useState([]);
  const [applications, setApplications] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
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
        flash("Failed to load data.", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const flash = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const updateStatus = async (applicationId, projectId, status) => {
    try {
      await axios.put(`/api/projects/status/${applicationId}`, { status }, { headers });
      setApplications((prev) => ({
        ...prev,
        [projectId]: prev[projectId].map((a) =>
          a._id === applicationId ? { ...a, status } : a
        ),
      }));
      flash(`Application ${status}.`, status === "accepted" ? "success" : "info");
    } catch (err) {
      flash("Failed to update status.", "error");
    }
  };

  if (loading) return <Spinner label="Loading..." />;

  return (
    <div style={styles.container}>
      <Toast message={message} type={messageType} />
      <h2 style={{ marginBottom: "6px", color: colors.text }}>Manage Applications</h2>
      <p style={styles.sub}>Review applicants for your projects</p>

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
                    <div style={styles.appLeft}>
                      <Avatar name={app.applicant.name} size={38} />
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
  const variants = {
    pending: { background: colors.warningMuted, color: colors.warning },
    accepted: { background: colors.successMuted, color: colors.success },
    rejected: { background: colors.dangerMuted, color: colors.danger },
  };
  return {
    ...variants[status],
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    alignSelf: "flex-start",
  };
};

const styles = {
  loading: { padding: "40px", color: colors.textMuted },
  container: { maxWidth: "750px", margin: "40px auto", padding: "24px" },
  sub: { color: colors.textMuted, marginBottom: "24px" },
  empty: { color: colors.textMuted, textAlign: "center", marginTop: "40px" },
  projectBlock: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: "10px",
    marginBottom: "24px",
    boxShadow: shadow.card,
    overflow: "hidden",
  },
  projectHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: colors.accent,
    color: "#0b0e14",
    padding: "14px 20px",
  },
  countBadge: {
    background: "rgba(11, 14, 20, 0.2)",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "13px",
  },
  noApps: { color: colors.textFaint, padding: "16px 20px", margin: 0 },
  appCard: {
    borderBottom: `1px solid ${colors.border}`,
    padding: "16px 20px",
  },
  appTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  appLeft: { display: "flex", gap: "12px", alignItems: "flex-start" },
  appName: { fontWeight: "600", margin: "0 0 2px", color: colors.text },
  appEmail: { color: colors.textMuted, fontSize: "13px", margin: "0 0 8px" },
  skillsRow: { display: "flex", flexWrap: "wrap", gap: "6px" },
  skillTag: {
    background: colors.surfaceAlt,
    color: colors.textMuted,
    border: `1px solid ${colors.border}`,
    borderRadius: "4px",
    padding: "2px 8px",
    fontSize: "12px",
  },
  skillMatch: {
    background: colors.successMuted,
    color: colors.success,
    borderRadius: "4px",
    padding: "2px 8px",
    fontSize: "12px",
    fontWeight: "600",
  },
  noSkills: { color: colors.textFaint, fontSize: "12px" },
  actions: { display: "flex", gap: "10px", marginTop: "12px" },
  acceptBtn: {
    padding: "6px 18px",
    background: colors.success,
    color: "#0b0e14",
    border: "none",
    borderRadius: "4px",
    fontWeight: "600",
  },
  rejectBtn: {
    padding: "6px 18px",
    background: colors.danger,
    color: "#0b0e14",
    border: "none",
    borderRadius: "4px",
    fontWeight: "600",
  },
};

export default ManageApplications;
