import { useEffect, useState } from "react";
import axios from "axios";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("/api/projects").then((res) => setProjects(res.data));
  }, []);

  const apply = async (id) => {
    try {
      await axios.post(`/api/projects/${id}/apply`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setMessage("Application sent!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Browse Projects</h2>
      {message && <p style={styles.msg}>{message}</p>}
      {projects.length === 0 && <p>No projects yet.</p>}
      {projects.map((p) => (
        <div key={p._id} style={styles.card}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          <p style={styles.skills}><strong>Skills needed:</strong> {p.skillsNeeded.join(", ")}</p>
          <p style={styles.owner}>Posted by {p.owner?.name}</p>
          {token && (
            <button onClick={() => apply(p._id)} style={styles.btn}>Apply</button>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { maxWidth: "700px", margin: "40px auto", padding: "24px" },
  card: { background: "#fff", padding: "20px", borderRadius: "8px", marginBottom: "16px", borderLeft: "4px solid #4f46e5" },
  skills: { color: "#555", marginTop: "8px" },
  owner: { color: "#888", fontSize: "13px", marginTop: "8px" },
  btn: { marginTop: "12px", padding: "8px 16px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "4px" },
  msg: { background: "#e0f2fe", padding: "10px", borderRadius: "4px", marginBottom: "12px" },
};

export default Projects;
