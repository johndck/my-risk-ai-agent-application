import { generateObject, jsonSchema } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { RiskDefinitionSchema } from './schema.js';
import { evaluatorInstructions } from './instructions.js';

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

export async function evaluateAndSynthesize(outputs, originalPrompt) {
    const today = new Date().toISOString().split('T')[0];
    const finalEvaluatorInstructions = evaluatorInstructions.replace('{{TODAY_DATE}}', today);

    const { object } = await generateObject({
        model: google('gemini-2.5-flash'), // Higher reasoning model recommended here
        system: finalEvaluatorInstructions,
        schema: jsonSchema(RiskDefinitionSchema),
        prompt: `
            USER CONCERN: "${originalPrompt}"
            
            DRAFT 1 (Model: ${outputs[0]?.id || 'N/A'}): 
            ${JSON.stringify(outputs[0]?.data || {}, null, 2)}

            DRAFT 2 (Model: ${outputs[1]?.id || 'N/A'}): 
            ${JSON.stringify(outputs[1]?.data || {}, null, 2)}

            Analyze both drafts. Synthesize the final, authoritative risk object, 
            applying overrides where necessary.
        `,
    });

    return object;
}