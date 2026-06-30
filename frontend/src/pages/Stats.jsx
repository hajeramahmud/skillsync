import { useState, useEffect } from "react";
import axios from "axios";

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/stats")
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: "40px" }}>Loading stats...</p>;
  if (!stats) return <p style={{ padding: "40px" }}>Failed to load stats.</p>;

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
  container: { maxWidth: "960px", margin: "40px auto", padding: "0 24px 60px" },
  pageTitle: { margin: "0 0 4px", fontSize: "28px", color: "#1f2937" },
  subtitle: { color: "#6b7280", marginBottom: "28px" },
  totalsRow: { display: "flex", gap: "16px", marginBottom: "32px" },
  totalCard: {
    flex: 1,
    background: "#4f46e5",
    color: "#fff",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  totalNum: { fontSize: "36px", fontWeight: "bold" },
  totalLabel: { fontSize: "13px", opacity: 0.85, marginTop: "4px" },
  grid: { display: "flex", gap: "24px", alignItems: "flex-start" },
  rightCol: { flex: 1, display: "flex", flexDirection: "column", gap: "24px" },
  section: {
    flex: 1,
    background: "#fff",
    borderRadius: "10px",
    padding: "20px 24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
  },
  sectionTitle: { margin: "0 0 16px", fontSize: "16px", color: "#111827" },
  empty: { color: "#9ca3af", fontSize: "14px" },
  skillRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" },
  skillRank: { color: "#9ca3af", fontSize: "13px", width: "24px", textAlign: "right" },
  skillBarWrap: { flex: 1 },
  skillNameRow: { display: "flex", justifyContent: "space-between", marginBottom: "4px" },
  skillName: { fontWeight: "500", fontSize: "14px", color: "#1f2937" },
  skillCount: { color: "#6b7280", fontSize: "12px" },
  barBg: { background: "#f3f4f6", borderRadius: "999px", height: "8px" },
  barFill: { background: "#4f46e5", borderRadius: "999px", height: "8px", transition: "width 0.4s ease" },
  listCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "12px 0",
    borderBottom: "1px solid #f3f4f6",
  },
  listRank: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#eef2ff",
    color: "#4f46e5",
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
    background: "#4f46e5",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "15px",
    flexShrink: 0,
  },
  listTitle: { margin: "0 0 2px", fontWeight: "600", fontSize: "14px" },
  listMeta: { margin: "0 0 6px", color: "#6b7280", fontSize: "12px" },
  tagRow: { display: "flex", gap: "4px", flexWrap: "wrap" },
  tag: {
    background: "#f3f4f6",
    color: "#374151",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "11px",
  },
  rankBadge: {
    color: "#9ca3af",
    fontSize: "12px",
    fontWeight: "600",
    marginLeft: "auto",
    flexShrink: 0,
  },
};

export default Stats;
