import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { colors, font } from "../theme";
import Icon from "./Icon";
import Avatar from "./Avatar";

const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1])).id;
  } catch {
    return null;
  }
};

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUserId = getUserId();
  const [unread, setUnread] = useState(0);
  const [userName, setUserName] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!token) {
      setUnread(0);
      setUserName("");
      return;
    }

    axios
      .get("/api/users/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUserName(res.data.name))
      .catch(() => {});

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
      <Link to="/" style={styles.logo}>
        <span style={styles.logoPrompt}>&gt;</span>SkillSync
      </Link>
      <div style={styles.links}>
        <Link to="/projects" style={styles.link} className="ss-navlink">
          <Icon name="folder" size={15} /> Projects
        </Link>
        <Link to="/stats" style={styles.link} className="ss-navlink">
          <Icon name="barChart" size={15} /> Leaderboard
        </Link>
        {token ? (
          <>
            <Link to="/dashboard" style={styles.link} className="ss-navlink">
              <Icon name="home" size={15} /> Dashboard
            </Link>
            <Link to="/talent" style={styles.link} className="ss-navlink">
              <Icon name="user" size={15} /> Talent
            </Link>
            <Link to="/create-project" style={styles.link} className="ss-navlink">
              <Icon name="plusCircle" size={15} /> New Project
            </Link>
            <Link to="/manage-applications" style={styles.link} className="ss-navlink">
              <Icon name="clipboard" size={15} /> My Applicants
            </Link>
            <Link to="/notifications" style={styles.notifLink} className="ss-navlink">
              <Icon name="bell" size={15} /> Notifications
              {unread > 0 && <span style={styles.badge}>{unread}</span>}
            </Link>
            <Link to="/edit-profile" style={styles.link} className="ss-navlink">
              <Icon name="edit" size={15} /> Edit Profile
            </Link>
            {currentUserId && userName && (
              <Link to={`/users/${currentUserId}`} title={userName}>
                <Avatar name={userName} size={30} />
              </Link>
            )}
            <button onClick={logout} style={styles.btn} className="ss-btn-outline">
              <Icon name="logOut" size={15} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link} className="ss-navlink">
              <Icon name="logIn" size={15} /> Login
            </Link>
            <Link to="/register" style={styles.link} className="ss-navlink">
              <Icon name="userPlus" size={15} /> Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 28px",
    background: "rgba(20, 25, 34, 0.85)",
    backdropFilter: "blur(8px)",
    borderBottom: `1px solid ${colors.border}`,
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  logo: {
    fontWeight: "700",
    fontSize: "19px",
    textDecoration: "none",
    color: colors.text,
    fontFamily: font.mono,
    letterSpacing: "-0.02em",
  },
  logoPrompt: { color: colors.accent, marginRight: "2px" },
  links: { display: "flex", gap: "20px", alignItems: "center" },
  link: {
    textDecoration: "none",
    color: colors.textMuted,
    fontSize: "14px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
  notifLink: {
    textDecoration: "none",
    color: colors.textMuted,
    fontSize: "14px",
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
  badge: {
    background: colors.danger,
    color: "#1a0d0d",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "bold",
    padding: "1px 6px",
    minWidth: "18px",
    textAlign: "center",
  },
  btn: {
    background: "none",
    border: `1px solid ${colors.border}`,
    color: colors.textMuted,
    padding: "6px 14px",
    borderRadius: "6px",
    fontSize: "14px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
};

export default Navbar;
