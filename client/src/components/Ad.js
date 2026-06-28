import React, { useEffect } from "react";
import API from "../utils/api";
import { resolveImageUrl } from "../utils/api";

export default function Ad({ ad }) {
  useEffect(() => {
    // Track impression
    if (ad._id) {
      API.post(`/ads/${ad._id}/impression`).catch(() => {});
    }
  }, [ad._id]);

  const handleClick = () => {
    if (ad._id) {
      API.post(`/ads/${ad._id}/click`).catch(() => {});
    }
    if (ad.link) {
      window.open(ad.link, "_blank");
    }
  };

  return (
    <div
      style={{
        background: "#f9f9f9",
        borderRadius: 8,
        overflow: "hidden",
        cursor: ad.link ? "pointer" : "default",
        transition: "transform 0.2s ease",
        border: "1px solid #e0e0e0",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onClick={handleClick}
    >
      <img
        src={resolveImageUrl(ad.imageUrl)}
        alt={ad.title}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          maxHeight: 300,
          objectFit: "cover",
        }}
      />
      <div
        style={{
          padding: "10px",
          textAlign: "center",
          fontSize: 11,
          color: "#999",
        }}
      >
        {ad.title}
      </div>
    </div>
  );
}
