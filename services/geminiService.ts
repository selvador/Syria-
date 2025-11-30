import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMinistryResponse = async (
  query: string, 
  ministry: string
): Promise<string> => {
  if (!apiKey) return "System Offline: API Key missing.";

  const systemPrompt = `
    You are the AI spokesperson for the ${ministry} of the Syrian Arab Republic in the year 2035.
    Context:
    - Syria has undergone a miraculous recovery and is now a leading regional power.
    - The economy is booming, driven by renewable energy, tech hubs in Damascus and Aleppo, and revitalized agriculture.
    - Tourism is flourishing with restored historical sites (Palmyra, Old Damascus) integrated with futuristic amenities.
    - Tone: Formal, optimistic, patriotic, welcoming, and highly professional.
    - Do not mention the war or past conflicts unless to highlight the resilience of recovery. Focus on the "Dream" achieved.
    - Keep responses concise (under 150 words).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'user', parts: [{ text: query }] }
      ],
    });
    return response.text || "The Ministry is currently updating its records. Please try again.";
  } catch (error) {
    console.error("Ministry Communication Error:", error);
    return "Communication link unstable. Please try again later.";
  }
};

export const generateFutureNews = async (): Promise<string> => {
  const fallbackNews = JSON.stringify([
    {
      "title": "Damascus-Aleppo Hyperloop Inaugurated",
      "summary": "Travel time reduced to 20 minutes between the two economic capitals via new magnetic levitation rail.",
      "category": "Technology",
      "date": "2035-06-15"
    },
    {
      "title": "Agricultural Exports Hit Record High",
      "summary": "Vertical farming initiatives in the Jazira region have tripled the annual yield of wheat and cotton.",
      "category": "Economy",
      "date": "2035-05-20"
    },
    {
      "title": "New Palmyra Digital Museum Opens",
      "summary": "World's largest holographic archive of ancient history now accessible globally from the heart of the desert.",
      "category": "Culture",
      "date": "2035-07-01"
    }
  ]);

  if (!apiKey) return fallbackNews;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate 3 short, positive, futuristic news headlines and summaries for Syria in 2035.",
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              category: { type: Type.STRING, enum: ['Technology', 'Economy', 'Culture', 'Infrastructure'] },
              date: { type: Type.STRING }
            },
            required: ['title', 'summary', 'category', 'date']
          }
        }
      }
    });
    return response.text || fallbackNews;
  } catch (error) {
    console.error("News Feed Error:", error);
    return fallbackNews;
  }
};

export const generateVisionImage = async (prompt: string): Promise<string | null> => {
  if (!apiKey) return null;

  const fullPrompt = `
    A photorealistic, highly detailed, hopeful and futuristic depiction of Syria in 2035.
    Theme: ${prompt}.
    Style: Solar-punk, utopian, bright, combining ancient Syrian architecture with advanced glass and green technology.
    Cinematic lighting, 8k resolution.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }]
      },
      config: {
        // Nano banana models do not support responseMimeType or specific imageConfig for size in the same way Pro does, 
        // but we rely on the default output which is usually a base64 encoded inlineData.
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Vision Generator Error:", error);
    return null;
  }
};

export const generateMapExploration = async (query: string): Promise<{ text: string; chunks: any[] }> => {
  if (!apiKey) return { text: "System Offline: API Key missing.", chunks: [] };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `User Query: "${query}" regarding a location in Syria.
      
      Task:
      1. Use Google Maps to identify the real-world location in Syria.
      2. Provide a description of what this place is known for historically or geographically.
      3. CRITICAL: Transition to the year 2035 context. Creatively describe how this specific location has been modernized in the "Syria 2035 Digital Republic". 
         - Mention futuristic architecture, green energy, digital integration, or preservation efforts.
         - Keep it optimistic and inspiring.
      `,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    return {
      text: response.text || "Location details currently unavailable in the archives.",
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Map Explorer Error:", error);
    return { text: "Satellite link interrupted. Please try another coordinate query.", chunks: [] };
  }
};