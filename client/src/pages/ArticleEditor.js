import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

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

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    titleEn: "",
    titleHi: "",
    summaryEn: "",
    summaryHi: "",
    contentEn: "",
    contentHi: "",
    category: "Local",
    tags: "",
    youtubeUrl: "",
    published: true,
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("en");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/admin/login");
      return;
    }
    if (isEdit) {
      API.get(`/articles/${id}`).then((r) => {
        const a = r.data;
        setForm({
          titleEn: a.title?.en || "",
          titleHi: a.title?.hi || "",
          summaryEn: a.summary?.en || "",
          summaryHi: a.summary?.hi || "",
          contentEn: a.content?.en || "",
          contentHi: a.content?.hi || "",
          category: a.category || "Local",
          tags: a.tags?.join(", ") || "",
          youtubeUrl: a.youtubeUrl || "",
          published: a.published,
        });
        setExistingImages(a.images || []);
        setRemovedImages([]);
      });
    }
  }, [id, user, authLoading]);

  if (authLoading) {
    return (
      <div style={{ padding: 60, textAlign: "center", color: "#999" }}>
        Checking session...
      </div>
    );
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    e.target.value = "";
  };

  const removePreview = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      const removed = prev[index];
      if (removed?.url) {
        setRemovedImages((list) => [...list, removed.url]);
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titleEn || !form.titleHi || !form.contentEn || !form.contentHi) {
      toast.error("Please fill both English and Hindi title & content");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach((img) => fd.append("images", img));

      if (isEdit) {
        fd.append("existingImages", JSON.stringify(existingImages));
        fd.append("removedImages", JSON.stringify(removedImages));
      }

      if (isEdit) {
        await API.put(`/articles/${id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Article updated!");
      } else {
        await API.post("/articles", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Article published!");
      }
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving article");
    }
    setLoading(false);
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <button style={s.back} onClick={() => navigate("/admin")}>
          ← Back
        </button>
        <h1 style={s.title}>{isEdit ? "Edit Article" : "New Article"}</h1>
        <div style={s.publishToggle}>
          <label style={s.toggleLabel}>
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) =>
                setForm((f) => ({ ...f, published: e.target.checked }))
              }
              style={{ marginRight: 8 }}
            />
            {form.published ? "✅ Published" : "📝 Draft"}
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={s.form}>
        {/* Category & Tags */}
        <div style={s.row}>
          <div style={s.field}>
            <label style={s.label}>Category *</label>
            <select
              style={s.input}
              value={form.category}
              onChange={set("category")}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div style={{ ...s.field, flex: 2 }}>
            <label style={s.label}>Tags (comma separated)</label>
            <input
              style={s.input}
              value={form.tags}
              onChange={set("tags")}
              placeholder="e.g. politics, india, election"
            />
          </div>
        </div>

        <div style={s.field}>
          <label style={s.label}>YouTube Video Link</label>
          <input
            style={s.input}
            value={form.youtubeUrl}
            onChange={set("youtubeUrl")}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        {/* Language Tabs */}
        <div style={s.tabs}>
          <button
            type="button"
            style={{ ...s.tab, ...(activeTab === "en" ? s.tabActive : {}) }}
            onClick={() => setActiveTab("en")}
          >
            🇬🇧 English
          </button>
          <button
            type="button"
            style={{ ...s.tab, ...(activeTab === "hi" ? s.tabActive : {}) }}
            onClick={() => setActiveTab("hi")}
          >
            🇮🇳 हिंदी
          </button>
        </div>

        {/* English Fields */}
        {activeTab === "en" && (
          <div style={s.langSection}>
            <div style={s.field}>
              <label style={s.label}>Title (English) *</label>
              <input
                style={s.input}
                value={form.titleEn}
                onChange={set("titleEn")}
                placeholder="Article headline in English"
                required
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Summary (English)</label>
              <textarea
                style={{ ...s.input, minHeight: 80, resize: "vertical" }}
                value={form.summaryEn}
                onChange={set("summaryEn")}
                placeholder="Short summary / lead paragraph..."
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Content (English) *</label>
              <textarea
                style={{
                  ...s.input,
                  minHeight: 300,
                  resize: "vertical",
                  lineHeight: 1.7,
                }}
                value={form.contentEn}
                onChange={set("contentEn")}
                placeholder="Write the full article in English. You can use basic HTML tags like <p>, <b>, <h3>, <ul> for formatting..."
                required
              />
              <span style={s.hint}>
                Tip: Use &lt;p&gt; for paragraphs, &lt;b&gt; for bold,
                &lt;h3&gt; for subheadings
              </span>
            </div>
          </div>
        )}

        {/* Hindi Fields */}
        {activeTab === "hi" && (
          <div style={s.langSection}>
            <div style={s.field}>
              <label style={s.label}>शीर्षक (हिंदी) *</label>
              <input
                style={{
                  ...s.input,
                  fontFamily: "Noto Serif Devanagari, serif",
                  fontSize: 16,
                }}
                value={form.titleHi}
                onChange={set("titleHi")}
                placeholder="हिंदी में शीर्षक लिखें"
                required
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>सारांश (हिंदी)</label>
              <textarea
                style={{
                  ...s.input,
                  minHeight: 80,
                  resize: "vertical",
                  fontFamily: "Noto Serif Devanagari, serif",
                  fontSize: 15,
                }}
                value={form.summaryHi}
                onChange={set("summaryHi")}
                placeholder="संक्षिप्त सारांश..."
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>सामग्री (हिंदी) *</label>
              <textarea
                style={{
                  ...s.input,
                  minHeight: 300,
                  resize: "vertical",
                  fontFamily: "Noto Serif Devanagari, serif",
                  fontSize: 15,
                  lineHeight: 1.9,
                }}
                value={form.contentHi}
                onChange={set("contentHi")}
                placeholder="पूरा लेख हिंदी में लिखें..."
                required
              />
              <span style={s.hint}>
                टिप: &lt;p&gt; पैराग्राफ के लिए, &lt;b&gt; बोल्ड के लिए उपयोग
                करें
              </span>
            </div>
          </div>
        )}

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div style={s.field}>
            <label style={s.label}>Existing Images</label>
            <div style={s.imgRow}>
              {existingImages.map((img, i) => (
                <div key={i} style={s.imgWrap}>
                  <img src={img.url} alt="" style={s.imgThumb} />
                  <button
                    type="button"
                    style={s.removeBtn}
                    onClick={() => removeExistingImage(i)}
                  >
                    ✕
                  </button>
                  {i === 0 && existingImages.length > 0 && (
                    <span style={s.coverTag}>Cover</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Upload */}
        <div style={s.field}>
          <label style={s.label}>
            {isEdit ? "Add More Images" : "Upload Images"}
          </label>
          <div
            style={s.uploadZone}
            onClick={() => document.getElementById("img-input").click()}
          >
            <span style={{ fontSize: 36 }}>📸</span>
            <p style={{ margin: "8px 0 4px", fontWeight: 600 }}>
              Click to upload images
            </p>
            <p style={{ fontSize: 13, color: "#999" }}>
              JPG, PNG, GIF, WebP — max 5MB each. First image = cover photo.
            </p>
          </div>
          <input
            id="img-input"
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          {previews.length > 0 && (
            <div style={s.imgRow}>
              {previews.map((p, i) => (
                <div key={i} style={s.imgWrap}>
                  <img src={p} alt="" style={s.imgThumb} />
                  <button
                    type="button"
                    style={s.removeBtn}
                    onClick={() => removePreview(i)}
                  >
                    ✕
                  </button>
                  {i === 0 && existingImages.length === 0 && (
                    <span style={s.coverTag}>Cover</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div style={s.submitRow}>
          <button
            type="button"
            style={s.cancelBtn}
            onClick={() => navigate("/admin")}
          >
            Cancel
          </button>
          <button type="submit" style={s.submitBtn} disabled={loading}>
            {loading
              ? "⏳ Saving..."
              : isEdit
                ? "✅ Update Article"
                : "🚀 Publish Article"}
          </button>
        </div>
      </form>
    </div>
  );
}

const s = {
  page: { maxWidth: 900, margin: "0 auto", padding: "32px 24px" },
  topBar: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 32,
    flexWrap: "wrap",
  },
  back: {
    background: "#f0f0f0",
    padding: "8px 16px",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  title: {
    fontFamily: "Playfair Display, serif",
    fontSize: 24,
    fontWeight: 900,
    flex: 1,
  },
  publishToggle: { fontSize: 14 },
  toggleLabel: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontWeight: 600,
  },
  form: { display: "flex", flexDirection: "column", gap: 20 },
  row: { display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: {
    fontSize: 13,
    fontWeight: 700,
    color: "#444",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    padding: "12px 14px",
    borderRadius: 8,
    border: "1.5px solid #e0e0e0",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    background: "#fff",
  },
  hint: { fontSize: 12, color: "#999", marginTop: 4 },
  tabs: { display: "flex", gap: 0, borderBottom: "2px solid #eee" },
  tab: {
    padding: "12px 24px",
    background: "none",
    border: "none",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    color: "#888",
    borderBottom: "3px solid transparent",
    marginBottom: -2,
    transition: "all 0.2s",
  },
  tabActive: { color: "#ff6a3d", borderBottom: "3px solid #ff6a3d" },
  langSection: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    background: "#fafafa",
    padding: 20,
    borderRadius: 8,
    border: "1px solid #eee",
  },
  uploadZone: {
    border: "2px dashed #ddd",
    borderRadius: 8,
    padding: "32px",
    textAlign: "center",
    cursor: "pointer",
    background: "#fafafa",
    transition: "border 0.2s",
  },
  imgRow: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 },
  imgWrap: { position: "relative" },
  removeBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "#1f2937",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    display: "grid",
    placeItems: "center",
    border: "2px solid #fff",
    cursor: "pointer",
  },
  imgThumb: {
    width: 90,
    height: 70,
    objectFit: "cover",
    borderRadius: 6,
    border: "2px solid #eee",
  },
  coverTag: {
    position: "absolute",
    top: 4,
    left: 4,
    background: "#ff6a3d",
    color: "#fff",
    fontSize: 9,
    padding: "2px 6px",
    borderRadius: 3,
    fontWeight: 700,
  },
  submitRow: {
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
    paddingTop: 8,
  },
  cancelBtn: {
    padding: "12px 24px",
    borderRadius: 8,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  submitBtn: {
    padding: "12px 32px",
    borderRadius: 8,
    background: "#ff6a3d",
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
};
