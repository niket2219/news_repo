import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { useLang } from "../context/LangContext";
import ArticleCard from "../components/ArticleCard";
import Sidebar from "../components/Sidebar";

export default function CategoryPage() {
  const { category } = useParams();
  const { lang } = useLang();
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setPage(1);
  }, [category]);

  useEffect(() => {
    setLoading(true);
    API.get("/articles", { params: { category, page, limit: 9 } })
      .then((r) => {
        setArticles(r.data.articles);
        setTotalPages(r.data.pages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, page]);

  const catHi = {
    Politics: "राजनीति",
    Sports: "खेल",
    Technology: "तकनीक",
    Entertainment: "मनोरंजन",
    Business: "व्यापार",
    Health: "स्वास्थ्य",
    World: "विश्व",
    Local: "स्थानीय",
  };

  return (
    <div className="page-wrapper">
      <main>
        <div style={s.header}>
          <span style={s.bar} />
          <h2 style={s.title}>
            {lang === "hi" ? catHi[category] || category : category}
          </h2>
          <span style={s.count}>{lang === "hi" ? "श्रेणी" : "Category"}</span>
        </div>
        {loading ? (
          <div style={s.grid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={s.skeleton} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div style={s.empty}>
            <span style={{ fontSize: 48 }}>📭</span>
            <p>No articles in {category} yet.</p>
          </div>
        ) : (
          <div style={s.grid}>
            {articles.map((a, idx) => (
              <div key={a._id} className="reveal" style={{ "--i": idx % 6 }}>
                <ArticleCard article={a} />
              </div>
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <div style={s.pagination}>
            <button
              style={s.btn}
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                style={{ ...s.btn, ...(page === p ? s.btnActive : {}) }}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              style={s.btn}
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </main>
      <Sidebar />
    </div>
  );
}

const s = {
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "8px 0 24px",
  },
  bar: {
    display: "inline-block",
    width: 5,
    height: 30,
    background: "#ff6a3d",
    borderRadius: 3,
  },
  title: {
    fontFamily: "Playfair Display, serif",
    fontSize: 26,
    fontWeight: 900,
  },
  count: {
    fontSize: 12,
    color: "#999",
    background: "#f0f0f0",
    padding: "3px 10px",
    borderRadius: 10,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 20,
    marginBottom: 32,
  },
  skeleton: { height: 300, borderRadius: 8, background: "#f0f0f0" },
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
  btn: {
    padding: "8px 14px",
    borderRadius: 6,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontSize: 14,
    cursor: "pointer",
  },
  btnActive: { background: "#ff6a3d", borderColor: "#ff6a3d", color: "#fff" },
};
