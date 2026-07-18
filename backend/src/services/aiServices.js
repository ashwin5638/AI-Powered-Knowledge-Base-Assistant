const ai = require("../config/gemini");

const MAX_CONTEXT_CHARS = 12000;
const MAX_FULL_TEXT_CHARS = 8000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const filterRelevantChunks = (chunks, question) => {
  if (chunks.length <= 3) return chunks;

  const keywords = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const scored = chunks.map((chunk, index) => {
    const lowerChunk = chunk.toLowerCase();
    let score = 0;
    for (const kw of keywords) {
      if (lowerChunk.includes(kw)) score++;
    }
    return { chunk, index, score };
  });

  scored.sort((a, b) => b.score - a.score || a.index - b.index);

  return scored.slice(0, Math.max(3, Math.ceil(chunks.length / 2))).map((s) => s.chunk);
};

const truncateContext = (text, maxChars) => {
  if (text.length <= maxChars) return text;
  return text.substring(0, maxChars) + "\n...[truncated]";
};

const generateContentWithRetry = async (prompt) => {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      const isQuotaError =
        error.message?.includes("429") ||
        error.message?.includes("RESOURCE_EXHAUSTED") ||
        error.message?.includes("quota");

      if (isQuotaError && attempt < MAX_RETRIES - 1) {
        const delay = RETRY_DELAY_MS * (attempt + 1);
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
};

const generateAnswer = async (question, chunks, extractedText) => {
  try {
    const relevantChunks = filterRelevantChunks(chunks, question);
    let context = truncateContext(relevantChunks.join("\n\n"), MAX_CONTEXT_CHARS);

    const prompt = `You are a Knowledge Base Assistant. Answer the question using the document content below.
If the answer is partially present, provide what you can find.
If unrelated to the question, say so politely.
Be concise but thorough.

Document Content:
${context}

Question: ${question}

Answer:`;

    let answer = await generateContentWithRetry(prompt);

    if (
      answer &&
      (answer.includes("couldn't find") ||
        answer.toLowerCase().includes("not present") ||
        answer.toLowerCase().includes("no relevant") ||
        answer.toLowerCase().includes("not mentioned") ||
        answer.trim().length < 20) &&
      extractedText &&
      extractedText.length > context.length
    ) {
      const fullPrompt = `You are a Knowledge Base Assistant. A previous search didn't find a good answer. Try using the full document text below.

Document Content:
${truncateContext(extractedText, MAX_FULL_TEXT_CHARS)}

Question: ${question}

Answer:`;

      answer = await generateContentWithRetry(fullPrompt);
    }

    return answer;
  } catch (error) {
    throw new Error("AI generation failed: " + error.message);
  }
};

module.exports = {
  generateAnswer,
};
