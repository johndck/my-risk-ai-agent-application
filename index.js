
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { agentInstructions } from './instructions.js';
import { RiskDefinitionSchema } from './schema.js';

// 1. Initialize the library with your API Key
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY 
  });

  async function main() {
    try {

// 1. Current Date for the AI's context (helps with targetClosureDate)
 
const today = new Date().toISOString().split('T')[0];
  
      // 2. Call the model
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        systemInstruction: `${agentInstructions}\n\nToday's date is ${today}.`,
        contents: [
          {
            role: "user",
            parts: [{ text: "I am worried about not having enough time from the furniture project to complete all the AV installation" }]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: RiskDefinitionSchema,
          temperature: 0.1 
        } // End of config
      }); // End of generateContentStream
  
      // 3. Print the result
      console.log("Generating structured risk...\n");

try {

    for await (const chunk of responseStream) {

      // Safe way: call .text() but handle potential empty returns
      try {
        // In v1.41.0, 'text' is often a direct property on the chunk
        const text = chunk.text || (typeof chunk.text === 'function' ? chunk.text() : '');
        if (text) {
          process.stdout.write(text);
        }
      } catch (e) {
        // Safe to ignore metadata chunks
      }
      }

// 1. Add a newline to move the cursor below the AI's response
console.log('\n');

console.log('\n\x1b[32m✔ Risk generated completed successfully\x1b[0m');
    }catch (error) {
      console.error('The stream was interrupted:', error);
    }


    } catch (error) {
      console.error('Error calling Gemini:', error);
    }
  }
  
  main();

