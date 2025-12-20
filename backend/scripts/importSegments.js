import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Podcast from "../models/Podcast.js";
import Segment from "../models/Segment.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load backend/.env
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// database folder
const DATABASE_DIR = path.join(__dirname, "..", "..", "database");

async function importSegments(fileName) {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const filePath = path.join(DATABASE_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // create podcast
    const podcast = await Podcast.create({
      title: fileName.replace(".json", ""),
      fileName,
      audioUrl: `/audio/${fileName.replace(".json", ".mp3")}`,
      duration: null,
      tags: []
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
        endTime: end
      });

      index++;
    }

    console.log(`Imported ${raw.length} segments`);
    console.log(`Podcast ID: ${podcast._id}`);

    process.exit(0);
  } catch (err) {
    console.error("Import failed:", err.message);
    process.exit(1);
  }
}

// CLI
const fileArg = process.argv[2];
if (!fileArg) {
  console.error("Please provide JSON file name");
  process.exit(1);
}

importSegments(fileArg);
