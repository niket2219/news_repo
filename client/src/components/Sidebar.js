import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang, t } from "../context/LangContext";
import API, { resolveImageUrl } from "../utils/api";
import { format } from "date-fns";
import Ad from "./Ad";

export default function Sidebar() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [latest, setLatest] = useState([]);
  const [ads, setAds] = useState([]);

  useEffect(() => {
    API.get("/articles/latest")
      .then((r) => setLatest(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Fetch sidebar ads
    API.get("/ads?page=home&placement=sidebar")
      .then((r) => setAds(r.data))
      .catch(() => {});
  }, []);

  return (
    <aside
      className="sidebar"
      style={{ display: "flex", flexDirection: "column", gap: 24 }}
    >
      {/* Latest News */}
      <div style={s.widget}>
        <div style={s.widgetHead}>
          <span style={s.redBar} />
          {lang === "hi" ? "ताज़ा खबरें" : "Latest News"}
        </div>
        {latest.map((a) => (
          <div
            key={a._id}
            style={s.latestItem}
            onClick={() => navigate(`/article/${a._id}`)}
          >
            {a.coverImage && (
              <img src={resolveImageUrl(a.coverImage)} alt="" style={s.thumb} />
            )}
            <div style={{ flex: 1 }}>
              <span className="category-badge" style={{ fontSize: 10 }}>
                {a.category}
              </span>
              <p
                style={{
                  ...s.latestTitle,
                  fontFamily:
                    lang === "hi" ? "Noto Serif Devanagari, serif" : undefined,
                }}
              >
                {t(a.title, lang)}
              </p>
              <span style={s.latestDate}>
                {format(new Date(a.createdAt), "dd MMM yyyy")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div style={s.widget}>
        <div style={s.widgetHead}>
          <span style={s.redBar} />
          {lang === "hi" ? "श्रेणियाँ" : "Categories"}
        </div>
        {[
          "Politics",
          "Sports",
          "Technology",
          "Entertainment",
          "Business",
          "Health",
          "World",
          "Local",
        ].map((cat) => (
          <div
            key={cat}
            style={s.catItem}
            onClick={() => navigate(`/category/${cat}`)}
          >
            <span>{getCatIcon(cat)}</span>
            <span style={{ flex: 1 }}>{lang === "hi" ? getCatHi(cat) : cat}</span>
            <span style={s.arrow}>›</span>
          </div>
        ))}
      </div>

      {/* Sidebar Advertisements */}
      {ads.length > 0 && (
        <div style={s.widget}>
          <div style={s.widgetHead}>
            <span style={s.redBar} />
            {lang === "hi" ? "विज्ञापन" : "Advertisement"}
          </div>
          <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 12 }}>
            {ads.map((a) => (
              <div key={a._id}>
                <Ad ad={a} variant="sidebar" />
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

const getCatIcon = (c) =>
  ({
    Politics: "🏛️",
    Sports: "⚽",
    Technology: "💻",
    Entertainment: "🎬",
    Business: "📈",
    Health: "🏥",
    World: "🌍",
    Local: "📍",
  }[c] || "📰");
const getCatHi = (c) =>
  ({
    Politics: "राजनीति",
    Sports: "खेल",
    Technology: "तकनीक",
    Entertainment: "मनोरंजन",
    Business: "व्यापार",
    Health: "स्वास्थ्य",
    World: "विश्व",
    Local: "स्थानीय",
  }[c] || c);

const s = {
  widget: {
    background: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  widgetHead: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 16px",
    fontFamily: "Space Grotesk, sans-serif",
    fontWeight: 700,
    fontSize: 15,
    borderBottom: "1px solid #eee",
  },
  redBar: {
    display: "inline-block",
    width: 4,
    height: 18,
    background: "#ff6a3d",
    borderRadius: 2,
  },
  latestItem: {
    display: "flex",
    gap: 10,
    padding: "12px 16px",
    borderBottom: "1px solid #f5f5f5",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  thumb: {
    width: 60,
    height: 50,
    objectFit: "cover",
    borderRadius: 4,
    flexShrink: 0,
  },
  latestTitle: {
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.4,
    margin: "4px 0 2px",
    color: "#222",
  },
  latestDate: { fontSize: 11, color: "#999" },
  catItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 16px",
    borderBottom: "1px solid #f5f5f5",
    cursor: "pointer",
    fontSize: 14,
    transition: "background 0.15s",
  },
  arrow: { color: "#ff6a3d", fontWeight: 700 },
};
