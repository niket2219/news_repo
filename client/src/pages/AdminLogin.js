import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) navigate("/admin");
  }, [authLoading, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      login(data);
      toast.success("Welcome back!");
      navigate("/admin");
    } catch {
      toast.error("Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoHi}>हम है ना</div>
        <div style={s.logoEn}>HAM HAI NA</div>
        <h2 style={s.heading}>Sign In</h2>
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              style={s.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@yourchannel.com"
              required
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              style={s.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f1115 0%, #1b2b2a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "48px 40px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
  logoHi: {
    fontFamily: "Noto Serif Devanagari, serif",
    fontSize: 32,
    fontWeight: 700,
    color: "#ff6a3d",
  },
  logoEn: { fontSize: 11, letterSpacing: 4, color: "#888", marginBottom: 24 },
  heading: {
    fontFamily: "Playfair Display, serif",
    fontSize: 22,
    marginBottom: 28,
    color: "#111",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    textAlign: "left",
  },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: "#555" },
  input: {
    padding: "12px 16px",
    borderRadius: 8,
    border: "1.5px solid #ddd",
    fontSize: 14,
    outline: "none",
    transition: "border 0.2s",
  },
  btn: {
    padding: "14px",
    borderRadius: 8,
    background: "#ff6a3d",
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    marginTop: 8,
    transition: "background 0.2s",
  },
};
