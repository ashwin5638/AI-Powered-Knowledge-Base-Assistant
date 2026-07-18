const Document = require("../models/Document");
const Conversation = require("../models/Conversation");

const { generateAnswer } = require("../services/aiServices");


const askQuestion = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({
        success: false,
        message: "Document ID and question are required.",
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      owner: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    const answer = await generateAnswer(
      question,
      document.chunks,
      document.extractedText
    );

    const conversation = await Conversation.create({
      user: req.user._id,
      document: document._id,
      question,
      answer,
    });

    res.status(200).json({
      success: true,
      data: conversation,
    });

  } catch (error) {
    next(error);
  }
};


const getHistory = async (req, res, next) => {
  try {
    const { search } = req.query;

    const query = { user: req.user._id };

    if (search) {
      query.$or = [
        { question: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } },
      ];
    }

    const history = await Conversation.find(query)
      .populate("document", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: history.length,
      data: history,
    });

  } catch (error) {
    next(error);
  }
};


const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    res.json({
      success: true,
      message: "Conversation deleted.",
    });
  } catch (error) {
    next(error);
  }
};


const getDocumentHistory = async (req, res, next) => {
  try {

    const history = await Conversation.find({
      user: req.user._id,
      document: req.params.documentId,
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      data: history,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  askQuestion,
  getHistory,
  getDocumentHistory,
  deleteConversation,
};