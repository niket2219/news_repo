import React from "react";
import { useNavigate } from "react-router-dom";
import { useLang, t } from "../context/LangContext";
import { format } from "date-fns";
import { resolveImageUrl } from "../utils/api";

export default function ArticleCard({ article }) {
  const { lang } = useLang();
  const navigate = useNavigate();

  return (
    <div
      className="article-card"
      onClick={() => navigate(`/article/${article._id}`)}
    >
      {article.coverImage ? (
        <img
          src={resolveImageUrl(article.coverImage)}
          alt={t(article.title, lang)}
        />
      ) : (
        <div className="no-image-card">
          <span>📰</span>
        </div>
      )}
      <div className="article-card-body">
        <span className="category-badge">{article.category}</span>
        <h3
          style={{
            fontFamily:
              lang === "hi" ? "Noto Serif Devanagari, serif" : undefined,
          }}
        >
          {t(article.title, lang)}
        </h3>
        {article.summary && (
          <p
            style={{
              fontSize: 13,
              color: "#666",
              marginBottom: 8,
              lineHeight: 1.5,
              fontFamily:
                lang === "hi" ? "Noto Serif Devanagari, serif" : undefined,
            }}
          >
            {t(article.summary, lang)?.slice(0, 100)}...
          </p>
        )}
        <div className="article-card-meta">
          <span>{article.author}</span>
          <span>•</span>
          <span>{format(new Date(article.createdAt), "dd MMM yyyy")}</span>
          <span>•</span>
          <span>👁 {article.views}</span>
        </div>
      </div>
    </div>
  );
}
