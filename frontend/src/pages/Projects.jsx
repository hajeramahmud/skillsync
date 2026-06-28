import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const getMatchPercent = (userSkills, skillsNeeded) => {
  if (!skillsNeeded.length) return 100;
  const lower = userSkills.map((s) => s.toLowerCase());
  const matched = skillsNeeded.filter((s) => lower.includes(s.toLowerCase()));
  return Math.round((matched.length / skillsNeeded.length) * 100);
};

const badgeStyle = (pct) => {
  const color = pct >= 75 ? "#16a34a" : pct >= 40 ? "#d97706" : "#6b7280";
  return {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "999px",
    background: color,
    color: "#fff",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "8px",
  };
};

function ProjectCard({ p, userSkills, token, onApply }) {
  const pct = userSkills ? getMatchPercent(userSkills, p.skillsNeeded) : null;

  return (
    <div style={styles.card}>
      {pct !== null && (
        <span style={badgeStyle(pct)}>
          {pct === 100 && p.skillsNeeded.length === 0 ? "Open to All" : `${pct}% Match`}
        </span>
      )}
      <h3 style={{ margin: "4px 0 8px" }}>{p.title}</h3>
      <p style={{ color: "#444", marginBottom: "8px" }}>{p.description}</p>
      <p style={styles.skills}>
        <strong>Skills needed:</strong>{" "}
        {p.skillsNeeded.length
          ? p.skillsNeeded.map((skill) => {
              const isMatch =
                userSkills &&
                userSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase());
              return (
                <span key={skill} style={isMatch ? styles.skillMatch : styles.skillTag}>
                  {skill}
                </span>
              );
            })
          : "None specified"}
      </p>
      <p style={styles.owner}>Posted by {p.owner?.name}</p>
      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <Link to={`/projects/${p._id}`} style={styles.viewBtn}>View Details</Link>
        {token && (
          <button onClick={() => onApply(p._id)} style={styles.btn}>
            Apply
          </button>
        )}
      </div>
    </div>
  );
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [userSkills, setUserSkills] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("/api/projects").then((res) => setProjects(res.data));

    if (token) {
      axios
        .get("/api/users/profile", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUserSkills(res.data.skills || []))
        .catch(() => setUserSkills([]));
    }
  }, []);

  const apply = async (id) => {
    try {
      await axios.post(
        `/api/projects/${id}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Application sent!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const recommended =
    userSkills && userSkills.length > 0
      ? projects
          .map((p) => ({ ...p, pct: getMatchPercent(userSkills, p.skillsNeeded) }))
          .filter((p) => p.pct > 0)
          .sort((a, b) => b.pct - a.pct)
      : [];

  return (
    <div style={styles.container}>
      {message && <p style={styles.msg}>{message}</p>}

      {recommended.length > 0 && (
        <section style={{ marginBottom: "40px" }}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>✦</span>
            <h2 style={{ margin: 0 }}>Recommended for You</h2>
          </div>
          <p style={styles.sectionSub}>
            Based on your skills: <strong>{userSkills.join(", ")}</strong>
          </p>
          {recommended.map((p) => (
            <ProjectCard
              key={p._id}
              p={p}
              userSkills={userSkills}
              token={token}
              onApply={apply}
            />
          ))}
        </section>
      )}

      <section>
        <h2 style={{ marginBottom: "16px" }}>All Projects</h2>
        {projects.length === 0 && <p>No projects yet.</p>}
        {projects.map((p) => (
          <ProjectCard
            key={p._id}
            p={p}
            userSkills={userSkills}
            token={token}
            onApply={apply}
          />
        ))}
      </section>
    </div>
  );
}

const styles = {
  container: { maxWidth: "700px", margin: "40px auto", padding: "24px" },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "16px",
    borderLeft: "4px solid #4f46e5",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  skills: { color: "#555", marginTop: "8px", marginBottom: "4px" },
  skillTag: {
    display: "inline-block",
    background: "#f3f4f6",
    color: "#374151",
    borderRadius: "4px",
    padding: "2px 8px",
    marginRight: "6px",
    fontSize: "13px",
  },
  skillMatch: {
    display: "inline-block",
    background: "#dcfce7",
    color: "#15803d",
    borderRadius: "4px",
    padding: "2px 8px",
    marginRight: "6px",
    fontSize: "13px",
    fontWeight: "600",
  },
  owner: { color: "#888", fontSize: "13px", marginTop: "8px" },
  btn: {
    padding: "8px 16px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  viewBtn: {
    padding: "8px 16px",
    background: "#fff",
    color: "#4f46e5",
    border: "1px solid #4f46e5",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "14px",
  },
  msg: {
    background: "#e0f2fe",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "12px",
  },
  sectionHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" },
  sectionIcon: { color: "#4f46e5", fontSize: "18px" },
  sectionSub: { color: "#666", fontSize: "14px", marginBottom: "16px" },
};

export default Projects;
