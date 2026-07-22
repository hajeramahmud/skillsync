import { Link } from "react-router-dom";
import { colors, font, shadow } from "../theme";

function Landing() {
  return (
    <div style={styles.container}>
      <span style={styles.eyebrow}>
        <span style={{ color: colors.accent }}>$</span> find-your-team --skills=all
      </span>
      <h1 style={styles.heading}>
        Find Your Team.<br />
        <span style={styles.gradientText}>Build Something Great.</span>
      </h1>
      <p style={styles.sub}>
        SkillSync connects students with the right people to build real projects.
      </p>
      <div style={styles.buttons}>
        <Link to="/register" style={styles.primary} className="ss-btn-primary">
          Get Started
        </Link>
        <Link to="/projects" style={styles.secondary} className="ss-btn-outline">
          Browse Projects
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "120px 24px 100px", maxWidth: "720px", margin: "0 auto" },
  eyebrow: {
    display: "inline-block",
    fontFamily: font.mono,
    fontSize: "13px",
    color: colors.textMuted,
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    padding: "6px 14px",
    borderRadius: "999px",
    marginBottom: "28px",
  },
  heading: { fontSize: "44px", lineHeight: 1.2, fontWeight: 700, color: colors.text, letterSpacing: "-0.02em" },
  gradientText: {
    background: `linear-gradient(90deg, ${colors.accent}, ${colors.cyan})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  sub: { color: colors.textMuted, fontSize: "17px", marginTop: "20px" },
  buttons: { display: "flex", gap: "16px", justifyContent: "center", marginTop: "36px" },
  primary: {
    background: colors.accent,
    color: "#0b0e14",
    padding: "13px 26px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    boxShadow: shadow.card,
  },
  secondary: {
    background: "transparent",
    color: colors.text,
    padding: "13px 26px",
    borderRadius: "8px",
    border: `1px solid ${colors.border}`,
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Landing;
