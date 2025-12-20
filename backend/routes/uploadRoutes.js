import express from "express";
import multer from "multer";
import path from "path";
import { exec } from "child_process";
import Podcast from "../models/Podcast.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/* ===============================
   MULTER STORAGE
   =============================== */
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "uploads"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

/* ===============================
   UPLOAD ROUTE
   =============================== */
router.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    const file = req.file;
    const baseName = path.parse(file.filename).name;

    const PROJECT_ROOT = path.join(__dirname, "..", "..");

    const audioPath = path.join(
      PROJECT_ROOT,
      "backend",
      "uploads",
      file.filename
    );

    console.log("Audio path passed to Python:", audioPath);

    const podcast = await Podcast.create({
      title: file.originalname,
      fileName: baseName,
      audioUrl: `/uploads/${file.filename}`,
      duration: null,
      tags: [],
      status: "processing"
    });

    /* ===============================
       STEP 1: TRANSCRIPTION
       =============================== */
    exec(
      `python -m src.transcription.batch_transcriber "${audioPath}"`,
      { cwd: PROJECT_ROOT, maxBuffer: 1024 * 1024 * 10 },
      (err) => {
        if (err) return console.error("Transcription error:", err);

        const transcriptPath = path.join(
          PROJECT_ROOT,
          "data",
          "transcripts",
          `${baseName}.json`
        );

        /* ===============================
           STEP 2: SEGMENTATION
           =============================== */
        exec(
          `python -m src.segmentation.batch_segmenter "${transcriptPath}"`,
          { cwd: PROJECT_ROOT },
          (segErr) => {
            if (segErr) return console.error("Segmentation error:", segErr);

            /* ===============================
               STEP 3: KEYWORDS + SUMMARY
               =============================== */
            exec(
              `python -m src.segmentation.batch_keyword_summarizer "${baseName}.json"`,
              { cwd: PROJECT_ROOT },
              (sumErr) => {
                if (sumErr) return console.error("Summarization error:", sumErr);

                /* ===============================
                   STEP 4: IMPORT TO MONGODB
                   =============================== */
                exec(
                  `node backend/scripts/importSegments.js "${baseName}.json"`,
                  { cwd: PROJECT_ROOT },
                  async (impErr) => {
                    if (impErr) {
                      console.error("Import error:", impErr);
                    } else {
                      await Podcast.findByIdAndUpdate(podcast._id, {
                        status: "completed",
                        processedAt: new Date()
                      });
                      console.log("Pipeline completed successfully");
                    }
                  }
                );
              }
            );
          }
        );
      }
    );

    res.json({
      message: "Upload successful. Processing started.",
      podcastId: podcast._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
