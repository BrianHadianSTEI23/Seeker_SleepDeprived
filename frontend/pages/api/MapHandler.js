import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function MapHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { provinceData } = req.body;
  
  console.log(provinceData)

  if (!provinceData) {
    return res.status(400).json({ error: 'Missing province data' });
  }
  


  const prompt = `
You are an economic analyst. Analyze the following province data:

Province: ${provinceData.state}

Provide:
1. Major commodities produced
2. Price fluctuation in the last one month
3. Estimated supply condition
4. Investment recommendation

Return ONLY a valid JSON object without explanation or formatting. Enclose the JSON with triple backticks.

Example final format (USE THE SAME ATTRIBUTE FOR OUTPUT ATTRIBUTE, DON'T CHANGE THE FORMAT):
\`\`\`
{
  "commodities": [
    "palm oil" : "5%", 
    "rubber" : "-3%"
  ],
  "supply_condition": "Stable/Scarce/Abundant",
  "investment_recommendation": ["High potential in palm oil sector"]
}
\`\`\`
on above format, for example commodities, it means palm oil has an increase of value 5% for one last month, rubber has an decrease in value 3% for one last month`;

  try {
    const genAI = new GoogleGenerativeAI("AIzaSyDhn6wjMqQLhRD4ZCUqzAvPWHzd5tVhHsw");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Public, functional model

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    const jsonText = raw.replace(/```(json)?/g, '').trim();
    console.log("Map Handler : " + jsonText)
    
    try {
      const jsonResult = JSON.parse(jsonText);
      res.status(200).json({ result: jsonResult });
    } catch (jsonError) {
      console.error("Failed to parse Gemini response:", jsonError);
      console.log("Raw Gemini response:", raw);
      res.status(500).json({ error: "Gemini returned non-JSON data", raw });
    }

  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
