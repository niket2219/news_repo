const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @GET /api/articles — Public: Get all published articles
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = { published: true };
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'title.hi': { $regex: search, $options: 'i' } },
        { 'content.en': { $regex: search, $options: 'i' } },
      ];
    }
    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-content'); // exclude full content in list
    res.json({ articles, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/articles/latest — Get latest 5 for hero section
router.get('/latest', async (req, res) => {
  try {
    const articles = await Article.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title summary coverImage category createdAt');
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/articles/admin — Admin: Get all articles including unpublished
router.get('/admin', protect, async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/articles/:id — Public: Get single article
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/articles — Admin: Create article with images
router.post('/', protect, upload.array('images', 10), async (req, res) => {
  try {
    const { titleHi, titleEn, contentHi, contentEn, summaryHi, summaryEn, category, tags, published } = req.body;
    const imageFiles = req.files || [];
    const images = imageFiles.map((f, i) => ({
      url: `/uploads/${f.filename}`,
      caption: req.body[`caption_${i}`] || ''
    }));
    const coverImage = images.length > 0 ? images[0].url : null;

    const article = await Article.create({
      title: { hi: titleHi, en: titleEn },
      content: { hi: contentHi, en: contentEn },
      summary: { hi: summaryHi, en: summaryEn },
      category,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      images,
      coverImage,
      published: published !== 'false',
    });
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/articles/:id — Admin: Update article
router.put('/:id', protect, upload.array('images', 10), async (req, res) => {
  try {
    const { titleHi, titleEn, contentHi, contentEn, summaryHi, summaryEn, category, tags, published } = req.body;
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    const newImages = (req.files || []).map((f, i) => ({
      url: `/uploads/${f.filename}`,
      caption: req.body[`caption_${i}`] || ''
    }));
    const allImages = [...article.images, ...newImages];

    article.title = { hi: titleHi, en: titleEn };
    article.content = { hi: contentHi, en: contentEn };
    article.summary = { hi: summaryHi, en: summaryEn };
    article.category = category;
    article.tags = tags ? tags.split(',').map(t => t.trim()) : [];
    article.images = allImages;
    article.coverImage = allImages.length > 0 ? allImages[0].url : article.coverImage;
    article.published = published !== 'false';

    const updated = await article.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @DELETE /api/articles/:id — Admin: Delete article
router.delete('/:id', protect, async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
