const ai = require("../config/gemini");

const generateAnswer = async (question, chunks, extractedText) => {
  try {
    let context = chunks.join("\n\n");

    const prompt = `
You are a Knowledge Base Assistant. Your job is to help users find information from their uploaded documents.

INSTRUCTIONS:
- Answer the question using the document content below.
- If the answer is partially present, provide what you can find and note what's missing.
- If the document is completely unrelated to the question, say so politely and explain what the document is about.
- Be helpful and detailed in your answers.

Document Content:
${context}

Question: ${question}

Answer:
`;

    let response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let answer = response.text;

    if (
      answer &&
      (answer.includes("couldn't find") ||
        answer.toLowerCase().includes("not present") ||
        answer.toLowerCase().includes("no relevant") ||
        answer.trim().length < 20) &&
      extractedText &&
      extractedText.length > context.length
    ) {
      const fullPrompt = `
You are a Knowledge Base Assistant. A previous search through chunks of the document didn't find a good answer. Now try using the full document text below.

INSTRUCTIONS:
- Answer the question using the document content below.
- If the answer is partially present, provide what you can find.
- Be helpful and detailed.

Full Document Content:
${extractedText.substring(0, 15000)}

Question: ${question}

Answer:
`;

      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
      });

      answer = response.text;
    }

    return answer;
  } catch (error) {
    throw new Error("AI generation failed: " + error.message);
  }
};

module.exports = {
  generateAnswer,
};