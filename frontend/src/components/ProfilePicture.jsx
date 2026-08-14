
import { colors } from "../theme";

function ProfilePicture({ name, image, size = 96 }) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        overflow: "hidden",
        background: colors.accentMuted,
        color: colors.accentHover,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: `${size * 0.4}px`,
        fontWeight: "700",
        border: `3px solid ${colors.border}`,
      }}
    >
      {image ? (
        <img
          src={image}
          alt={`${name || "User"} profile`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        initial
      )}
    </div>
  );
}

export default ProfilePicture;