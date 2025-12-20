import express from "express";
import mongoose from "mongoose";
import Segment from "../models/Segment.js";

const router = express.Router();

/**
 * GET segments for a podcast with optional keyword filtering
 * Example:
 *   /api/podcasts/:id/segments
 *   /api/podcasts/:id/segments?keyword=trauma
 */
router.get("/podcasts/:id/segments", async (req, res) => {
  try {
    const { id } = req.params;
    const { keyword } = req.query;

    const podcastId = new mongoose.Types.ObjectId(id);

    let query = { podcastId };

    if (keyword) {
      query.$or = [
        { text: { $regex: keyword, $options: "i" } },
        { summary: { $regex: keyword, $options: "i" } },
        { keywords: { $regex: keyword, $options: "i" } }
      ];
    }

    const segments = await Segment.find(query).sort({ segmentId: 1 });

    res.json(segments);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch segments",
      details: err.message
    });
  }
});

/**
 * Full text search endpoint
 * Example:
 *   /api/podcasts/:id/search?q=brain
 */
router.get("/podcasts/:id/search", async (req, res) => {
  try {
    const { id } = req.params;
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Missing search query ?q=" });
    }

    const podcastId = new mongoose.Types.ObjectId(id);

    const results = await Segment.find({
      podcastId,
      $or: [
        { text: { $regex: q, $options: "i" } },
        { summary: { $regex: q, $options: "i" } },
        { keywords: { $regex: q, $options: "i" } }
      ]
    }).sort({ segmentId: 1 });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Search failed",
      details: err.message
    });
  }
});

export default router;
