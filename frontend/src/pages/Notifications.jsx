import { useEffect, useState, useRef } from "react";
import axios from "axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
  const intervalRef = useRef(null);

  const fetchNotifications = () => {
    axios
      .get("/api/notifications", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setNotifications(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
    intervalRef.current = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const markRead = async () => {
    await axios.put("/api/notifications/read", {}, { headers: { Authorization: `Bearer ${token}` } });
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Notifications</h2>
        {notifications.length > 0 && <button onClick={markRead} style={styles.btn}>Mark all as read</button>}
      </div>
      {notifications.length === 0 && <p>No notifications yet.</p>}
      {notifications.map((n) => (
        <div key={n._id} style={{ ...styles.card, background: n.read ? "#fff" : "#f0f0ff" }}>
          <p>{n.message}</p>
          <p style={styles.time}>{new Date(n.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "40px auto", padding: "24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  card: { padding: "16px", borderRadius: "8px", marginBottom: "10px", border: "1px solid #ddd" },
  time: { color: "#888", fontSize: "12px", marginTop: "6px" },
  btn: { padding: "6px 14px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "4px" },
};

export default Notifications;
