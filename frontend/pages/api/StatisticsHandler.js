import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function StatisticsHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { areaName, areaCommodity } = req.body;

  console.log(areaName)
  console.log(areaCommodity)
  
  if (!areaName || !areaCommodity) {
    return res.status(400).json({ error: 'Missing area name or commodities data' });
  }

  console.log("Incoming areaData:", areaName);

  const prompt = `
You are an economic analyst. Analyze the following province data:

Area: ${areaName}

Commodities: ${areaCommodity}

Provide for each commodity:
1. Commodity name
2. Price fluctuation with its day 
3. Unit
4. Investment recommendation

Return ONLY a valid JSON object without explanation or formatting. Wrap all the JSON inside an "commodities" attribute, then add attribute "length"
 at the end of the array of JSON you're making. Enclose the JSON with triple backticks.

Example format for the final output:
\`\`\`
[
  {
    "commodity": "Crude Oil (WTI)",
    "unit": "USD/barrel",
    "prices": [
      {
        "date": "2025-04-01",
        "price": "77.00"
      },
      {
        "date": "2025-04-02",
        "price": "75.20"
      },
      {
        "date": "2025-04-03",
        "price": "71.40"
      },
      {
        "date": "2025-04-04",
        "price": "67.80"
      },
      etc (make it one month long with two-day interval)
    ],
    "investment_recommendation": "High"
  },
  {
  "commodity": "Cocoa",
  "unit": "USD/barrel",
  "prices": [
    {
      "date": "2025-04-01",
      "price": "70.00"
    },
    {
      "date": "2025-04-02",
      "price": "71.20"
    },
    {
      "date": "2025-04-03",
      "price": "21.40"
    },
    {
      "date": "2025-04-04",
      "price": "57.80"
    },
    etc (make it one month long with two-day interval)
  ],
  "investment_recommendation": "High"
  },
  length : 2
]
\`\`\`
`;

  try {
    const genAI = new GoogleGenerativeAI("AIzaSyDhn6wjMqQLhRD4ZCUqzAvPWHzd5tVhHsw");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    
    const jsonText = raw.replace(/```(json)?/g, '').trim();
    console.log("Statistics Handler : " + jsonText)
    
    try {
      const jsonResult = JSON.parse(jsonText);
      res.status(200).json({ result: jsonResult });
    } catch (jsonError) {
      console.error("Failed to parse Gemini response:", jsonError);
      res.status(500).json({ error: "Gemini returned non-JSON data", raw });
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
