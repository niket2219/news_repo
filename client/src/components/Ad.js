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

  // Adjust image style based on where the ad is shown
  const imgStyle =
    variant === "sidebar"
      ? {
          width: "100%",
          height: 140,
          display: "block",
          objectFit: "contain",
          background: "#fff",
        }
      : {
          width: "100%",
          height: "auto",
          display: "block",
          maxHeight: 300,
          objectFit: "cover",
        };

  return (
    <div
      style={{
        background: "#f9f9f9",
        borderRadius: 8,
        overflow: "hidden",
        cursor: ad && ad.link ? "pointer" : "default",
        transition: "transform 0.2s ease",
        border: "1px solid #e0e0e0",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onClick={handleClick}
      role={ad && ad.link ? "link" : undefined}
      aria-label={ad && ad.title ? `Advertisement: ${ad.title}` : "Advertisement"}
    >
      {ad && ad.imageUrl ? (
        <img src={resolveImageUrl(ad.imageUrl)} alt={ad && ad.title} style={imgStyle} />
      ) : (
        <div style={{ height: variant === "sidebar" ? 140 : 180, background: "#eee" }} />
      )}
      <div
        style={{
          padding: "10px",
          textAlign: "center",
          fontSize: 11,
          color: "#999",
        }}
      >
        {ad && ad.title}
      </div>
    </div>
  );
}
