import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { resolveImageUrl } from "../utils/api";
import { useLang, t } from "../context/LangContext";
import ArticleCard from "../components/ArticleCard";
import Sidebar from "../components/Sidebar";
import { format } from "date-fns";

const CATEGORIES = [
  "Politics",
  "Sports",
  "Technology",
  "Entertainment",
  "Business",
  "Health",
  "World",
  "Local",
];

export default function Home() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [latest, setLatest] = useState([]);
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/articles/latest")
      .then((r) => setLatest(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 9 };
    if (activeCategory) params.category = activeCategory;
    API.get("/articles", { params })
      .then((r) => {
        setArticles(r.data.articles);
        setTotalPages(r.data.pages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, activeCategory]);

  const heroMain = latest[0];
  const heroSide = latest.slice(1, 4);

  return (
    <div>
      {/* Breaking news ticker */}
      {latest.length > 0 && (
        <div style={s.ticker}>
          <span style={s.tickerLabel}>
            {lang === "hi" ? "ब्रेकिंग" : "BREAKING"}
          </span>
          <div style={s.tickerTrack}>
            {latest.map((a) => (
              <span
                key={a._id}
                style={s.tickerItem}
                onClick={() => navigate(`/article/${a._id}`)}
              >
                {t(a.title, lang)} &nbsp;&nbsp;•&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="page-wrapper">
        {/* Main Content */}
        <main>
          {/* Hero Section */}
          {heroMain && (
            <div className="hero-grid">
              <div
                className="hero-main reveal"
                onClick={() => navigate(`/article/${heroMain._id}`)}
              >
                {heroMain.coverImage ? (
                  <img
                    src={resolveImageUrl(heroMain.coverImage)}
                    alt={t(heroMain.title, lang)}
                  />
                ) : (
                  <div
                    style={{
                      background: "#1a1a1a",
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                    }}
                  />
                )}
                <div className="hero-main-content">
                  <span className="category-badge">{heroMain.category}</span>
                  <h2
                    style={{
                      fontFamily:
                        lang === "hi"
                          ? "Noto Serif Devanagari, serif"
                          : undefined,
                    }}
                  >
                    {t(heroMain.title, lang)}
                  </h2>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: 13,
                      marginTop: 6,
                    }}
                  >
                    {format(new Date(heroMain.createdAt), "dd MMM yyyy")}
                  </p>
                </div>
              </div>
              <div className="hero-side">
                {heroSide.map((a, idx) => (
                  <div
                    key={a._id}
                    className="hero-side-item reveal"
                    style={{ "--i": idx + 1 }}
                    onClick={() => navigate(`/article/${a._id}`)}
                  >
                    {a.coverImage ? (
                      <img
                        src={resolveImageUrl(a.coverImage)}
                        alt={t(a.title, lang)}
                      />
                    ) : (
                      <div
                        style={{
                          width: 100,
                          height: 80,
                          background: "#ddd",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div className="hero-side-item-body">
                      <span className="category-badge" style={{ fontSize: 10 }}>
                        {a.category}
                      </span>
                      <h4
                        style={{
                          marginTop: 4,
                          fontFamily:
                            lang === "hi"
                              ? "Noto Serif Devanagari, serif"
                              : undefined,
                        }}
                      >
                        {t(a.title, lang)}
                      </h4>
                      <p style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
                        {format(new Date(a.createdAt), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div style={s.catFilter}>
            <button
              style={{
                ...s.catBtn,
                ...(activeCategory === "" ? s.catBtnActive : {}),
              }}
              onClick={() => {
                setActiveCategory("");
                setPage(1);
              }}
            >
              {lang === "hi" ? "सभी" : "All"}
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                style={{
                  ...s.catBtn,
                  ...(activeCategory === cat ? s.catBtnActive : {}),
                }}
                onClick={() => {
                  setActiveCategory(cat);
                  setPage(1);
                }}
              >
                {lang === "hi" ? getCatHi(cat) : cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div style={s.loading}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} style={s.skeleton} />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div style={s.empty}>
              <span style={{ fontSize: 48 }}>📭</span>
              <p>{lang === "hi" ? "कोई लेख नहीं मिला" : "No articles found"}</p>
            </div>
          ) : (
            <div style={s.grid}>
              {articles.map((article, idx) => (
                <div
                  key={article._id}
                  className="reveal"
                  style={{ "--i": idx % 6 }}
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={s.pagination}>
              <button
                style={s.pageBtn}
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  style={{
                    ...s.pageBtn,
                    ...(page === p ? s.pageBtnActive : {}),
                  }}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                style={s.pageBtn}
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
}

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
  })[c] || c;

const s = {
  ticker: {
    background: "#111",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    height: 36,
  },
  tickerLabel: {
    background: "#ff6a3d",
    padding: "0 16px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: 1,
    flexShrink: 0,
  },
  tickerTrack: {
    display: "flex",
    animation: "ticker 30s linear infinite",
    paddingLeft: 16,
  },
  tickerItem: {
    whiteSpace: "nowrap",
    fontSize: 13,
    cursor: "pointer",
    padding: "0 8px",
  },
  catFilter: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    margin: "24px 0 16px",
    alignItems: "center",
  },
  catBtn: {
    padding: "6px 14px",
    borderRadius: 20,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    color: "#555",
  },
  catBtnActive: {
    background: "#ff6a3d",
    borderColor: "#ff6a3d",
    color: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 20,
    marginBottom: 32,
  },
  loading: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 20,
  },
  skeleton: {
    height: 300,
    borderRadius: 8,
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  },
  empty: {
    textAlign: "center",
    padding: "60px 0",
    color: "#999",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  pagination: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    margin: "32px 0",
  },
  pageBtn: {
    padding: "8px 14px",
    borderRadius: 6,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontSize: 14,
    cursor: "pointer",
  },
  pageBtnActive: {
    background: "#ff6a3d",
    borderColor: "#ff6a3d",
    color: "#fff",
  },
};
