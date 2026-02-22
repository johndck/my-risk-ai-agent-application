import { generateObject, jsonSchema } from 'ai'; // ✅ FIXED: Added imports
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createXai } from '@ai-sdk/xai'; // [1] Added xAI provider import
import { agentInstructions } from './instructions.js';
import { RiskDefinitionSchema } from './schema.js';
import 'dotenv/config';


// Manually defining the provider and telling it exactly where the key is
// Initialise Google

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY, 
  });

// Initialise xAI

const xai = createXai({
    apiKey: process.env.XAI_API_KEY, // Ensure this is in your .env
  });


async function main() {

// 1. Dynamic Date Handling
const today = new Date().toISOString().split('T')[0];
const finalInstructions = agentInstructions.replace('{{TODAY_DATE}}', today);

const promptInput = "Given the MCR handover has been delayed, the downstream tasks for building the network might not be able complete in the time.";


const modelsToCompare = [
    { name: 'Gemini-2.5-flash', instance: google('gemini-2.5-flash') },
    { name: 'grok-4-fast-non-reasoning', instance: xai('grok-4-fast-non-reasoning') }
  ];


  try {

    console.log(`Querying multiple models`);

   // [1] Using async inside map instead of .then()
   const requests = modelsToCompare.map(async (model) => {
    // Each iteration is now its own mini-async function
    const { object } = await generateObject({
        model: model.instance,
        system: finalInstructions,
        schema: jsonSchema(RiskDefinitionSchema), // Native schema wrapping
        prompt: promptInput,
      });

    return { id: model.name, object };
    });

    // [2] Wait for all promises to settle.

    const results = await Promise.allSettled(requests);

    // [2] Iterate through the outcomes
        results.forEach((outcome, index) => {
  // Each 'outcome' has a 'status' property: "fulfilled" or "rejected"
  
        if (outcome.status === 'fulfilled') {
    // Access the data we returned in the .map() via outcome.value
        const { id, object } = outcome.value;
        console.log(`\n✅ --- Model: ${id} ---`);
        console.log(object);

  } else {
    // If it failed, the error is in outcome.reason
    // We use the original index to identify which model failed
    const modelName = modelsToCompare[index].name;
    console.log(`\n❌ --- Model: ${modelName} FAILED ---`);
    console.error(`Reason: ${outcome.reason?.message || outcome.reason || 'Unknown error'}`);
  }
});

  } catch (error) {
    console.error("❌ execution error:", error.message);
  }
}

main();
