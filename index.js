import { generateObject, jsonSchema } from 'ai'; // ✅ FIXED: Added imports
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createXai } from '@ai-sdk/xai'; // [1] Added xAI provider import
import { agentInstructions } from './instructions.js';
import { RiskDefinitionSchema } from './schema.js';
import { evaluateAndSynthesize } from './evaluator.js';
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

const promptInput = "if we cannot complete signing of the Wayleave until end of March then Expo-E are unlikely to secure an installation date until May resulting in a delay to the end of May go-live date  ";


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

    return { id: model.name, data: object };
    });

    // [2] Wait for all promises to settle.

    const results = await Promise.allSettled(requests);

    // [3] Audit the results: Log successes and failures
        results.forEach((outcome, index) => {
        const modelName = modelsToCompare[index].name;
  
        if (outcome.status === 'fulfilled') {
          console.log(`✅ Model Success: ${modelName}`);
        } else {
      // This tells you exactly why a specific model didn't make it to the evaluator
        console.error(`❌ Model Failed: ${modelName}`);
      console.error(`   Reason: ${outcome.reason?.message || outcome.reason}`);
        }
      });



    // [2] Extract only the successful objects into an array
    const successfulOutputs = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);

// [3] Pass the array of objects to your external function
    if (successfulOutputs.length > 0) {
    console.log(`\nSending ${successfulOutputs.length} results to evaluation...`);
    
    
    const evaluation = await evaluateAndSynthesize(successfulOutputs, promptInput);

    console.log("\n🏆 FINAL SYNTHESIZED RISK:");
    console.log(JSON.stringify(evaluation, null, 2)); // Pretty-prints the whole object
      } else {
        console.error("No successful results to evaluate.");
        }

  } catch (error) {
    console.error("❌ execution error:", error.message);
  }
}

main();
