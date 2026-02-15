
import 'dotenv/config';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
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

// START THE CLOCK HERE - This captures the moment the request leaves your machine
        const startRequestTime = Date.now();

  
      // 2. Call the model
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        systemInstruction: `${agentInstructions}\n\nToday's date is ${today}.`,
        contents: [
          {
            role: "user",
            parts: [{ text: "I am worried that we will never be able to install our 2 internet lines into the building in time and we wont be able to offer resilient high speed internet access" }]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: RiskDefinitionSchema,
          temperature: 1.0, 
          thinkingConfig: { thinkingBudget: 0 },
        } // End of config
      }); // End of generateContentStream
  

      let firstTokenTime = null;
      let finalStats = null;

      // 3. Print the result
      console.log("Request sent. Waiting for stream...\n");


try {

    for await (const chunk of responseStream) {

      if (!firstTokenTime){
        firstTokenTime = (Date.now() - startRequestTime) / 1000;
        console.log(`\x1b[33m[TTFT: ${firstTokenTime.toFixed(2)}s - Time from request to first byte]\x1b[0m\n`);
      }


      // Safe way: call .text() but handle potential empty returns
      try {
        // In v1.41.0, 'text' is often a direct property on the chunk
        const text = chunk.text || (typeof chunk.text === 'function' ? chunk.text() : '');
        if (text) {
          process.stdout.write(text);
        }
        if (chunk.usageMetadata){
          finalStats=chunk.usageMetadata
        }

      } catch (e) {
        // Safe to ignore metadata chunks
      }
      }

// 1. Add a newline to move the cursor below the AI's response
      console.log('\n');

      console.log('\n\x1b[32m✔ Risk generated completed successfully\x1b[0m');

      const endToEndTime = (Date.now() - startRequestTime) / 1000;
        console.log(`\n\n\x1b[32m✔ Completed in ${endToEndTime.toFixed(2)}s\x1b[0m`);

// 3. Log stats from the captured variable
if (finalStats) {
  console.log(`\n--- Performance Metrics ---`);
  console.log(`Prompt Tokens: ${finalStats.promptTokenCount}`);
  console.log(`Response Tokens: ${finalStats.candidatesTokenCount}`);
  // This is the specific stat that explains your 30s latency
  console.log(`Thinking Tokens: ${finalStats.thinkingTokenCount || 0}`);
} else {
  console.log("\n⚠️ No metadata found in stream chunks.");
}

    }catch (error) {
      console.error('The stream was interrupted:', error);
    }


    } catch (error) {
      console.error('Error calling Gemini:', error);
    }
  }
  
  main();

