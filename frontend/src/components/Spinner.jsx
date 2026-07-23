import { colors } from "../theme";

function Spinner({ size = 28, label }) {
  return (
    <div style={styles.container}>
      <svg width={size} height={size} viewBox="0 0 24 24" className="ss-spinner">
        <circle cx="12" cy="12" r="9" fill="none" stroke={colors.border} strokeWidth="3" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          fill="none"
          stroke={colors.accent}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {label && <span style={styles.label}>{label}</span>}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "48px 24px",
    color: colors.textMuted,
  },
  label: { fontSize: "13px" },
};

export default Spinner;
