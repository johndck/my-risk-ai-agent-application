import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import 'dotenv/config';


// Manually defining the provider and telling it exactly where the key is
const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY, 
  });



async function main() {
  try {
    const { text } = await generateText({
      model: google('gemini-3-flash-preview'), // Using the latest 2026 model
      prompt: 'Write a 1-sentence risk assessment for an AI application.',
    });

    console.log("🤖 Gemini says:", text);
    console.log("✅ Connection Successful!");
  } catch (error) {
    console.error("❌ Connection Failed:", error.message);
  }
}

main();
