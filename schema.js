// schemas.js
// schemas.js - Updated for @google/genai SDK
// schema.js
export const RiskDefinitionSchema = {
  type: "object",
  properties: {
    riskTitle: { type: "string", description: "Concise title for the risk." },
    createdBy: { type: "string", description: "Default to 'John Dick'." },
    riskStatus: { 
      type: "string", 
      enum: ["Open", "Mitigating", "Transferred", "Accepted", "Closed"] 
    },
    riskComponents: {
      type: "object",
      properties: {
        if_Cause: { type: "string" },
        then_Event: { type: "string" },
        resultingIn_Consequence: { type: "string" }
      },
      required: ["if_Cause", "then_Event", "resultingIn_Consequence"]
    },
    riskLikelihood: { type: "integer", minimum: 1, maximum: 4 },
    riskImpact: { type: "integer", minimum: 1, maximum: 4 },
    riskRatingScore: { type: "integer", description: "Likelihood * Impact" },
    targetClosureDate: { type: "string", description: "YYYY-MM-DD" },
    mitigatingActions: { 
      type: "array", 
      items: { type: "string" },
      description: "A list of unique, numbered tactical steps."
    },
    latestUpdate: { type: "string" }
  },
  required: [
    "riskTitle", "createdBy", "riskStatus", "riskComponents", 
    "riskLikelihood", "riskImpact", "riskRatingScore", 
    "targetClosureDate", "mitigatingActions", "latestUpdate"
  ]
};