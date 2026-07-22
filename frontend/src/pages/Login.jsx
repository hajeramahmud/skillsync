import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { colors, shadow } from "../theme";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/login", form);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={styles.input}
          className="ss-input"
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={styles.input}
          className="ss-input"
        />
        <button type="submit" style={styles.btn} className="ss-btn-primary">Login</button>
      </form>
      <p style={styles.footerText}>
        Don't have an account? <Link to="/register" style={styles.link} className="ss-link">Register</Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "60px auto",
    padding: "32px",
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    boxShadow: shadow.card,
  },
  heading: { color: colors.text },
  form: { display: "flex", flexDirection: "column", gap: "12px", margin: "20px 0" },
  input: {
    padding: "10px 12px",
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    background: colors.surfaceAlt,
    color: colors.text,
  },
  btn: {
    padding: "10px",
    background: colors.accent,
    color: "#0b0e14",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
  },
  error: { color: colors.danger, marginBottom: "10px", fontSize: "14px" },
  footerText: { color: colors.textMuted, fontSize: "14px" },
  link: { color: colors.accent, textDecoration: "none" },
};

export default Login;
