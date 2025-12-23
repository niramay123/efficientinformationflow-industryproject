import express from "express";
import { uploadDocument, getAllDocuments, deleteDocument } from "../controllers/document.controllers.js";
import { uploadFiles } from "../middlewares/multer.middlewares.js";

const router = express.Router();

// Upload document (uses multer middleware)
router.post("/uploadDocument", uploadFiles, uploadDocument);

// Get all documents
router.get("/documents", getAllDocuments);

// Delete document
router.delete("/documents/:id", deleteDocument);

export default router;
