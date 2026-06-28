import React, { useEffect } from "react";
import API from "../utils/api";
import { resolveImageUrl } from "../utils/api";

export default function Ad({ ad, variant = "banner" }) {
  useEffect(() => {
    // Track impression
    if (ad && ad._id) {
      API.post(`/ads/${ad._id}/impression`).catch(() => {});
    }
  }, [ad && ad._id]);

  const handleClick = () => {
    if (ad && ad._id) {
      API.post(`/ads/${ad._id}/click`).catch(() => {});
    }
    if (ad && ad.link) {
      window.open(ad.link, "_blank");
    }
  };

  // Styles used for both variants
  const baseCardStyle = {
    background: "#f9f9f9",
    borderRadius: 8,
    overflow: "hidden",
    cursor: ad && ad.link ? "pointer" : "default",
    transition: "transform 0.2s ease",
    border: "1px solid #e0e0e0",
  };

  // Sidebar layout: left = details, right = image (full visible)
  if (variant === "sidebar") {
    return (
      <div
        style={{
          ...baseCardStyle,
          display: "flex",
          gap: 12,
          alignItems: "stretch",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onClick={handleClick}
        role={ad && ad.link ? "link" : undefined}
        aria-label={ad && ad.title ? `Advertisement: ${ad.title}` : "Advertisement"}
      >
        <div style={{ flex: 1, padding: 10, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: "#222", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {ad && ad.title}
          </div>
          {ad && ad.description ? (
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.3, maxHeight: 40, overflow: "hidden", textOverflow: "ellipsis" }}>
              {ad.description}
            </div>
          ) : null}
        </div>

        <div style={{ width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", flexShrink: 0 }}>
          {ad && ad.imageUrl ? (
            <img
              src={resolveImageUrl(ad.imageUrl)}
              alt={ad && ad.title}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#eee" }} />
          )}
        </div>
      </div>
    );
  }

  // Banner / default variant: keep current stacked behavior (image on top)
  const imgStyle = {
    width: "100%",
    height: "auto",
    display: "block",
    maxHeight: 300,
    objectFit: "cover",
  };

  return (
    <div
      style={baseCardStyle}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onClick={handleClick}
      role={ad && ad.link ? "link" : undefined}
      aria-label={ad && ad.title ? `Advertisement: ${ad.title}` : "Advertisement"}
    >
      {ad && ad.imageUrl ? (
        <img src={resolveImageUrl(ad.imageUrl)} alt={ad && ad.title} style={imgStyle} />
      ) : (
        <div style={{ height: 180, background: "#eee" }} />
      )}

      <div style={{ padding: "10px", textAlign: "center", fontSize: 11, color: "#999" }}>
        {ad && ad.title}
      </div>
    </div>
  );
}
