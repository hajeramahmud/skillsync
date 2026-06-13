import { useEffect, useState } from "react";
import axios from "axios";

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get("/api/projects").then((res) => setProjects(res.data));
  }, []);

  return (
    <div style={styles.container}>
      <h2>Browse Projects</h2>
      {projects.length === 0 && <p>No projects yet.</p>}
      {projects.map((p) => (
        <div key={p._id} style={styles.card}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          <p style={styles.skills}><strong>Skills needed:</strong> {p.skillsNeeded.join(", ")}</p>
          <p style={styles.owner}>Posted by {p.owner?.name}</p>
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
};

export default Projects;
