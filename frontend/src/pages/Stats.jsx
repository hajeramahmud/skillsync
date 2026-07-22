import { useState, useEffect } from "react";
import axios from "axios";
import { colors, shadow } from "../theme";

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/stats")
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={styles.loading}>Loading stats...</p>;
  if (!stats) return <p style={styles.loading}>Failed to load stats.</p>;

  const maxSkillCount = stats.topSkills[0]?.count || 1;

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>SkillSync Leaderboard</h2>
      <p style={styles.subtitle}>Live stats from the SkillSync community</p>

      <div style={styles.totalsRow}>
        <div style={styles.totalCard}>
          <span style={styles.totalNum}>{stats.totals.users}</span>
          <span style={styles.totalLabel}>Total Members</span>
        </div>
        <div style={styles.totalCard}>
          <span style={styles.totalNum}>{stats.totals.projects}</span>
          <span style={styles.totalLabel}>Total Projects</span>
        </div>
        <div style={styles.totalCard}>
          <span style={styles.totalNum}>{stats.topSkills.length}</span>
          <span style={styles.totalLabel}>Unique Skills in Demand</span>
        </div>
      </div>

      <div style={styles.grid}>
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Most In-Demand Skills</h3>
          {stats.topSkills.length === 0 && <p style={styles.empty}>No data yet.</p>}
          {stats.topSkills.map((item, i) => (
            <div key={item.skill} style={styles.skillRow}>
              <div style={styles.skillRank}>#{i + 1}</div>
              <div style={styles.skillBarWrap}>
                <div style={styles.skillNameRow}>
                  <span style={styles.skillName}>{item.skill}</span>
                  <span style={styles.skillCount}>{item.count} project{item.count !== 1 ? "s" : ""}</span>
                </div>
                <div style={styles.barBg}>
                  <div
                    style={{
                      ...styles.barFill,
                      width: `${(item.count / maxSkillCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        <div style={styles.rightCol}>
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Top Projects by Team Size</h3>
            {stats.topProjects.length === 0 && (
              <p style={styles.empty}>No projects with members yet.</p>
            )}
            {stats.topProjects.map((p, i) => (
              <div key={p._id} style={styles.listCard}>
                <div style={styles.listRank}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <p style={styles.listTitle}>{p.title}</p>
                  <p style={styles.listMeta}>
                    by {p.ownerName} · {p.memberCount} member{p.memberCount !== 1 ? "s" : ""}
                  </p>
                  {p.skillsNeeded?.length > 0 && (
                    <div style={styles.tagRow}>
                      {p.skillsNeeded.slice(0, 3).map((s) => (
                        <span key={s} style={styles.tag}>{s}</span>
                      ))}
                      {p.skillsNeeded.length > 3 && (
                        <span style={styles.tag}>+{p.skillsNeeded.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Most Active Members</h3>
            {stats.topMembers.length === 0 && (
              <p style={styles.empty}>No active members yet.</p>
            )}
            {stats.topMembers.map((m, i) => (
              <div key={m._id} style={styles.listCard}>
                <div style={styles.memberAvatar}>
                  {m.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={styles.listTitle}>{m.name || "Unknown"}</p>
                  <p style={styles.listMeta}>
                    {m.projectCount} project{m.projectCount !== 1 ? "s" : ""} joined
                  </p>
                  {m.skills?.length > 0 && (
                    <div style={styles.tagRow}>
                      {m.skills.slice(0, 3).map((s) => (
                        <span key={s} style={styles.tag}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>
                <span style={styles.rankBadge}>#{i + 1}</span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

const styles = {
  loading: { padding: "40px", color: colors.textMuted },
  container: { maxWidth: "960px", margin: "40px auto", padding: "0 24px 60px" },
  pageTitle: { margin: "0 0 4px", fontSize: "28px", color: colors.text },
  subtitle: { color: colors.textMuted, marginBottom: "28px" },
  totalsRow: { display: "flex", gap: "16px", marginBottom: "32px" },
  totalCard: {
    flex: 1,
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderTop: `3px solid ${colors.accent}`,
    color: colors.text,
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: shadow.card,
  },
  totalNum: { fontSize: "36px", fontWeight: "bold", color: colors.accent },
  totalLabel: { fontSize: "13px", color: colors.textMuted, marginTop: "4px" },
  grid: { display: "flex", gap: "24px", alignItems: "flex-start" },
  rightCol: { flex: 1, display: "flex", flexDirection: "column", gap: "24px" },
  section: {
    flex: 1,
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: "10px",
    padding: "20px 24px",
    boxShadow: shadow.card,
  },
  sectionTitle: { margin: "0 0 16px", fontSize: "16px", color: colors.text },
  empty: { color: colors.textFaint, fontSize: "14px" },
  skillRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" },
  skillRank: { color: colors.textFaint, fontSize: "13px", width: "24px", textAlign: "right" },
  skillBarWrap: { flex: 1 },
  skillNameRow: { display: "flex", justifyContent: "space-between", marginBottom: "4px" },
  skillName: { fontWeight: "500", fontSize: "14px", color: colors.text },
  skillCount: { color: colors.textMuted, fontSize: "12px" },
  barBg: { background: colors.surfaceAlt, borderRadius: "999px", height: "8px" },
  barFill: { background: colors.accent, borderRadius: "999px", height: "8px", transition: "width 0.4s ease" },
  listCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "12px 0",
    borderBottom: `1px solid ${colors.border}`,
  },
  listRank: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: colors.accentMuted,
    color: colors.accentHover,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "13px",
    flexShrink: 0,
  },
  memberAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: colors.accent,
    color: "#0b0e14",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "15px",
    flexShrink: 0,
  },
  listTitle: { margin: "0 0 2px", fontWeight: "600", fontSize: "14px", color: colors.text },
  listMeta: { margin: "0 0 6px", color: colors.textMuted, fontSize: "12px" },
  tagRow: { display: "flex", gap: "4px", flexWrap: "wrap" },
  tag: {
    background: colors.surfaceAlt,
    color: colors.textMuted,
    border: `1px solid ${colors.border}`,
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "11px",
  },
  rankBadge: {
    color: colors.textFaint,
    fontSize: "12px",
    fontWeight: "600",
    marginLeft: "auto",
    flexShrink: 0,
  },
};

export default Stats;
