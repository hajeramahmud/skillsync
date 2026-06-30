import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [unread, setUnread] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!token) {
      setUnread(0);
      return;
    }

    const fetchUnread = () => {
      axios
        .get("/api/notifications", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUnread(res.data.filter((n) => !n.read).length))
        .catch(() => {});
    };

    fetchUnread();
    intervalRef.current = setInterval(fetchUnread, 30000);
    return () => clearInterval(intervalRef.current);
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    setUnread(0);
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>SkillSync</Link>
      <div style={styles.links}>
        <Link to="/projects" style={styles.link}>Projects</Link>
        <Link to="/stats" style={styles.link}>Leaderboard</Link>
        {token ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/create-project" style={styles.link}>+ New Project</Link>
            <Link to="/manage-applications" style={styles.link}>My Applicants</Link>
            <Link to="/notifications" style={styles.notifLink}>
              Notifications
              {unread > 0 && <span style={styles.badge}>{unread}</span>}
            </Link>
            <Link to="/edit-profile" style={styles.link}>Edit Profile</Link>
            <button onClick={logout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", background: "#fff", borderBottom: "1px solid #ddd" },
  logo: { fontWeight: "bold", fontSize: "20px", textDecoration: "none", color: "#4f46e5" },
  links: { display: "flex", gap: "16px", alignItems: "center" },
  link: { textDecoration: "none", color: "#333" },
  notifLink: { textDecoration: "none", color: "#333", position: "relative", display: "inline-flex", alignItems: "center", gap: "4px" },
  badge: { background: "#dc2626", color: "#fff", borderRadius: "999px", fontSize: "11px", fontWeight: "bold", padding: "1px 6px", minWidth: "18px", textAlign: "center" },
  btn: { background: "none", border: "1px solid #ccc", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" },
};

export default Navbar;
