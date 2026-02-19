
import 'dotenv/config';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { agentInstructions } from './instructions.js';
import { RiskDefinitionSchema } from './schema.js';
import formatRiskStatement from './formatRiskStatement.js';
import writeRiskToFile from './writeRisktoFile.js';

// 1. Initialize the library with your API Key
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY 
  });

  async function main() {

    const cliPrompt = process.argv.slice(2).join(" ");

    if (!cliPrompt) {
      console.error("\x1b[31mError: Please provide a concern to analyze.\x1b[0m");
      console.log("Usage: node index.js \"Your concern goes here\"");
      process.exit(1);
    }



    try {

// 1. Current Date for the AI's context (helps with targetClosureDate)
 
        const today = new Date().toISOString().split('T')[0];

// START THE CLOCK HERE - This captures the moment the request leaves your machine
        const startRequestTime = Date.now();

 // NEW: Create a variable to hold the full JSON string
        let fullResponseText = "";       

  
      // 2. Call the model
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        systemInstruction: `${agentInstructions}\n\nToday's date is ${today}.`,
        contents: [
          {
            role: "user",
            parts: [{ text: cliPrompt }]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: RiskDefinitionSchema,
          maxOutputTokens: 4820,
          temperature: 0.15, 
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        } // End of config
      }); // End of generateContentStream
  

      let firstTokenTime = null;
      let finalStats = null;

      // 3. Print the result
      console.log("Request sent to the Gemini SDK. Waiting for stream...\n");


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
          fullResponseText += text;
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


        try {
          // 1. Convert the accumulated string into a JavaScript Object
          const riskData = JSON.parse(fullResponseText);
    
          // 2. Call the formatter function
          const finalStatement = formatRiskStatement(riskData);
    
          // 3. Output the final result
          console.log("\n--- Gemini formulated RISK STATEMENT ---");
          console.log(finalStatement);
          console.log("---------------------------------\n");


          // 4. Write to file
         
          const filename = await writeRiskToFile(finalStatement, riskData);
          console.log(`\n✔ Risk statement saved to: ${filename}`); 


    
        } catch (parseError) {
          console.error("\n❌ Failed to parse JSON or format statement:", parseError.message);
        }




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

