import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { colors, shadow } from "../theme";

const getMatchPercent = (userSkills, skillsNeeded) => {
  if (!skillsNeeded.length) return 100;
  const lower = userSkills.map((s) => s.toLowerCase());
  const matched = skillsNeeded.filter((s) => lower.includes(s.toLowerCase()));
  return Math.round((matched.length / skillsNeeded.length) * 100);
};

const badgeStyle = (pct) => {
  const bg = pct >= 75 ? colors.success : pct >= 40 ? colors.warning : colors.textFaint;
  return {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "999px",
    background: bg,
    color: "#0b0e14",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "8px",
  };
};

function ProjectCard({ p, userSkills, token, onApply }) {
  const pct = userSkills ? getMatchPercent(userSkills, p.skillsNeeded) : null;

  return (
    <div style={styles.card} className="ss-card">
      {pct !== null && (
        <span style={badgeStyle(pct)}>
          {pct === 100 && p.skillsNeeded.length === 0 ? "Open to All" : `${pct}% Match`}
        </span>
      )}
      <h3 style={{ margin: "4px 0 8px", color: colors.text }}>{p.title}</h3>
      <p style={{ color: colors.textMuted, marginBottom: "8px" }}>{p.description}</p>
      <p style={styles.skills}>
        <strong style={{ color: colors.text }}>Skills needed:</strong>{" "}
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
        <Link to={`/projects/${p._id}`} style={styles.viewBtn} className="ss-btn-outline">View Details</Link>
        {token && (
          <button onClick={() => onApply(p._id)} style={styles.btn} className="ss-btn-primary">
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
  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
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

  const allSkills = [...new Set(projects.flatMap((p) => p.skillsNeeded))].sort((a, b) =>
    a.localeCompare(b)
  );

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedSkills([]);
  };

  const query = search.trim().toLowerCase();
  const selectedLower = selectedSkills.map((s) => s.toLowerCase());

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !query ||
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.skillsNeeded.some((s) => s.toLowerCase().includes(query));

    const matchesSkills =
      selectedLower.length === 0 ||
      p.skillsNeeded.some((s) => selectedLower.includes(s.toLowerCase()));

    return matchesSearch && matchesSkills;
  });

  const hasActiveFilters = query.length > 0 || selectedSkills.length > 0;

  const recommended =
    userSkills && userSkills.length > 0
      ? filteredProjects
          .map((p) => ({ ...p, pct: getMatchPercent(userSkills, p.skillsNeeded) }))
          .filter((p) => p.pct > 0)
          .sort((a, b) => b.pct - a.pct)
      : [];

  return (
    <div style={styles.container}>
      {message && <p style={styles.msg}>{message}</p>}

      <div style={styles.filterBar}>
        <input
          placeholder="Search projects by title, description, or skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
          className="ss-input"
        />

        {allSkills.length > 0 && (
          <div style={styles.chipRow}>
            {allSkills.map((skill) => {
              const active = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  style={active ? styles.chipActive : styles.chip}
                  className="ss-chip"
                >
                  {skill}
                </button>
              );
            })}
          </div>
        )}

        {hasActiveFilters && (
          <button onClick={clearFilters} style={styles.clearBtn} className="ss-btn-outline">
            Clear filters
          </button>
        )}
      </div>

      {recommended.length > 0 && (
        <section style={{ marginBottom: "40px" }}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>✦</span>
            <h2 style={{ margin: 0, color: colors.text }}>Recommended for You</h2>
          </div>
          <p style={styles.sectionSub}>
            Based on your skills: <strong style={{ color: colors.text }}>{userSkills.join(", ")}</strong>
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
        <h2 style={{ marginBottom: "16px", color: colors.text }}>All Projects</h2>
        {projects.length === 0 && <p style={styles.emptyText}>No projects yet.</p>}
        {projects.length > 0 && filteredProjects.length === 0 && (
          <p style={styles.emptyText}>No projects match your filters.</p>
        )}
        {filteredProjects.map((p) => (
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
    background: colors.surface,
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "16px",
    border: `1px solid ${colors.border}`,
    borderLeft: `4px solid ${colors.accent}`,
    boxShadow: shadow.card,
  },
  skills: { color: colors.textMuted, marginTop: "8px", marginBottom: "4px" },
  skillTag: {
    display: "inline-block",
    background: colors.surfaceAlt,
    color: colors.textMuted,
    border: `1px solid ${colors.border}`,
    borderRadius: "4px",
    padding: "2px 8px",
    marginRight: "6px",
    fontSize: "13px",
  },
  skillMatch: {
    display: "inline-block",
    background: colors.successMuted,
    color: colors.success,
    borderRadius: "4px",
    padding: "2px 8px",
    marginRight: "6px",
    fontSize: "13px",
    fontWeight: "600",
  },
  owner: { color: colors.textFaint, fontSize: "13px", marginTop: "8px" },
  emptyText: { color: colors.textMuted },
  btn: {
    padding: "8px 16px",
    background: colors.accent,
    color: "#0b0e14",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
  },
  viewBtn: {
    padding: "8px 16px",
    background: "transparent",
    color: colors.text,
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "14px",
  },
  msg: {
    background: colors.accentMuted,
    color: colors.accent,
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "12px",
  },
  filterBar: { marginBottom: "32px" },
  search: {
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    background: colors.surfaceAlt,
    color: colors.text,
    marginBottom: "12px",
  },
  chipRow: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" },
  chip: {
    padding: "5px 14px",
    borderRadius: "999px",
    border: `1px solid ${colors.border}`,
    background: colors.surface,
    color: colors.textMuted,
    fontSize: "13px",
  },
  chipActive: {
    padding: "5px 14px",
    borderRadius: "999px",
    border: `1px solid ${colors.accent}`,
    background: colors.accentMuted,
    color: colors.accentHover,
    fontSize: "13px",
    fontWeight: "600",
  },
  clearBtn: {
    padding: "5px 14px",
    background: "transparent",
    border: `1px solid ${colors.border}`,
    color: colors.textMuted,
    borderRadius: "6px",
    fontSize: "13px",
  },
  sectionHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" },
  sectionIcon: { color: colors.accent, fontSize: "18px" },
  sectionSub: { color: colors.textMuted, fontSize: "14px", marginBottom: "16px" },
};

export default Projects;
