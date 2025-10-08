// list-models.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  try {
    const res = await genAI.listModels();
    console.log("✅ Available Gemini models:\n");

    res.forEach(m => {
      console.log(`- ${m.name}`);
      console.log(`   Supported: ${m.supportedGenerationMethods.join(", ")}`);
      console.log(`   Description: ${m.description || "No description"}\n`);
    });
  } catch (err) {
    console.error("❌ Error listing models:", err.message);
  }
}

listModels();
