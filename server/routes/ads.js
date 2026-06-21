const express = require("express");
const Ad = require("../models/Ad");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Get all active ads by position
router.get("/", async (req, res) => {
  try {
    const { page, placement } = req.query;
    const filter = { isActive: true };
    if (page) filter["position.page"] = page;
    if (placement) filter["position.placement"] = placement;

    const ads = await Ad.find(filter).sort({ "position.order": 1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all ads (admin)
router.get("/admin/all", protect, async (req, res) => {
  try {
    const ads = await Ad.find().sort({ "position.order": 1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create ad
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { title, link, page, placement, order, isActive } = req.body;
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imageUrl;

    const ad = new Ad({
      title,
      imageUrl,
      link,
      isActive: isActive !== undefined ? isActive : true,
      position: {
        page: page || "home",
        placement: placement || "banner",
        order: order || 0,
      },
    });

    await ad.save();
    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update ad
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const { title, link, page, placement, order, isActive } = req.body;
    const update = { title, link, isActive };

    if (req.file) {
      update.imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      update.imageUrl = req.body.imageUrl;
    }

    if (page || placement || order) {
      update.position = {
        page: page || "home",
        placement: placement || "banner",
        order: order || 0,
      };
    }

    const ad = await Ad.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete ad
router.delete("/:id", protect, async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ message: "Ad deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Track clicks
router.post("/:id/click", async (req, res) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, { $inc: { clickCount: 1 } });
    res.json({ message: "Click tracked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Track impressions
router.post("/:id/impression", async (req, res) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, { $inc: { impressions: 1 } });
    res.json({ message: "Impression tracked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
