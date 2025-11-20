import { GoogleGenAI, Type } from "@google/genai";
import { EnergyLog, CoachInsight } from '../types';

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeEnergy = async (logs: EnergyLog[]): Promise<CoachInsight | null> => {
  const ai = getAIClient();
  if (!ai || logs.length === 0) return null;

  // Take the last 10 logs for context
  const recentLogs = logs.slice(0, 10);
  
  const prompt = `
    You are an expert performance coach based on the principles of "The Power of Full Engagement" (全情投入) by Jim Loehr and Tony Schwartz.
    
    Here are the user's recent energy logs (1-10 scale):
    ${JSON.stringify(recentLogs.map(l => ({
      date: new Date(l.timestamp).toLocaleString(),
      levels: l.levels,
      notes: l.notes
    })))}

    Analyze the trends. Look for the dimension (Physical/体能, Emotional/情感, Mental/思维, Spiritual/意志) that is suffering the most or is most volatile.
    Provide a specific "Ritual" for recovery.
    
    Respond in JSON format using Simplified Chinese (简体中文).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A brief empathetic summary of their current state in Chinese." },
            dimensionFocus: { type: Type.STRING, enum: ["physical", "emotional", "mental", "spiritual"] },
            suggestion: { type: Type.STRING, description: "Why this dimension needs attention in Chinese." },
            ritual: { type: Type.STRING, description: "A specific, actionable recovery ritual in Chinese (e.g., '散步15分钟', '写下3个价值观')." }
          },
          required: ["summary", "dimensionFocus", "suggestion", "ritual"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as CoachInsight;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
};