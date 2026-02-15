
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

// 1. Initialize the library with your API Key
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY 
  });

  async function main() {
    try {
      // 2. Call the model
      const response = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents:'How many free tier calls on gemini-3-flash-preview? Answer in 3 sentences max.'
      });
  
      // 3. Print the result

      for await (const chunk of response) {
        console.log(chunk.text);
      }
    } catch (error) {
      console.error('Error calling Gemini:', error);
    }
  }
  
  main();

