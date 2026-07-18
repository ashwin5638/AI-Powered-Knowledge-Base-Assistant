const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");

const {
  uploadDocument,
  getDocuments,
  getDocument,
  previewDocument,
  deleteDocument,
} = require("../controllers/documentControllers");

// Upload document
router.post(
  "/",
  protect,
  upload.single("document"),
  uploadDocument
);

// Get all documents
router.get("/", protect, getDocuments);

// Get single document
router.get("/:id", protect, getDocument);

// Preview document
router.get("/:id/preview", protect, previewDocument);

// Delete document
router.delete("/:id", protect, deleteDocument);

module.exports = router;