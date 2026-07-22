import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { colors, shadow } from "../theme";

function CreateProject() {
  const [form, setForm] = useState({ title: "", description: "", skillsNeeded: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/projects",
        { ...form, skillsNeeded: form.skillsNeeded.split(",").map((s) => s.trim()) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/projects");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ color: colors.text }}>Create a Project</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder="Project Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={styles.input}
          className="ss-input"
        />
        <textarea
          placeholder="Project Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={styles.textarea}
          className="ss-input"
        />
        <input
          placeholder="Skills Needed (comma separated, e.g. React, Node.js)"
          value={form.skillsNeeded}
          onChange={(e) => setForm({ ...form, skillsNeeded: e.target.value })}
          style={styles.input}
          className="ss-input"
        />
        <button type="submit" style={styles.btn} className="ss-btn-primary">Create Project</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "28px",
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    boxShadow: shadow.card,
  },
  form: { display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" },
  input: {
    padding: "10px 12px",
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    background: colors.surfaceAlt,
    color: colors.text,
  },
  textarea: {
    padding: "10px 12px",
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    background: colors.surfaceAlt,
    color: colors.text,
    height: "100px",
    resize: "vertical",
  },
  btn: {
    padding: "10px",
    background: colors.accent,
    color: "#0b0e14",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
  },
  error: { color: colors.danger, fontSize: "14px" },
};

export default CreateProject;
