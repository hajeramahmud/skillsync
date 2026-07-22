import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { colors, shadow } from "../theme";

const STATUSES = ["todo", "inprogress", "done"];
const STATUS_LABELS = { todo: "To Do", inprogress: "In Progress", done: "Done" };
const STATUS_COLORS = { todo: colors.accent, inprogress: colors.warning, done: colors.success };

const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1])).id;
  } catch {
    return null;
  }
};

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [canAccess, setCanAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addError, setAddError] = useState("");
  const token = localStorage.getItem("token");
  const currentUserId = getUserId();

  useEffect(() => {
    const load = async () => {
      try {
        const projRes = await axios.get(`/api/projects/${id}`);
        const proj = projRes.data;
        setProject(proj);

        if (token && currentUserId) {
          const isOwner = (proj.owner?._id || proj.owner) === currentUserId;
          const isMember = proj.members?.some(
            (m) => (m._id || m) === currentUserId
          );

          if (isOwner || isMember) {
            setCanAccess(true);
            const taskRes = await axios.get(`/api/projects/${id}/tasks`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(taskRes.data);
          }
        }
      } catch {
        setProject(null);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const addTask = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await axios.post(
        `/api/projects/${id}/tasks`,
        { title: newTitle.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) => [...prev, res.data]);
      setNewTitle("");
      setAddError("");
    } catch (err) {
      setAddError(err.response?.data?.message || "Failed to add task");
    }
  };

  const moveTask = async (taskId, newStatus) => {
    const res = await axios.put(
      `/api/tasks/${taskId}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
  };

  const deleteTask = async (taskId) => {
    await axios.delete(`/api/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  if (loading) return <p style={styles.loading}>Loading...</p>;
  if (!project) return <p style={styles.loading}>Project not found.</p>;

  const tasksByStatus = STATUSES.reduce((acc, s) => {
    acc[s] = tasks.filter((t) => t.status === s);
    return acc;
  }, {});

  return (
    <div style={styles.container}>
      <div style={styles.infoCard}>
        <h2 style={{ margin: "0 0 8px", color: colors.text }}>{project.title}</h2>
        <p style={{ color: colors.textMuted, marginBottom: "12px" }}>{project.description}</p>

        <div style={styles.metaRow}>
          <span style={styles.metaLabel}>Skills needed:</span>
          {project.skillsNeeded.length ? (
            project.skillsNeeded.map((s) => (
              <span key={s} style={styles.skillTag}>{s}</span>
            ))
          ) : (
            <span style={{ color: colors.textFaint }}>None specified</span>
          )}
        </div>

        <div style={styles.metaRow}>
          <span style={styles.metaLabel}>Owner:</span>
          <Link to={`/users/${project.owner?._id}`} style={styles.memberLink} className="ss-link">
            {project.owner?.name}
          </Link>
        </div>

        {project.members?.length > 0 && (
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Team:</span>
            {project.members.map((m) => (
              <Link
                key={m._id || m}
                to={`/users/${m._id || m}`}
                style={styles.memberLink}
                className="ss-link"
              >
                {m.name || "Member"}
              </Link>
            ))}
          </div>
        )}
      </div>

      {canAccess ? (
        <>
          <div style={styles.boardHeader}>
            <h3 style={{ margin: 0, color: colors.text }}>Task Board</h3>
            <div style={styles.addRow}>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="New task title..."
                style={styles.input}
                className="ss-input"
              />
              <button onClick={addTask} style={styles.addBtn} className="ss-btn-primary">
                + Add Task
              </button>
            </div>
            {addError && <p style={styles.errText}>{addError}</p>}
          </div>

          <div style={styles.board}>
            {STATUSES.map((status) => (
              <div key={status} style={styles.column}>
                <div
                  style={{
                    ...styles.colHeader,
                    borderBottom: `3px solid ${STATUS_COLORS[status]}`,
                  }}
                >
                  <span style={{ fontWeight: "600", color: colors.text }}>{STATUS_LABELS[status]}</span>
                  <span style={{ ...styles.countBadge, background: STATUS_COLORS[status] }}>
                    {tasksByStatus[status].length}
                  </span>
                </div>

                {tasksByStatus[status].length === 0 && (
                  <p style={styles.emptyCol}>No tasks here</p>
                )}

                {tasksByStatus[status].map((task) => {
                  const idx = STATUSES.indexOf(status);
                  const isCreator = task.createdBy?._id === currentUserId;
                  const isOwner =
                    (project.owner?._id || project.owner) === currentUserId;

                  return (
                    <div key={task._id} style={styles.taskCard} className="ss-card">
                      <p style={styles.taskTitle}>{task.title}</p>
                      <p style={styles.taskMeta}>
                        by{" "}
                        <Link to={`/users/${task.createdBy?._id}`} style={styles.creatorLink} className="ss-link">
                          {task.createdBy?.name}
                        </Link>
                      </p>
                      <div style={styles.taskActions}>
                        {idx > 0 && (
                          <button
                            onClick={() => moveTask(task._id, STATUSES[idx - 1])}
                            style={styles.moveBtn}
                            title="Move back"
                          >
                            ←
                          </button>
                        )}
                        {idx < STATUSES.length - 1 && (
                          <button
                            onClick={() => moveTask(task._id, STATUSES[idx + 1])}
                            style={{ ...styles.moveBtn, background: STATUS_COLORS[STATUSES[idx + 1]] }}
                            title="Move forward"
                          >
                            →
                          </button>
                        )}
                        {(isCreator || isOwner) && (
                          <button
                            onClick={() => deleteTask(task._id)}
                            style={styles.deleteBtn}
                            title="Delete task"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={styles.lockedBox}>
          <p style={{ margin: 0, color: colors.textMuted }}>
            {token
              ? "You must be a member of this project to access the task board."
              : "Log in and join this project to access the task board."}
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  loading: { padding: "40px", color: colors.textMuted },
  container: { maxWidth: "900px", margin: "40px auto", padding: "0 24px 60px" },
  infoCard: {
    background: colors.surface,
    padding: "24px",
    borderRadius: "10px",
    border: `1px solid ${colors.border}`,
    borderLeft: `4px solid ${colors.accent}`,
    boxShadow: shadow.card,
    marginBottom: "32px",
  },
  metaRow: { display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", flexWrap: "wrap" },
  metaLabel: { fontWeight: "600", color: colors.text, minWidth: "100px" },
  skillTag: {
    background: colors.surfaceAlt,
    color: colors.textMuted,
    border: `1px solid ${colors.border}`,
    borderRadius: "4px",
    padding: "2px 10px",
    fontSize: "13px",
  },
  memberLink: {
    color: colors.accent,
    textDecoration: "none",
    background: colors.accentMuted,
    padding: "2px 10px",
    borderRadius: "4px",
    fontSize: "13px",
  },
  boardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "20px",
  },
  addRow: { display: "flex", gap: "8px" },
  input: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: `1px solid ${colors.border}`,
    background: colors.surfaceAlt,
    color: colors.text,
    fontSize: "14px",
    width: "240px",
  },
  addBtn: {
    padding: "8px 16px",
    background: colors.accent,
    color: "#0b0e14",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
  },
  errText: { color: colors.danger, fontSize: "13px", margin: "4px 0 0" },
  board: { display: "flex", gap: "16px", alignItems: "flex-start" },
  column: {
    flex: 1,
    background: colors.surfaceAlt,
    border: `1px solid ${colors.border}`,
    borderRadius: "10px",
    padding: "16px",
    minHeight: "200px",
  },
  colHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "10px",
    marginBottom: "12px",
  },
  countBadge: {
    color: "#0b0e14",
    borderRadius: "999px",
    padding: "2px 8px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  emptyCol: { color: colors.textFaint, fontSize: "13px", textAlign: "center", marginTop: "16px" },
  taskCard: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "10px",
    boxShadow: shadow.card,
  },
  taskTitle: { margin: "0 0 4px", fontWeight: "500", fontSize: "14px", color: colors.text },
  taskMeta: { margin: "0 0 8px", color: colors.textFaint, fontSize: "12px" },
  creatorLink: { color: colors.accent, textDecoration: "none", fontWeight: "500" },
  taskActions: { display: "flex", gap: "6px" },
  moveBtn: {
    padding: "3px 10px",
    background: colors.surfaceHover,
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "13px",
  },
  deleteBtn: {
    padding: "3px 8px",
    background: colors.dangerMuted,
    color: colors.danger,
    border: "none",
    borderRadius: "4px",
    fontSize: "13px",
    marginLeft: "auto",
  },
  lockedBox: {
    background: colors.surfaceAlt,
    border: `1px dashed ${colors.border}`,
    borderRadius: "10px",
    padding: "24px",
    textAlign: "center",
  },
};

export default ProjectDetail;
