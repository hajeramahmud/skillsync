import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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

  if (!user) return <p style={{ padding: "24px" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>Welcome, {user.name}</h2>
        {currentUserId && (
          <Link to={`/users/${currentUserId}`} style={styles.profileLink}>
            View My Profile
          </Link>
        )}
      </div>
      <p style={styles.email}>{user.email}</p>
      <p><strong>Bio:</strong> {user.bio || "No bio yet"}</p>
      <p><strong>Skills:</strong> {user.skills.length ? user.skills.join(", ") : "No skills added yet"}</p>
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "40px auto", padding: "24px", background: "#fff", borderRadius: "8px" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" },
  email: { color: "#888", marginBottom: "16px" },
  profileLink: {
    fontSize: "14px",
    color: "#4f46e5",
    textDecoration: "none",
    background: "#eef2ff",
    padding: "6px 14px",
    borderRadius: "6px",
    fontWeight: "500",
  },
};

export default Dashboard;
