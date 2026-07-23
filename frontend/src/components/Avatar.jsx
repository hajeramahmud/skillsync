import { colors } from "../theme";

function Avatar({ name, size = 36 }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: colors.accent,
        color: "#0b0e14",
        fontSize: Math.round(size * 0.45),
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}

export default Avatar;
