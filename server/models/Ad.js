const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    link: { type: String },
    position: {
      page: {
        type: String,
        enum: ["home", "category", "article"],
        default: "home",
      },
      placement: {
        type: String,
        enum: ["banner", "sidebar"],
        default: "banner",
      },
      order: { type: Number, default: 0 },
    },
    isActive: { type: Boolean, default: true },
    clickCount: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Ad", adSchema);
