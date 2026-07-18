const Document = require("../models/Document");
const { extractText } = require("../services/textExtraction");
const fs = require("fs");
const path = require("path");


const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file.",
      });
    }

    const document = await Document.create({
      owner: req.user._id,
      name: path.parse(req.file.originalname).name,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileType: path.extname(req.file.originalname).replace(".", ""),
      fileSize: req.file.size,
      status: "processing",
    });

    try {
      if (!fs.existsSync(req.file.path)) {
        throw new Error('Uploaded file not found on disk');
      }

      const { text, chunks, metadata } = await extractText(req.file.path);

      if (!text || text.trim().length === 0) {
        throw new Error('Extracted text is empty. PDF may be image-based or corrupted.');
      }

      document.extractedText = text;
      document.chunks = chunks;
      document.metadata = metadata;
      document.status = "ready";
      await document.save();
    } catch (extractError) {
      console.error('Text extraction failed:', extractError);
      document.status = "failed";
      await document.save();
    }

    res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
};


const getDocuments = async (req, res, next) => {
  try {
    const { search, type, status, sort } = req.query;

    const query = { owner: req.user._id };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (type) {
      query.fileType = type;
    }

    if (status) {
      query.status = status;
    }

    let documents = Document.find(query);

    if (sort === "oldest") {
      documents = documents.sort({ createdAt: 1 });
    } else {
      documents = documents.sort({ createdAt: -1 });
    }

    documents = await documents;

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};


const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
};


const previewDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    let preview = "";

    if (fs.existsSync(document.filePath)) {
      preview = fs.readFileSync(document.filePath, "utf8").slice(0, 1000);
    }

    res.status(200).json({
      success: true,
      preview,
    });
  } catch (error) {
    next(error);
  }
};


const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: "Document deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocument,
  previewDocument,
  deleteDocument,
};