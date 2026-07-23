import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { colors, shadow } from "../theme";
import Spinner from "../components/Spinner";

function UserCard({ u, search }) {
  const query = search.trim().toLowerCase();

  return (
    <div style={styles.card} className="ss-card">
      <Link to={`/users/${u._id}`} style={styles.nameLink} className="ss-link">
        <h3 style={{ margin: "0 0 4px" }}>{u.name}</h3>
      </Link>
      <p style={styles.email}>{u.email}</p>
      {u.bio && <p style={styles.bio}>{u.bio}</p>}
      <p style={styles.skillsRow}>
        {u.skills.length
          ? u.skills.map((skill) => {
              const isMatch = query && skill.toLowerCase().includes(query);
              return (
                <span key={skill} style={isMatch ? styles.skillMatch : styles.skillTag}>
                  {skill}
                </span>
              );
            })
          : <span style={styles.noSkills}>No skills listed</span>}
      </p>
    </div>
  );
}

function Talent() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    axios
      .get("/api/users", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUsers(res.data))
      .catch(() => setError("Failed to load talent directory."))
      .finally(() => setLoading(false));
  }, []);

  if (!token) {
    return <p style={styles.notice}>Please log in to browse the talent directory.</p>;
  }

  if (loading) return <Spinner label="Loading..." />;

  const query = search.trim().toLowerCase();
  const filtered = query
    ? users.filter((u) => u.skills.some((s) => s.toLowerCase().includes(query)))
    : users;

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: "6px", color: colors.text }}>Talent Directory</h2>
      <p style={styles.sub}>Browse registered students and find teammates by skill.</p>

      <input
        placeholder="Search by skill (e.g. React)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
        className="ss-input"
      />

      {error && <p style={styles.error}>{error}</p>}

      {!error && filtered.length === 0 && (
        <p style={styles.empty}>
          {query ? `No one lists "${search}" as a skill yet.` : "No registered students yet."}
        </p>
      )}

      {filtered.map((u) => (
        <UserCard key={u._id} u={u} search={search} />
      ))}
    </div>
  );
}

const styles = {
  container: { maxWidth: "700px", margin: "40px auto", padding: "24px" },
  sub: { color: colors.textMuted, marginBottom: "16px" },
  search: {
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    background: colors.surfaceAlt,
    color: colors.text,
    marginBottom: "24px",
  },
  card: {
    background: colors.surface,
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "16px",
    border: `1px solid ${colors.border}`,
    borderLeft: `4px solid ${colors.accent}`,
    boxShadow: shadow.card,
  },
  nameLink: { textDecoration: "none", color: colors.text },
  email: { color: colors.textFaint, fontSize: "13px", marginBottom: "8px" },
  bio: { color: colors.textMuted, marginBottom: "8px" },
  skillsRow: { marginTop: "8px" },
  skillTag: {
    display: "inline-block",
    background: colors.surfaceAlt,
    color: colors.textMuted,
    border: `1px solid ${colors.border}`,
    borderRadius: "4px",
    padding: "2px 8px",
    marginRight: "6px",
    marginBottom: "6px",
    fontSize: "13px",
  },
  skillMatch: {
    display: "inline-block",
    background: colors.successMuted,
    color: colors.success,
    borderRadius: "4px",
    padding: "2px 8px",
    marginRight: "6px",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: "600",
  },
  noSkills: { color: colors.textFaint, fontSize: "13px" },
  notice: { padding: "40px", textAlign: "center", color: colors.textMuted },
  empty: { color: colors.textMuted, textAlign: "center", marginTop: "40px" },
  error: { color: colors.danger },
};

export default Talent;
