import mongoose from "mongoose";

export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Lost", "Won"];

export const LEAD_PRIORITIES = ["Low", "Medium", "High"];

const leadSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    name: { type: String, required: [true, "Please add a name"], trim: true },
    email: {
      type: String,

      trim: true,
      lowercase: true,
      default: "",
    },
    phone: { type: String, trim: true, default: "" },
    company: { type: String, trim: true, default: "" },

    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: "new",
      index: true,
    },
    priority: {
      type: String,
      enum: LEAD_PRIORITIES,
      default: "medium",
    },
    source: {
      type: String,
      enum: [
        "website",
        "referral",
        "social media",
        "other",
        "event",
        "cold outreach",
      ],
      default: "other",
    },
    value: { type: Number, default: 0, min: 0 },
    notes: { type: String, default: "" },
    tags: { type: String, trim: true },
    aiSummary: { type: String, default: "" },
    aiRiskScore: { type: Number, default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Lead = mongoose.model("Lead", leadSchema);
