import React, { useEffect, useState } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";

export default function AdsManager() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    imageUrl: "",
    page: "home",
    placement: "banner",
    isActive: true,
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = () => {
    API.get("/ads/admin/all")
      .then((r) => {
        setAds(r.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch ads error:", err);
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title) {
        toast.error("Title is required");
        return;
      }
      if (!formData.imageUrl && !file) {
        toast.error("Image is required");
        return;
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("link", formData.link);
      data.append("page", formData.page);
      data.append("placement", formData.placement);
      data.append("isActive", formData.isActive);

      if (file) {
        data.append("image", file);
      } else if (!editingId) {
        data.append("imageUrl", formData.imageUrl);
      } else if (formData.imageUrl && formData.imageUrl.startsWith("http")) {
        data.append("imageUrl", formData.imageUrl);
      }

      if (editingId) {
        await API.put(`/ads/${editingId}`, data);
        toast.success("Ad updated");
      } else {
        await API.post("/ads", data);
        toast.success("Ad created");
      }

      fetchAds();
      resetForm();
    } catch (error) {
      const errMsg =
        error.response?.data?.error || error.message || "Error saving ad";
      toast.error(errMsg);
      console.error("Ad save error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ad?")) return;
    try {
      await API.delete(`/ads/${id}`);
      toast.success("Ad deleted");
      fetchAds();
    } catch (error) {
      const errMsg = error.response?.data?.error || "Error deleting ad";
      toast.error(errMsg);
      console.error("Delete error:", error);
    }
  };

  const handleEdit = (ad) => {
    setEditingId(ad._id);
    setFormData({
      title: ad.title,
      link: ad.link || "",
      imageUrl: ad.imageUrl,
      page: ad.position.page,
      placement: ad.position.placement,
      isActive: ad.isActive,
    });
    setFile(null);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      link: "",
      imageUrl: "",
      page: "home",
      placement: "banner",
      isActive: true,
    });
    setFile(null);
    setEditingId(null);
  };

  if (loading)
    return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;

  return (
    <div style={s.page}>
      <h1 style={s.title}>📢 Manage Advertisements</h1>

      <div style={s.container}>
        <form onSubmit={handleSubmit} style={s.form}>
          <h2 style={s.formTitle}>{editingId ? "Edit Ad" : "Add New Ad"}</h2>

          <div style={s.formGroup}>
            <label style={s.label}>Ad Title *</label>
            <input
              type="text"
              placeholder="e.g., Summer Sale"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              style={s.input}
            />
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Link (optional)</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              style={s.input}
            />
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              style={s.input}
            />
            {formData.imageUrl && !file && (
              <div style={{ fontSize: 12, color: "#888", marginTop: 8 }}>
                Current image: {formData.imageUrl}
              </div>
            )}
          </div>

          <div style={s.formRow}>
            <div style={s.formGroup}>
              <label style={s.label}>Page</label>
              <select
                value={formData.page}
                onChange={(e) =>
                  setFormData({ ...formData, page: e.target.value })
                }
                style={s.input}
              >
                <option value="home">Home</option>
                <option value="category">Category</option>
                <option value="article">Article</option>
              </select>
            </div>

            <div style={s.formGroup}>
              <label style={s.label}>Placement</label>
              <select
                value={formData.placement}
                onChange={(e) =>
                  setFormData({ ...formData, placement: e.target.value })
                }
                style={s.input}
              >
                <option value="banner">Banner</option>
                <option value="sidebar">Sidebar</option>
              </select>
            </div>

            <div style={s.formGroup}>
              <label style={s.label}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />{" "}
                Active
              </label>
            </div>
          </div>

          <div style={s.formActions}>
            <button type="submit" style={s.submitBtn}>
              {editingId ? "Update Ad" : "Create Ad"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={s.cancelBtn}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div style={s.adsGrid}>
          {ads.length === 0 ? (
            <div style={s.empty}>No ads yet. Create one!</div>
          ) : (
            ads.map((ad) => (
              <div key={ad._id} style={s.adCard}>
                <img src={ad.imageUrl} alt={ad.title} style={s.adImage} />
                <div style={s.adCardBody}>
                  <h3 style={s.adTitle}>{ad.title}</h3>
                  <div style={s.adInfo}>
                    <p>
                      📍 {ad.position.page} - {ad.position.placement}
                    </p>
                    <p>
                      ✓ Status:{" "}
                      <span
                        style={{ color: ad.isActive ? "#4caf50" : "#f44336" }}
                      >
                        {ad.isActive ? "Active" : "Inactive"}
                      </span>
                    </p>
                    <p>
                      👁 {ad.impressions} impressions | 🔗 {ad.clickCount}{" "}
                      clicks
                    </p>
                  </div>
                  <div style={s.adActions}>
                    <button onClick={() => handleEdit(ad)} style={s.editBtn}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ad._id)}
                      style={s.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: 1400, margin: "0 auto", padding: "32px 24px" },
  title: {
    fontFamily: "Playfair Display, serif",
    fontSize: 28,
    marginBottom: 32,
  },
  container: { display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 },
  form: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    height: "fit-content",
    position: "sticky",
    top: 20,
  },
  formTitle: { fontSize: 16, fontWeight: 700, marginBottom: 20 },
  formGroup: { marginBottom: 16 },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #ddd",
    fontSize: 14,
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 12,
    marginBottom: 16,
  },
  formActions: { display: "flex", gap: 12 },
  submitBtn: {
    background: "#ff6a3d",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: 6,
    fontWeight: 600,
    cursor: "pointer",
    flex: 1,
  },
  cancelBtn: {
    background: "#f0f0f0",
    color: "#333",
    padding: "10px 20px",
    borderRadius: 6,
    fontWeight: 600,
    cursor: "pointer",
    flex: 1,
  },
  adsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 16,
  },
  empty: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: 40,
    color: "#999",
  },
  adCard: {
    background: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "box-shadow 0.2s ease",
  },
  adImage: { width: "100%", height: 180, objectFit: "cover", display: "block" },
  adCardBody: { padding: 16 },
  adTitle: { fontSize: 14, fontWeight: 700, marginBottom: 8 },
  adInfo: { fontSize: 12, color: "#666", marginBottom: 12, lineHeight: 1.6 },
  adActions: { display: "flex", gap: 8 },
  editBtn: {
    background: "#2196F3",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    flex: 1,
  },
  deleteBtn: {
    background: "#f44336",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    flex: 1,
  },
};
