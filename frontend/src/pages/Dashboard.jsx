import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { colors, shadow } from "../theme";
import Spinner from "../components/Spinner";

const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1])).id;
  } catch {
    return null;
  }
};

function Dashboard() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const currentUserId = getUserId();

  useEffect(() => {
    axios.get("/api/users/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data));
  }, []);

  if (!user) return <Spinner label="Loading..." />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: 0, color: colors.text }}>Welcome, {user.name}</h2>
        {currentUserId && (
          <Link to={`/users/${currentUserId}`} style={styles.profileLink} className="ss-btn-outline">
            View My Profile
          </Link>
        )}
      </div>
      <p style={styles.email}>{user.email}</p>
      <p style={styles.row}><strong style={{ color: colors.text }}>Bio:</strong> <span style={styles.value}>{user.bio || "No bio yet"}</span></p>
      <p style={styles.row}><strong style={{ color: colors.text }}>Skills:</strong> <span style={styles.value}>{user.skills.length ? user.skills.join(", ") : "No skills added yet"}</span></p>
    </div>
  );
}

const styles = {
  loading: { padding: "24px", color: colors.textMuted },
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "28px",
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    boxShadow: shadow.card,
  },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" },
  email: { color: colors.textMuted, marginBottom: "16px" },
  row: { marginTop: "6px" },
  value: { color: colors.textMuted },
  profileLink: {
    fontSize: "14px",
    color: colors.accent,
    textDecoration: "none",
    border: `1px solid ${colors.border}`,
    padding: "6px 14px",
    borderRadius: "6px",
    fontWeight: "500",
  },
};

export default Dashboard;
