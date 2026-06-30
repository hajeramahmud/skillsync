import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const STATUSES = ["todo", "inprogress", "done"];
const STATUS_LABELS = { todo: "To Do", inprogress: "In Progress", done: "Done" };
const STATUS_COLORS = { todo: "#6366f1", inprogress: "#f59e0b", done: "#10b981" };

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

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;
  if (!project) return <p style={{ padding: "40px" }}>Project not found.</p>;

  const tasksByStatus = STATUSES.reduce((acc, s) => {
    acc[s] = tasks.filter((t) => t.status === s);
    return acc;
  }, {});

  return (
    <div style={styles.container}>
      <div style={styles.infoCard}>
        <h2 style={{ margin: "0 0 8px" }}>{project.title}</h2>
        <p style={{ color: "#555", marginBottom: "12px" }}>{project.description}</p>

        <div style={styles.metaRow}>
          <span style={styles.metaLabel}>Skills needed:</span>
          {project.skillsNeeded.length ? (
            project.skillsNeeded.map((s) => (
              <span key={s} style={styles.skillTag}>{s}</span>
            ))
          ) : (
            <span style={{ color: "#888" }}>None specified</span>
          )}
        </div>

        <div style={styles.metaRow}>
          <span style={styles.metaLabel}>Owner:</span>
          <Link to={`/users/${project.owner?._id}`} style={styles.memberLink}>
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
            <h3 style={{ margin: 0 }}>Task Board</h3>
            <div style={styles.addRow}>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="New task title..."
                style={styles.input}
              />
              <button onClick={addTask} style={styles.addBtn}>
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
                  <span style={{ fontWeight: "600" }}>{STATUS_LABELS[status]}</span>
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
                    <div key={task._id} style={styles.taskCard}>
                      <p style={styles.taskTitle}>{task.title}</p>
                      <p style={styles.taskMeta}>
                        by{" "}
                        <Link to={`/users/${task.createdBy?._id}`} style={styles.creatorLink}>
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
          <p style={{ margin: 0, color: "#555" }}>
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
  container: { maxWidth: "900px", margin: "40px auto", padding: "0 24px 60px" },
  infoCard: {
    background: "#fff",
    padding: "24px",
    borderRadius: "10px",
    borderLeft: "4px solid #4f46e5",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    marginBottom: "32px",
  },
  metaRow: { display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", flexWrap: "wrap" },
  metaLabel: { fontWeight: "600", color: "#333", minWidth: "100px" },
  skillTag: {
    background: "#f3f4f6",
    color: "#374151",
    borderRadius: "4px",
    padding: "2px 10px",
    fontSize: "13px",
  },
  memberLink: {
    color: "#4f46e5",
    textDecoration: "none",
    background: "#eef2ff",
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
    border: "1px solid #ddd",
    fontSize: "14px",
    width: "240px",
  },
  addBtn: {
    padding: "8px 16px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  errText: { color: "#dc2626", fontSize: "13px", margin: "4px 0 0" },
  board: { display: "flex", gap: "16px", alignItems: "flex-start" },
  column: {
    flex: 1,
    background: "#f9fafb",
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
    color: "#fff",
    borderRadius: "999px",
    padding: "2px 8px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  emptyCol: { color: "#aaa", fontSize: "13px", textAlign: "center", marginTop: "16px" },
  taskCard: {
    background: "#fff",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
  },
  taskTitle: { margin: "0 0 4px", fontWeight: "500", fontSize: "14px" },
  taskMeta: { margin: "0 0 8px", color: "#888", fontSize: "12px" },
  creatorLink: { color: "#4f46e5", textDecoration: "none", fontWeight: "500" },
  taskActions: { display: "flex", gap: "6px" },
  moveBtn: {
    padding: "3px 10px",
    background: "#e5e7eb",
    color: "#374151",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#fff",
  },
  deleteBtn: {
    padding: "3px 8px",
    background: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    marginLeft: "auto",
  },
  lockedBox: {
    background: "#f9fafb",
    border: "1px dashed #ddd",
    borderRadius: "10px",
    padding: "24px",
    textAlign: "center",
  },
};

export default ProjectDetail;
