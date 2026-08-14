
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { colors, shadow } from "../theme";
import ProfilePicture from "../components/ProfilePicture";

function EditProfile() {
  const [form, setForm] = useState({
    name: "",
    bio: "",
    skills: "",
    profilePicture: "",
  });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) =>
        setForm({
          name: res.data.name || "",
          bio: res.data.bio || "",
          skills: res.data.skills?.join(", ") || "",
          profilePicture: res.data.profilePicture || "",
        })
      );
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage("Image must be smaller than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        profilePicture: reader.result,
      }));
      setMessage("");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        "/api/users/profile",
        {
          ...form,
          skills: form.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Profile updated!");

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setMessage("Failed to update profile");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ color: colors.text }}>Edit Profile</h2>

      {message && <p style={styles.msg}>{message}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.photoSection}>
          <ProfilePicture
            name={form.name}
            image={form.profilePicture}
            size={110}
          />

          <label style={styles.uploadBtn} className="ss-btn-primary">
            Choose Profile Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </label>
          {form.profilePicture && (
          <button
          type="button"
          onClick={() =>
          setForm((prev) => ({
           ...prev,
          profilePicture: "",
          }))
          }
          style={styles.removeBtn}
            >
          Remove Photo
        </button>
       )}

          <p style={styles.photoHint}>JPG, PNG or other image · Max 2MB</p>
        </div>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          style={styles.input}
          className="ss-input"
        />

        <textarea
          placeholder="Bio"
          value={form.bio}
          onChange={(e) =>
            setForm({ ...form, bio: e.target.value })
          }
          style={styles.textarea}
          className="ss-input"
        />

        <input
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={(e) =>
            setForm({ ...form, skills: e.target.value })
          }
          style={styles.input}
          className="ss-input"
        />

        <button
          type="submit"
          style={styles.btn}
          className="ss-btn-primary"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "28px",
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    boxShadow: shadow.card,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "20px",
  },

  photoSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
  },

  uploadBtn: {
    padding: "9px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  removeBtn: {
  padding: "7px 14px",
  background: "transparent",
  color: colors.danger,
  border: `1px solid ${colors.danger}`,
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
},

  photoHint: {
    color: colors.textFaint,
    fontSize: "12px",
    margin: 0,
  },

  input: {
    padding: "10px 12px",
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    background: colors.surfaceAlt,
    color: colors.text,
  },

  textarea: {
    padding: "10px 12px",
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    background: colors.surfaceAlt,
    color: colors.text,
    height: "80px",
    resize: "vertical",
  },

  btn: {
    padding: "10px",
    background: colors.accent,
    color: "#0b0e14",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
  },

  msg: {
    color: colors.success,
    fontSize: "14px",
  },
};

export default EditProfile;