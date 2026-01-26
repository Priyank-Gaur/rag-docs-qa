const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function rephraseAnswer(chunks, question) {
  if (chunks.length === 0) {
    return {
      answer: "I could not find this information in the provided documentation.",
      sources: []
    };
  }

  const context = chunks.join("\n\n---\n\n");

  const prompt = `You are a helpful AI assistant. Answer the user's question based strictly on the provided context below.
  
If the context contains the answer, provide it clearly.
If the context contains related information that might help answer (even if partial), use it.
Only if the context is completely irrelevant should you say you don't know.

Context:
${context}

Question:
${question}

Answer:`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    return {
      answer,
      sources: chunks
    };
  } catch (error) {
    console.log("LLM Generation Failed:", error.message);
    
    let userMessage = "LLM Unavailable";
    if (error.message.includes("429")) {
      userMessage = "Rate limit exceeded (Too Many Requests)";
    } else if (error.message.includes("404")) {
      userMessage = "Model not found";
    }

    const mainChunk = chunks[0];
    return {
      answer: `⚠️ *${userMessage}* - Showing raw documentation search result:\n\n${mainChunk}...`,
      sources: chunks
    };
  }
}

module.exports = { rephraseAnswer };
