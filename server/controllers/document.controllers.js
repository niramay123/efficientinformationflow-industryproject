import Document from "../models/document.models.js";
import fs from "fs";
import path from "path";

// Upload document (already using multer)
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const { title, filter, uploadedBy } = req.body;

    const doc = await Document.create({
      title,
      filter,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      uploadedBy
    });

    res.status(201).json({ success: true, document: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to upload document" });
  }
};

// Fetch all documents
export const getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find().sort({ uploadedAt: -1 });
    res.status(200).json({ success: true, documents: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch documents" });
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ success: false, message: "Document not found" });

    // Remove file safely
    const filePath = path.resolve("uploads", doc.fileName); // absolute path
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn("File not found or could not delete:", err.message);
    }

    await doc.deleteOne(); // safer than remove()
    res.status(200).json({ success: true, message: "Document deleted" });
  } catch (err) {
    console.error("Delete Document Error:", err);
    res.status(500).json({ success: false, message: "Failed to delete document" });
  }
};