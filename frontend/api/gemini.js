import { GoogleGenAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { provinceData } = req.body;

  if (!provinceData) {
    return res.status(400).json({ error: 'Missing province data' });
  }

  const prompt = `
You are an economic analyst. Analyze the following province data:

Province: ${provinceData.propinsi}

Provide:
1. Major commodities produced
2. Price fluctuation in the last two months
3. Estimated supply condition
4. Investment recommendation

Return in JSON format.
`;

  try {
    // Initialize the GoogleGenAI with your API key
    const genAI = new GoogleGenAI(process.env.GOOGLE_API_KEY); // It's better to use an environment variable

    // Get the Gemini Pro model
    const model = genAI.model({ model: "gemini-pro" }); // Changed to a generally available model

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Attempt to parse the JSON response
    try {
      const jsonResult = JSON.parse(text);
      res.status(200).json({ result: jsonResult });
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      console.log('Raw response:', text);
      res.status(500).json({ error: 'Failed to parse Gemini response as JSON' });
    }

  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}