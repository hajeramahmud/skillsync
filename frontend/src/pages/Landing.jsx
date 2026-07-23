import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { colors, font, shadow } from "../theme";
import Icon from "../components/Icon";

const STEPS = [
  {
    icon: "user",
    title: "Build your profile",
    text: "List your skills and a short bio so teammates can find you.",
  },
  {
    icon: "folder",
    title: "Browse or post projects",
    text: "Join a project that needs your skills, or start your own and recruit a team.",
  },
  {
    icon: "barChart",
    title: "Get endorsed, climb the leaderboard",
    text: "Collect skill endorsements from teammates and track your standing on the leaderboard.",
  },
];

function Landing() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("/api/stats")
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div>
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

        {stats && (
          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <span style={styles.statNum}>{stats.totals.users}</span>
              <span style={styles.statLabel}>Students</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={styles.statNum}>{stats.totals.projects}</span>
              <span style={styles.statLabel}>Projects</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={styles.statNum}>{stats.topSkills.length}</span>
              <span style={styles.statLabel}>Skills in Demand</span>
            </div>
          </div>
        )}
      </div>

      <div style={styles.stepsSection}>
        <div style={styles.stepsGrid}>
          {STEPS.map((step, i) => (
            <div key={step.title} style={styles.stepCard} className="ss-card">
              <div style={styles.stepIconWrap}>
                <Icon name={step.icon} size={20} style={{ color: colors.accent }} />
              </div>
              <span style={styles.stepNum}>{`0${i + 1}`}</span>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepText}>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "120px 24px 60px", maxWidth: "720px", margin: "0 auto" },
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
  statsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "28px",
    marginTop: "64px",
  },
  statItem: { display: "flex", flexDirection: "column", alignItems: "center" },
  statNum: { fontSize: "28px", fontWeight: "700", color: colors.text, fontFamily: font.mono },
  statLabel: { fontSize: "12px", color: colors.textMuted, marginTop: "2px" },
  statDivider: { width: "1px", height: "32px", background: colors.border },
  stepsSection: { padding: "40px 24px 100px", maxWidth: "980px", margin: "0 auto" },
  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
  stepCard: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    padding: "24px",
    textAlign: "left",
    position: "relative",
  },
  stepIconWrap: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: colors.accentMuted,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  },
  stepNum: {
    position: "absolute",
    top: "20px",
    right: "20px",
    fontFamily: font.mono,
    fontSize: "12px",
    color: colors.textFaint,
  },
  stepTitle: { fontSize: "16px", color: colors.text, margin: "0 0 8px" },
  stepText: { fontSize: "14px", color: colors.textMuted, lineHeight: 1.5, margin: 0 },
};

export default Landing;
