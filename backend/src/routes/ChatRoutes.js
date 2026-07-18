const express = require('express')

const router = express.Router()

const {protect} = require('../middleware/auth')
const {askQuestion, getHistory, getDocumentHistory, deleteConversation} = require('../controllers/chatController')


router.post("/ask", protect, askQuestion);

router.get("/history", protect, getHistory);

router.get(
  "/history/:documentId",
  protect,
  getDocumentHistory
);

router.delete("/history/:id", protect, deleteConversation);

module.exports = router;