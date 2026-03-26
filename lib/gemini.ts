import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function generateContent(prompt: string): Promise<string> {
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate content with Gemini API');
  }
}

export async function generateJSON<T>(prompt: string): Promise<T> {
  try {
    const jsonPrompt = `${prompt}\n\nIMPORTANT: Respond with valid JSON only. Do not include any markdown formatting, explanations, or text outside the JSON structure.`;
    const result = await geminiModel.generateContent(jsonPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response to ensure it's valid JSON
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    
    return JSON.parse(cleanText) as T;
  } catch (error) {
    console.error('Gemini JSON Generation Error:', error);
    throw new Error('Failed to generate JSON with Gemini API');
  }
}
