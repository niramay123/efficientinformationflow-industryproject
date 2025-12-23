// models/Document.js
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileName: { type: String, required: true }, // stored filename on server
  originalName: { type: String, required: true }, // original uploaded name
  filter: { type: String, default: "General" }, // e.g., Safety, HR, etc.
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Document", documentSchema);
