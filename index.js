
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
        contents:'how many press ups should I do today before my run?.'
      });
  
      // 3. Print the result


try {
    for await (const chunk of response) {
        process.stdout.write(chunk.text);
      }

// 1. Add a newline to move the cursor below the AI's response
console.log('\n');

console.log('\n\x1b[32m✔ Stream completed successfully\x1b[0m');
    }catch (error) {
      console.error('The stream was interrupted:', error);
    }


    } catch (error) {
      console.error('Error calling Gemini:', error);
    }
  }
  
  main();

