import { Link } from "react-router-dom";

function Landing() {
  return (
    <div style={styles.container}>
      <h1>Find Your Team. Build Something Great.</h1>
      <p>SkillSync connects students with the right people to build real projects.</p>
      <div style={styles.buttons}>
        <Link to="/register" style={styles.primary}>Get Started</Link>
        <Link to="/projects" style={styles.secondary}>Browse Projects</Link>
      </div>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "80px 24px" },
  buttons: { display: "flex", gap: "16px", justifyContent: "center", marginTop: "32px" },
  primary: { background: "#4f46e5", color: "#fff", padding: "12px 24px", borderRadius: "6px", textDecoration: "none" },
  secondary: { background: "#fff", color: "#4f46e5", padding: "12px 24px", borderRadius: "6px", border: "1px solid #4f46e5", textDecoration: "none" },
};

export default Landing;
