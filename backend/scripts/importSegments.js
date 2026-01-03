import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Podcast from "../models/Podcast.js";
import Segment from "../models/Segment.js";
import logger from "../utils/logger.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const DATABASE_DIR = path.join(__dirname, "..", "..", "database");

async function importSegments(fileName) {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const filePath = path.join(DATABASE_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const baseName = fileName.replace(".json", "");

    const podcast = await Podcast.findOne({ fileName: baseName });

    if (!podcast) {
      throw new Error("Podcast not found for import");
    }

    logger.info("Import started", {
      podcastId: podcast._id,
      fileName: baseName
    });

    let index = 0;

    for (const seg of raw) {
      const start =
        seg.start_time ??
        seg.startTime ??
        index * 10;

      const end =
        seg.end_time ??
        seg.endTime ??
        start + 10;

      await Segment.create({
        podcastId: podcast._id,
        segmentId: seg.segment_id ?? index,
        text: seg.text || "",
        summary: seg.summary || "",
        keywords: seg.keywords || [],
        startTime: start,
        endTime: end,
        sentiment: {
          score: seg.sentiment?.score ?? 0
        }
      });

      index++;
    }

    logger.info("Import completed", {
      podcastId: podcast._id,
      segmentCount: raw.length
    });

    process.exit(0);
  } catch (err) {
    logger.error("Import failed", {
      error: err.message
    });
    process.exit(1);
  }
}

const fileArg = process.argv[2];
if (!fileArg) {
  console.error("Please provide JSON file name");
  process.exit(1);
}

importSegments(fileArg);
