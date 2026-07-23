import { colors } from "../theme";

const variants = {
  success: colors.success,
  error: colors.danger,
  info: colors.accent,
};

function Toast({ message, type = "info" }) {
  if (!message) return null;
  const accent = variants[type] || variants.info;

  return (
    <div className="ss-toast" style={{ ...styles.toast, borderColor: accent }}>
      <span style={{ ...styles.dot, background: accent }} />
      <span style={{ color: colors.text }}>{message}</span>
    </div>
  );
}

const styles = {
  toast: {
    position: "fixed",
    top: "24px",
    right: "24px",
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: colors.surface,
    border: "1px solid",
    borderRadius: "8px",
    padding: "14px 18px",
    boxShadow: "0 8px 28px rgba(0,0,0,0.5)",
    fontSize: "14px",
    fontWeight: "500",
    maxWidth: "340px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
};

export default Toast;
