const ai = require("../config/ai");

const MAX_CONTEXT_CHARS = 12000;
const MAX_FULL_TEXT_CHARS = 8000;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 10000;

const MODELS = [
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "openai/gpt-oss-20b:free",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const filterRelevantChunks = (chunks, question) => {
  if (chunks.length <= 3) return chunks;

  const keywords = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const scored = chunks.map((chunk, index) => {
    let score = 0;
    for (const kw of keywords) {
      if (chunk.toLowerCase().includes(kw)) score++;
    }
    return { chunk, index, score };
  });

  scored.sort((a, b) => b.score - a.score || a.index - b.index);

  return scored
    .slice(0, Math.max(3, Math.ceil(chunks.length / 2)))
    .map((s) => s.chunk);
};

const truncateContext = (text, maxChars) => {
  if (text.length <= maxChars) return text;
  return text.substring(0, maxChars) + "\n...[truncated]";
};

const generateContentWithRetry = async (prompt) => {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const model = MODELS[attempt % MODELS.length];
    try {
      const response = await ai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
      });
      return response.choices[0].message.content;
    } catch (error) {
      const isRetryable =
        error.status === 429 ||
        error.status === 400 ||
        error.status === 404 ||
        error.message?.includes("429") ||
        error.message?.includes("RESOURCE_EXHAUSTED") ||
        error.message?.includes("rate_limit") ||
        error.message?.includes("unavailable") ||
        error.message?.includes("not found");

      if (isRetryable && attempt < MAX_RETRIES - 1) {
        await sleep(RETRY_DELAY_MS * (attempt + 1));
        continue;
      }
      throw error;
    }
  }
};

const generateAnswer = async (question, chunks, extractedText) => {
  try {
    const relevantChunks = filterRelevantChunks(chunks, question);
    let context = truncateContext(
      relevantChunks.join("\n\n"),
      MAX_CONTEXT_CHARS
    );

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
