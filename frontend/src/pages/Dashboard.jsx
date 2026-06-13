import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("/api/users/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data));
  }, []);

  if (!user) return <p style={{ padding: "24px" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2>Welcome, {user.name}</h2>
      <p style={styles.email}>{user.email}</p>
      <p><strong>Bio:</strong> {user.bio || "No bio yet"}</p>
      <p><strong>Skills:</strong> {user.skills.length ? user.skills.join(", ") : "No skills added yet"}</p>
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "40px auto", padding: "24px", background: "#fff", borderRadius: "8px" },
  email: { color: "#888", marginBottom: "16px" },
};

export default Dashboard;
