import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>SkillSync</Link>
      <div style={styles.links}>
        <Link to="/projects" style={styles.link}>Projects</Link>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
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
  btn: { background: "none", border: "1px solid #ccc", padding: "6px 12px", borderRadius: "4px" },
};

export default Navbar;
