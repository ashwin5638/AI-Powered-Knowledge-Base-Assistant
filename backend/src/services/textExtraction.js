const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");


const chunkText = (text, chunkSize = 1000, overlap = 150) => {
  const words = text.split(/\s+/);

  if (words.length <= chunkSize) {
    return [text];
  }

  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    if (chunk.trim()) {
      chunks.push(chunk);
    }
  }

  return chunks;
};

const extractText = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  let text = "";

  if (extension === ".pdf") {
    const buffer = fs.readFileSync(filePath);

    if (buffer.length === 0) {
      throw new Error("PDF file is empty");
    }

    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();

    text = result.text;

    if (!text || text.trim().length === 0) {
      throw new Error("PDF has no extractable text. It may be a scanned/image-based PDF.");
    }
  }

  else if (extension === ".txt" || extension === ".md") {
    text = fs.readFileSync(filePath, "utf8");
  }

  else {
    throw new Error("Unsupported file type: " + extension);
  }

  const metadata = {
    wordCount: text.split(/\s+/).length,
    characterCount: text.length,
  };

  return {
    text,
    chunks: chunkText(text),
    metadata,
  };
};

module.exports = {
  extractText,
};