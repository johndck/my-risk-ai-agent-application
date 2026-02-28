import { generateObject, jsonSchema } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { RiskDefinitionSchema } from './schema.js';
import evaluatorInstructions from './evalulatorInstructions.js';
import { createXai } from '@ai-sdk/xai'; // [1] Added xAI provider import
import 'dotenv/config';

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
const xai = createXai({
    apiKey: process.env.XAI_API_KEY, // Ensure this is in your .env
  });




export async function evaluateAndSynthesize(outputs, originalPrompt) {
    const today = new Date().toISOString().split('T')[0];
    const finalEvaluatorInstructions = evaluatorInstructions.replace('{{TODAY_DATE}}', today);

    const promptText =`
    USER CONCERN: "${originalPrompt}"
            
            I have received ${outputs.length} draft risk assessments. 
            Your task is to act as the final arbiter:
            
            ${outputs.map((output, index) => `
            DRAFT ${index + 1} (Source: ${output.id}):
            ${JSON.stringify(output.data, null, 2)}
            `).join('\n---\n')}

            ### FINAL TASK:
            1. Resolve any contradictions between the drafts by referring back to the original USER CONCERN.
            2. Combine the best technical observations from all drafts into a single, high-quality risk assessment.
            3. Apply your override authority to set the final risk scores if the drafts provide conflicting or illogical ratings.
            
            Synthesize the final authoritative risk object now.
        `
                try {
                    // 1st attempt to Gemini ----
                    const { object } = await generateObject({
                        model: google('gemini-2.5-flash'), 
                        system: finalEvaluatorInstructions,
                        schema: jsonSchema(RiskDefinitionSchema),
                        prompt: promptText,});

                        return object;

                } catch(error){
                    console.warn("Gemini limit reached or error occurred. Falling back to X.ai...", error.message);

                    // --- Fallback Attempt: X.ai ---
                        try {
                            const { object } = await generateObject({
                                model: xai('grok-4-fast-non-reasoning'), 
                                system: finalEvaluatorInstructions,
                                schema: jsonSchema(RiskDefinitionSchema),
                                prompt: promptText,
                            });

                        return object;
                            } catch (fallbackError) {
                            console.error("Both models we are using failed.");
                            throw fallbackError; // Re-throw if even the backup fails
                            }
                        }
}