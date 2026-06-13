import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/register", form);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={styles.input} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={styles.input} />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={styles.input} />
        <button type="submit" style={styles.btn}>Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

const styles = {
  container: { maxWidth: "400px", margin: "60px auto", padding: "24px", background: "#fff", borderRadius: "8px" },
  form: { display: "flex", flexDirection: "column", gap: "12px", margin: "20px 0" },
  input: { padding: "10px", border: "1px solid #ddd", borderRadius: "4px" },
  btn: { padding: "10px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "4px" },
  error: { color: "red", marginBottom: "10px" },
};

export default Register;
