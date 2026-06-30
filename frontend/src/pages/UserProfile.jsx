import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1])).id;
  } catch {
    return null;
  }
};

function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [endorsements, setEndorsements] = useState({});
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");
  const currentUserId = getUserId();
  const isOwnProfile = currentUserId === userId;

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, endorseRes] = await Promise.all([
          axios.get(`/api/users/${userId}`),
          axios.get(`/api/users/${userId}/endorsements`),
        ]);
        setProfile(profileRes.data);
        setEndorsements(endorseRes.data);
      } catch {
        setProfile(null);
      }
      setLoading(false);
    };
    load();
  }, [userId]);

  const endorse = async (skill) => {
    try {
      await axios.post(
        `/api/users/${userId}/endorse`,
        { skill },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEndorsements((prev) => ({
        ...prev,
        [skill]: {
          count: (prev[skill]?.count || 0) + 1,
          endorserIds: [...(prev[skill]?.endorserIds || []), currentUserId],
        },
      }));
      flash("Endorsed!");
    } catch (err) {
      flash(err.response?.data?.message || "Failed to endorse");
    }
  };

  const removeEndorse = async (skill) => {
    try {
      await axios.delete(`/api/users/${userId}/endorse`, {
        data: { skill },
        headers: { Authorization: `Bearer ${token}` },
      });
      setEndorsements((prev) => ({
        ...prev,
        [skill]: {
          count: Math.max((prev[skill]?.count || 1) - 1, 0),
          endorserIds: (prev[skill]?.endorserIds || []).filter(
            (id) => id !== currentUserId
          ),
        },
      }));
      flash("Endorsement removed");
    } catch {
      flash("Failed to remove endorsement");
    }
  };

  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2500);
  };

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;
  if (!profile) return <p style={{ padding: "40px" }}>User not found.</p>;

  return (
    <div style={styles.container}>
      {msg && <div style={styles.toast}>{msg}</div>}

      <div style={styles.card}>
        <div style={styles.avatar}>{profile.name.charAt(0).toUpperCase()}</div>
        <h2 style={{ margin: "0 0 4px" }}>{profile.name}</h2>
        <p style={styles.email}>{profile.email}</p>
        <p style={styles.bio}>{profile.bio || "No bio added yet."}</p>

        {isOwnProfile && (
          <p style={styles.ownNote}>This is your profile. Others can endorse your skills.</p>
        )}
      </div>

      <div style={styles.skillsCard}>
        <h3 style={styles.sectionTitle}>Skills & Endorsements</h3>

        {profile.skills.length === 0 ? (
          <p style={{ color: "#888" }}>No skills listed.</p>
        ) : (
          profile.skills.map((skill) => {
            const data = endorsements[skill] || { count: 0, endorserIds: [] };
            const hasEndorsed = data.endorserIds.includes(currentUserId);

            return (
              <div key={skill} style={styles.skillRow}>
                <div style={styles.skillLeft}>
                  <span style={styles.skillBadge}>{skill}</span>
                  {data.count > 0 && (
                    <span style={styles.endorseCount}>
                      +{data.count} endorsement{data.count !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {token && !isOwnProfile && (
                  hasEndorsed ? (
                    <button onClick={() => removeEndorse(skill)} style={styles.endorsedBtn}>
                      ✓ Endorsed
                    </button>
                  ) : (
                    <button onClick={() => endorse(skill)} style={styles.endorseBtn}>
                      + Endorse
                    </button>
                  )
                )}
              </div>
            );
          })
        )}

        {!token && (
          <p style={{ color: "#888", fontSize: "13px", marginTop: "12px" }}>
            Log in to endorse skills.
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "620px", margin: "40px auto", padding: "0 24px 60px" },
  toast: {
    background: "#4f46e5",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  card: {
    background: "#fff",
    padding: "32px 24px",
    borderRadius: "10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    textAlign: "center",
    marginBottom: "20px",
  },
  avatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "#4f46e5",
    color: "#fff",
    fontSize: "32px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  email: { color: "#888", fontSize: "14px", margin: "0 0 12px" },
  bio: { color: "#555", fontSize: "15px" },
  ownNote: {
    marginTop: "12px",
    padding: "8px 12px",
    background: "#eef2ff",
    borderRadius: "6px",
    color: "#4f46e5",
    fontSize: "13px",
  },
  skillsCard: {
    background: "#fff",
    padding: "24px",
    borderRadius: "10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
  },
  sectionTitle: { margin: "0 0 16px", color: "#333" },
  skillRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #f3f4f6",
  },
  skillLeft: { display: "flex", alignItems: "center", gap: "10px" },
  skillBadge: {
    background: "#eef2ff",
    color: "#4f46e5",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "600",
  },
  endorseCount: { color: "#16a34a", fontSize: "13px", fontWeight: "500" },
  endorseBtn: {
    padding: "5px 14px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  endorsedBtn: {
    padding: "5px 14px",
    background: "#dcfce7",
    color: "#16a34a",
    border: "1px solid #16a34a",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
};

export default UserProfile;
