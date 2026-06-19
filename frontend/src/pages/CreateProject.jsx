import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      <h2>Create a Project</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder="Project Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={styles.input}
        />
        <textarea
          placeholder="Project Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={styles.textarea}
        />
        <input
          placeholder="Skills Needed (comma separated, e.g. React, Node.js)"
          value={form.skillsNeeded}
          onChange={(e) => setForm({ ...form, skillsNeeded: e.target.value })}
          style={styles.input}
        />
        <button type="submit" style={styles.btn}>Create Project</button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: "500px", margin: "40px auto", padding: "24px", background: "#fff", borderRadius: "8px" },
  form: { display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" },
  input: { padding: "10px", border: "1px solid #ddd", borderRadius: "4px" },
  textarea: { padding: "10px", border: "1px solid #ddd", borderRadius: "4px", height: "100px", resize: "vertical" },
  btn: { padding: "10px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "4px" },
  error: { color: "red" },
};

export default CreateProject;
