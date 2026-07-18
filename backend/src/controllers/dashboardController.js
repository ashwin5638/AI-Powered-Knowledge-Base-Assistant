const Document = require("../models/Document");
const Conversation = require("../models/Conversation");


const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    
    const totalDocuments = await Document.countDocuments({
      owner: userId,
    });

   
    const totalQuestions = await Conversation.countDocuments({
      user: userId,
    });

    
    const recentUploads = await Document.find({
      owner: userId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name fileType status createdAt");

   
    const recentConversations = await Conversation.find({
      user: userId,
    })
      .populate("document", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("question answer document createdAt");

  
    const documentTypes = await Document.aggregate([
      {
        $match: {
          owner: userId,
        },
      },
      {
        $group: {
          _id: "$fileType",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const fileTypes = {
      pdf: 0,
      txt: 0,
      md: 0,
    };

    documentTypes.forEach((item) => {
      fileTypes[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      data: {
        totalDocuments,
        totalQuestions,
        recentUploads,
        recentConversations,
        documentTypes: fileTypes,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};