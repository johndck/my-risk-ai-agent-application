
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
        contents:'explain the for of loop in javascript?.'
      });
  
      // 3. Print the result


try {
    for await (const chunk of response) {
        process.stdout.write(chunk.text);
      }

// 1. Add a newline to move the cursor below the AI's response
console.log('\n');

console.log("Stream completed with the new code");
    }catch (error) {
      console.error('The stream was interrupted:', error);
    }


    } catch (error) {
      console.error('Error calling Gemini:', error);
    }
  }
  
  main();

