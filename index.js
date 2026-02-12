
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai'; 

// Initialize the client
// It will automatically look for process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testGemini() {
  try {
    console.log("⏳ Calling Gemini...");

    // In this unified SDK, you call ai.models.generateContent
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', 
      contents: 'Say "System Online" if you can hear me.'
    });

    // The text property is directly on the response object
    console.log("✅ Response:", response.text);
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.message.includes("401")) {
      console.log("👉 Tip: Check if your API Key is valid in .env");
    }
  }
}

testGemini();