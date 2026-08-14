
import { colors, shadow } from "../theme";

function TeamContribution({ projects = [], userId }) {
  if (projects.length === 0) {
    return (
      <div style={styles.card}>
        <h3 style={styles.title}>👥 Team Contributions</h3>
        <p style={styles.empty}>
          No team contributions yet.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>👥 Team Contributions</h3>

      <div style={styles.list}>
        {projects.map((project) => {
          const isOwner =
            project.owner?._id?.toString() === userId?.toString();

          return (
            <div key={project._id} style={styles.project}>
              <h4 style={styles.projectTitle}>
                {project.title}
              </h4>

              <span style={styles.role}>
                {isOwner ? "Project Owner" : "Team Member"}
              </span>

              {project.description && (
                <p style={styles.description}>
                  {project.description}
                </p>
              )}

              {project.skillsNeeded?.length > 0 && (
                <div style={styles.skills}>
                  {project.skillsNeeded.map((skill) => (
                    <span key={skill} style={styles.skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    padding: "24px",
    borderRadius: "10px",
    boxShadow: shadow.card,
    marginTop: "20px",
  },

  title: {
    margin: "0 0 18px",
    color: colors.text,
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  project: {
    padding: "16px",
    border: `1px solid ${colors.border}`,
    borderRadius: "8px",
    background: colors.surfaceAlt,
  },

  projectTitle: {
    margin: "0 0 6px",
    color: colors.text,
    fontSize: "16px",
  },

  role: {
    display: "inline-block",
    padding: "4px 9px",
    borderRadius: "999px",
    background: colors.accentMuted,
    color: colors.accentHover,
    fontSize: "12px",
    fontWeight: "600",
  },

  description: {
    color: colors.textMuted,
    fontSize: "13px",
    lineHeight: "1.5",
    margin: "12px 0",
  },

  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },

  skill: {
    padding: "4px 9px",
    borderRadius: "999px",
    background: colors.accentMuted,
    color: colors.accentHover,
    fontSize: "12px",
  },

  empty: {
    color: colors.textMuted,
    fontSize: "14px",
    margin: 0,
  },
};

export default TeamContribution;