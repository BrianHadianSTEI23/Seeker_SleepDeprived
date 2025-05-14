import {
    GoogleGenAI,
  } from '@google/genai';
  
  async function main() {
    const ai = new GoogleGenAI({
      apiKey: "AIzaSyB-3wWMN1ZdsjAG9WG-mFKJR0fX43oDRW8",
    });
    const config = {
      responseMimeType: 'text/plain',
      systemInstruction: [
          {
            text: `Act as a local trade and logistics expert specializing in Indonesian markets. Your task is to generate a report for the city of **[City Name, Indonesia]** and output the entire response as a single, valid JSON object. Do not include any text outside of the JSON object.
  
  The JSON object should follow this structure:
  
  \`\`\`json
  {
      "cityName": "String - The name of the city, e.g., [City Name, Indonesia]",
      "commodities": [
          {
              "commodityName": "String - Name of the commodity",
              "estimatedCurrentCosts": "String - Estimated current price range (e.g., 'IDR 10,000 - 12,000/kg, wholesale')",
              "qualityAssessmentMarch2025": "String - Brief description of quality as of approx. March 2025 (e.g., 'Excellent harvest')",
              "currentSupplySituation": "String - Current availability (e.g., 'Abundant', 'Seasonal peak')",
              "overallStatusAndNotes": "String - Summary of market status (e.g., 'Strong export demand')"
          }
          // Add 1 or 2 more commodity objects here if relevant for the city
      ],
      "shippingLogisticsOverview": {
          "shippingCostFactorsAndIndicativeRanges": "String - Primary factors influencing shipping costs from this city and indicative cost ranges (e.g., 'Primary factors: distance to port, fuel prices. Indicative cost to Jakarta: IDR 5,000,000 - 7,000,000 per TEU for sea freight.')",
          "timeEstimation": {
              "toMajorDomesticHub": "String - Estimated transit time to a major domestic hub like Jakarta/Surabaya (e.g., '3-5 days by sea freight to Surabaya')",
              "toCommonRegionalInternationalPort": "String - Estimated transit time to a regional international port like Singapore (e.g., '5-7 days by sea freight to Singapore')"
          }
      }
  }
  \`\`\`
  
  **Instructions for the AI generating the JSON:**
  
  1.  Replace \`[City Name, Indonesia]\` in the \`cityName\` field with the actual city name provided in the input.
  2.  For the \`commodities\` array:
      * Identify 1-3 key commodities typically produced, processed, or significantly traded in the specified city.
      * For each commodity, populate the fields:
          * \`commodityName\`: The name of the commodity.
          * \`estimatedCurrentCosts\`: Provide an estimated current price range, specifying units (IDR/kg, IDR/ton, etc.) and context (wholesale, farm-gate, port price if known).
          * \`qualityAssessmentMarch2025\`: Briefly describe the general quality observed for this commodity around March 2025 (e.g., "Excellent harvest," "Average quality due to weather," "High-grade export quality").
          * \`currentSupplySituation\`: Describe the current availability (e.g., Abundant, Stable, Limited, Scarce, Seasonal peak/off-peak, Disrupted due to [brief reason if known]).
          * \`overallStatusAndNotes\`: Briefly summarize the commodity's current market status (e.g., "Strong export demand," "Primarily domestic consumption," "Facing storage challenges," "New government incentives affecting supply/price").
  3.  For the \`shippingLogisticsOverview\` object:
      * \`shippingCostFactorsAndIndicativeRanges\`:
          * Describe the primary factors influencing shipping costs from this city (e.g., distance to major hubs, infrastructure, fuel prices, port congestion, mode of transport).
          * Provide indicative cost ranges for shipping these types of commodities to another major Indonesian city (e.g., Jakarta or Surabaya) OR a common nearby international port (e.g., Singapore). Specify if this is per TEU, per ton, or per km for trucking, if possible.
      * \`timeEstimation\`:
          * \`toMajorDomesticHub\`: Provide estimated transit times for shipping these commodities from the city (or its nearest major port/logistics hub) to a major domestic hub (e.g., Jakarta/Surabaya).
          * \`toCommonRegionalInternationalPort\`: Provide estimated transit times to a common regional international port (e.g., Singapore or Port Klang).
          * Mention typical timeframes for different modes of transport if relevant (e.g., sea freight, land freight).
  
  Ensure all string values in the JSON are properly escaped. The information should be as current and contextually relevant to Indonesia as possible.
  `,
          }
      ],
    };
    const model = 'gemini-2.5-pro-preview-05-06';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Bandung`,
          },
        ],
      },
    ];
  
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });
    for await (const chunk of response) {
      console.log(chunk.text);
    }
  }
  main();