import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { resolveImageUrl } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/admin/login");
      return;
    }
    fetchArticles();
  }, [user, authLoading]);

  const fetchArticles = () => {
    API.get("/articles/admin")
      .then((r) => {
        setArticles(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  if (authLoading) {
    return (
      <div style={{ padding: 60, textAlign: "center", color: "#999" }}>
        Checking session...
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await API.delete(`/articles/${id}`);
      toast.success("Article deleted");
      setArticles((a) => a.filter((x) => x._id !== id));
    } catch {
      toast.error("Error deleting");
    }
  };

  const togglePublish = async (article) => {
    try {
      await API.put(`/articles/${article._id}`, {
        titleHi: article.title.hi,
        titleEn: article.title.en,
        contentHi: article.content.hi,
        contentEn: article.content.en,
        summaryHi: article.summary?.hi || "",
        summaryEn: article.summary?.en || "",
        category: article.category,
        tags: article.tags?.join(", ") || "",
        published: String(!article.published),
      });
      toast.success(article.published ? "Unpublished" : "Published");
      fetchArticles();
    } catch {
      toast.error("Error updating");
    }
  };

  const stats = {
    total: articles.length,
    published: articles.filter((a) => a.published).length,
    views: articles.reduce((sum, a) => sum + (a.views || 0), 0),
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Admin Dashboard</h1>
          <p style={s.sub}>Welcome back, {user?.name}</p>
        </div>
        <button style={s.newBtn} onClick={() => navigate("/admin/article/new")}>
          + New Article
        </button>
      </div>

      {/* Stats */}
      <div style={s.stats}>
        {[
          { label: "Total Articles", value: stats.total, icon: "📰" },
          { label: "Published", value: stats.published, icon: "✅" },
          { label: "Drafts", value: stats.total - stats.published, icon: "📝" },
          {
            label: "Total Views",
            value: stats.views.toLocaleString(),
            icon: "👁",
          },
        ].map((stat) => (
          <div key={stat.label} style={s.statCard}>
            <span style={s.statIcon}>{stat.icon}</span>
            <div style={s.statValue}>{stat.value}</div>
            <div style={s.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Articles Table */}
      <div style={s.tableCard}>
        <div style={s.tableHeader}>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 18 }}>
            All Articles
          </h2>
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#999" }}>
            Loading...
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={s.th}>Cover</th>
                  <th style={s.th}>Title</th>
                  <th style={s.th}>Category</th>
                  <th style={s.th}>Date</th>
                  <th style={s.th}>Views</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article._id} style={s.tr}>
                    <td style={s.td}>
                      {article.coverImage ? (
                        <img
                          src={resolveImageUrl(article.coverImage)}
                          alt=""
                          style={s.rowImg}
                        />
                      ) : (
                        <div style={s.noImg}>📰</div>
                      )}
                    </td>
                    <td style={s.td}>
                      <div style={s.rowTitle}>{article.title?.en}</div>
                      <div style={{ ...s.rowTitleHi }}>{article.title?.hi}</div>
                    </td>
                    <td style={s.td}>
                      <span className="category-badge">{article.category}</span>
                    </td>
                    <td style={s.td}>
                      <span style={s.date}>
                        {format(new Date(article.createdAt), "dd MMM yy")}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={s.views}>👁 {article.views}</span>
                    </td>
                    <td style={s.td}>
                      <span
                        style={{
                          ...s.status,
                          background: article.published ? "#e8f5e9" : "#fce4ec",
                          color: article.published ? "#2e7d32" : "#c62828",
                        }}
                      >
                        {article.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td style={s.td}>
                      <div style={s.actions}>
                        <button
                          style={s.actionBtn}
                          onClick={() => navigate(`/article/${article._id}`)}
                        >
                          View
                        </button>
                        <button
                          style={s.actionBtn}
                          onClick={() =>
                            navigate(`/admin/article/edit/${article._id}`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          style={{
                            ...s.actionBtn,
                            background: article.published
                              ? "#fff3e0"
                              : "#e8f5e9",
                            color: article.published ? "#e65100" : "#2e7d32",
                          }}
                          onClick={() => togglePublish(article)}
                        >
                          {article.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          style={{
                            ...s.actionBtn,
                            background: "#ffebee",
                            color: "#c62828",
                          }}
                          onClick={() => handleDelete(article._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: 1400, margin: "0 auto", padding: "32px 24px" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    flexWrap: "wrap",
    gap: 16,
  },
  title: {
    fontFamily: "Playfair Display, serif",
    fontSize: 28,
    fontWeight: 900,
  },
  sub: { color: "#888", fontSize: 14, marginTop: 4 },
  newBtn: {
    background: "#ff6a3d",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 15,
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    background: "#fff",
    borderRadius: 12,
    padding: "20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    textAlign: "center",
  },
  statIcon: { fontSize: 28 },
  statValue: {
    fontSize: 28,
    fontWeight: 900,
    color: "#ff6a3d",
    marginTop: 8,
    fontFamily: "Playfair Display, serif",
  },
  statLabel: { fontSize: 13, color: "#888", marginTop: 4 },
  tableCard: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  tableHeader: { padding: "20px 24px", borderBottom: "1px solid #eee" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8f8f8" },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: "#555",
    textTransform: "uppercase",
  },
  tr: { borderBottom: "1px solid #f5f5f5" },
  td: { padding: "12px 16px", verticalAlign: "middle" },
  rowImg: { width: 60, height: 44, objectFit: "cover", borderRadius: 4 },
  noImg: {
    width: 60,
    height: 44,
    background: "#f0f0f0",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { fontWeight: 600, fontSize: 14, color: "#111", maxWidth: 280 },
  rowTitleHi: {
    fontSize: 12,
    color: "#888",
    fontFamily: "Noto Serif Devanagari, serif",
    marginTop: 2,
    maxWidth: 280,
  },
  date: { fontSize: 12, color: "#888" },
  views: { fontSize: 13, color: "#666" },
  status: {
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 10,
  },
  actions: { display: "flex", gap: 6, flexWrap: "wrap" },
  actionBtn: {
    padding: "5px 10px",
    borderRadius: 5,
    border: "1px solid #eee",
    background: "#f8f8f8",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
};
