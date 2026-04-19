import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { resolveImageUrl } from "../utils/api";
import { useLang, t } from "../context/LangContext";
import Sidebar from "../components/Sidebar";
import { format } from "date-fns";

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, setLang } = useLang();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    setLoading(true);
    API.get(`/articles/${id}`)
      .then((r) => {
        setArticle(r.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/");
      });
  }, [id]);

  if (loading)
    return (
      <div style={s.loading}>
        <div style={s.spinner} />
      </div>
    );
  if (!article) return null;

  const isHindi = lang === "hi";
  const fontFamily = isHindi
    ? "Noto Serif Devanagari, serif"
    : "Source Serif 4, serif";

  const getYoutubeEmbed = (url) => {
    if (!url) return "";
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/i);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/i);
    if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;
    const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/i);
    if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;
    return "";
  };

  const youtubeEmbed = getYoutubeEmbed(article.youtubeUrl);

  return (
    <div>
      <div className="page-wrapper">
        {/* Article Content */}
        <main>
          {/* Breadcrumb */}
          <div style={s.breadcrumb}>
            <span style={s.bcLink} onClick={() => navigate("/")}>
              Home
            </span>
            <span> › </span>
            <span
              style={s.bcLink}
              onClick={() => navigate(`/category/${article.category}`)}
            >
              {article.category}
            </span>
            <span> › Article</span>
          </div>

          <article className="article-shell" style={s.article}>
            {/* Category & Language Toggle */}
            <div style={s.metaTop}>
              <span className="category-badge">{article.category}</span>
              <div className="lang-toggle" style={{ marginLeft: "auto" }}>
                <button
                  className={lang === "en" ? "active" : ""}
                  onClick={() => setLang("en")}
                >
                  English
                </button>
                <button
                  className={lang === "hi" ? "active" : ""}
                  onClick={() => setLang("hi")}
                >
                  हिंदी
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 style={{ ...s.title, fontFamily }}>{t(article.title, lang)}</h1>

            {/* Summary */}
            {article.summary && (
              <p style={{ ...s.summary, fontFamily }}>
                {t(article.summary, lang)}
              </p>
            )}

            {/* Meta */}
            <div style={s.meta}>
              <span>✍️ {article.author}</span>
              <span>•</span>
              <span>
                📅{" "}
                {format(new Date(article.createdAt), "dd MMMM yyyy, hh:mm a")}
              </span>
              <span>•</span>
              <span>👁 {article.views} views</span>
            </div>

            {/* Cover Image with gallery */}
            {article.images?.length > 0 && (
              <div style={s.gallery}>
                <img
                  src={resolveImageUrl(article.images[imgIdx]?.url)}
                  alt="article"
                  style={s.mainImg}
                />
                {article.images[imgIdx]?.caption && (
                  <p style={s.caption}>{article.images[imgIdx].caption}</p>
                )}
                {article.images.length > 1 && (
                  <div style={s.thumbRow}>
                    {article.images.map((img, i) => (
                      <img
                        key={i}
                        src={resolveImageUrl(img.url)}
                        alt=""
                        style={{
                          ...s.thumb,
                          outline:
                            i === imgIdx
                              ? "3px solid #ff6a3d"
                              : "3px solid transparent",
                        }}
                        onClick={() => setImgIdx(i)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Article Content */}
            <div
              style={{ ...s.content, fontFamily }}
              dangerouslySetInnerHTML={{ __html: t(article.content, lang) }}
            />

            {/* Tags */}
            {article.tags?.length > 0 && (
              <div style={s.tags}>
                <strong>Tags: </strong>
                {article.tags.map((tag) => (
                  <span key={tag} style={s.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <div style={s.share}>
              <strong>Share: </strong>
              {["Facebook", "Twitter", "WhatsApp", "Telegram"].map((p) => (
                <button key={p} style={s.shareBtn}>
                  {p}
                </button>
              ))}
            </div>
          </article>

          {youtubeEmbed && (
            <section style={s.videoCard}>
              <h3 style={s.videoTitle}>Video</h3>
              <div style={s.videoWrap}>
                <iframe
                  src={youtubeEmbed}
                  title="YouTube video"
                  style={s.videoFrame}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          )}
        </main>

        {/* Right Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
}

const s = {
  loading: { display: "flex", justifyContent: "center", padding: "80px 0" },
  spinner: {
    width: 40,
    height: 40,
    border: "4px solid #eee",
    borderTop: "4px solid #ff6a3d",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  breadcrumb: {
    fontSize: 13,
    color: "#888",
    padding: "16px 0",
    marginBottom: 8,
  },
  bcLink: { cursor: "pointer", color: "#ff6a3d" },
  article: {
    background: "#fff",
    borderRadius: 12,
    padding: "32px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
  },
  metaTop: { display: "flex", alignItems: "center", marginBottom: 20 },
  title: {
    fontSize: "clamp(1.5rem, 3vw, 2.4rem)",
    fontWeight: 900,
    lineHeight: 1.25,
    color: "#111",
    marginBottom: 16,
  },
  summary: {
    fontSize: "1.15rem",
    color: "#444",
    lineHeight: 1.7,
    marginBottom: 20,
    fontStyle: "italic",
    borderLeft: "4px solid #ff6a3d",
    paddingLeft: 16,
  },
  meta: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    fontSize: 13,
    color: "#888",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: "1px solid #eee",
  },
  gallery: { marginBottom: 28 },
  mainImg: {
    width: "100%",
    maxHeight: 500,
    objectFit: "cover",
    borderRadius: 8,
  },
  caption: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  thumbRow: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" },
  thumb: {
    width: 70,
    height: 55,
    objectFit: "cover",
    borderRadius: 4,
    cursor: "pointer",
  },
  content: {
    fontSize: "1.05rem",
    lineHeight: 1.85,
    color: "#222",
    marginBottom: 32,
  },
  tags: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 24,
    fontSize: 13,
  },
  tag: {
    background: "#f0f0f0",
    padding: "4px 12px",
    borderRadius: 14,
    fontSize: 12,
    color: "#555",
  },
  share: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 24,
    paddingTop: 20,
    borderTop: "1px solid #eee",
  },
  shareBtn: {
    padding: "7px 16px",
    borderRadius: 6,
    background: "#ff6a3d",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
  },
  videoCard: {
    marginTop: 24,
    background: "#fff",
    borderRadius: 12,
    padding: "24px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
  },
  videoTitle: {
    fontFamily: "Space Grotesk, sans-serif",
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 12,
  },
  videoWrap: {
    position: "relative",
    paddingTop: "56.25%",
    borderRadius: 12,
    overflow: "hidden",
    background: "#0f1115",
    marginBottom: 24,
  },
  videoFrame: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: 0,
  },
};
