import mongoose from "mongoose";

const segmentSchema = new mongoose.Schema(
  {
    podcastId: { type: mongoose.Schema.Types.ObjectId, ref: "Podcast", required: true },
    segmentId: { type: Number, required: true },
    text: { type: String, required: true },
    summary: { type: String },
    keywords: [String],
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    sentiment: {
      score: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

const Segment = mongoose.model("Segment", segmentSchema);

export default Segment;
