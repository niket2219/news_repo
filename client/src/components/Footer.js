import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        <div style={s.brand}>
          <div style={s.logoHi}>समाचार</div>
          <div style={s.logoEn}>NEWS CHANNEL</div>
          <p style={s.tagline}>Your trusted source for Hindi & English news</p>
        </div>
        <div style={s.links}>
          <h4 style={s.heading}>Categories</h4>
          {[
            "Politics",
            "Sports",
            "Technology",
            "Entertainment",
            "Business",
          ].map((c) => (
            <Link key={c} to={`/category/${c}`} style={s.link}>
              {c}
            </Link>
          ))}
        </div>
        <div style={s.links}>
          <h4 style={s.heading}>More</h4>
          {["World", "Health", "Local"].map((c) => (
            <Link key={c} to={`/category/${c}`} style={s.link}>
              {c}
            </Link>
          ))}
        </div>
        <div style={s.social}>
          <h4 style={s.heading}>Follow Us</h4>
          <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
            {["📺 YouTube", "📘 Facebook", "🐦 Twitter", "📸 Instagram"].map(
              (s2) => (
                <div
                  key={s2}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 4,
                    padding: "6px 10px",
                    fontSize: 13,
                  }}
                >
                  {s2}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
      <div style={s.bottom}>
        <p>© {new Date().getFullYear()} News Channel. All rights reserved.</p>
      </div>
    </footer>
  );
}

const s = {
  footer: { background: "#0f1115", color: "#c7cbd6", marginTop: 60 },
  inner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "48px 24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 32,
  },
  brand: {},
  logoHi: {
    fontFamily: "Noto Serif Devanagari, serif",
    fontSize: 24,
    fontWeight: 700,
    color: "#ff6a3d",
  },
  logoEn: { fontSize: 10, letterSpacing: 3, color: "#9aa2b2" },
  tagline: { marginTop: 10, fontSize: 13, color: "#9aa2b2", lineHeight: 1.5 },
  links: { display: "flex", flexDirection: "column", gap: 6 },
  heading: {
    color: "#ff6a3d",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  link: { fontSize: 14, color: "#c7cbd6", transition: "color 0.2s" },
  social: {},
  bottom: {
    background: "#0a0c10",
    textAlign: "center",
    padding: "16px",
    fontSize: 12,
    color: "#7f8797",
  },
};
