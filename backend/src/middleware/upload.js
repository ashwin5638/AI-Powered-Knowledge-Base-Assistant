const multer = require('multer')
const path = require("path")
const fs = require("fs")

const uploadDir = path.join(__dirname, '../../uploads')


if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },

    filename : (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9)

        cb(null, uniqueName + path.extname(file.originalname))
    }
})


const allowedTypes = [
    "application/pdf",
  "text/plain",
  "text/markdown", 
]

const fileFilter = (req, file, cb) => {
  if (
    allowedTypes.includes(file.mimetype) ||
    file.originalname.endsWith(".md")
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, TXT, and Markdown (.md) files are allowed."
      ),
      false
    );
  }
};

const upload = multer({
    storage,
    fileFilter,
    limits : {
        fileSize : 5 * 1024 * 1024,
    }
})


module.exports = upload

