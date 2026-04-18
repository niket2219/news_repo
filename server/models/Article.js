const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    hi: { type: String, required: true },   // Hindi title
    en: { type: String, required: true },   // English title
  },
  content: {
    hi: { type: String, required: true },   // Hindi content
    en: { type: String, required: true },   // English content
  },
  summary: {
    hi: { type: String },
    en: { type: String },
  },
  category: {
    type: String,
    enum: ['Politics', 'Sports', 'Technology', 'Entertainment', 'Business', 'Health', 'World', 'Local'],
    default: 'Local'
  },
  images: [
    {
      url: { type: String },
      caption: { type: String }
    }
  ],
  coverImage: { type: String },
  author: { type: String, default: 'Admin' },
  tags: [String],
  views: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
