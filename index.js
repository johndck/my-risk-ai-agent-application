
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

// 1. Initialize the library with your API Key
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY 
  });

  async function main() {
    try {
      // 2. Call the model
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Why is the sky blue?',
      });
  
      // 3. Print the result
      console.log(response.text);
    } catch (error) {
      console.error('Error calling Gemini:', error);
    }
  }
  
  main();

