const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API key found in .env");
    return;
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log("Available Models:");
    if (data.models) {
      data.models.forEach(m => console.log(`- ${m.name} (${m.displayName})`));
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Error listing models:", error.message);
  }
}

listModels();
