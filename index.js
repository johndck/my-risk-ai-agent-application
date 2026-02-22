import { streamText } from 'ai'; // Changed from generateText
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import 'dotenv/config';


// Manually defining the provider and telling it exactly where the key is
const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY, 
  });



async function main() {
  try {
    const result = streamText({
        model: google('gemini-2.5-flash'),
        prompt: 'Write a 3-sentence risk assessment for an AI application.',
      });

    console.log("🤖 Gemini is thinking......");

      // This loop waits for each "chunk" of text to arrive
    for await (const chunk of result.textStream) {
        process.stdout.write(chunk); // Prints to the same line
      }

    console.log("\n\n✅ Stream Complete!");


  } catch (error) {
    console.error("❌ Connection Failed:", error.message);
  }
}

main();
