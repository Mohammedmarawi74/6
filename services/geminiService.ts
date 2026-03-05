
import { GoogleGenAI, Type } from "@google/genai";
import { SlideData, ThemeMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCarouselContent = async (topic: string): Promise<SlideData[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `أنشئ محتوى لكاروسيل احترافي باللغة العربية حول موضوع: "${topic}". 
    يجب أن يتكون الكاروسيل من 5 شرائح.
    الشريحة الأولى: عنوان جذاب.
    الشرائح الوسطى: نصائح أو خطوات.
    الشريحة الأخيرة: دعوة لاتخاذ إجراء (Call to Action).
    اجعل الأسلوب تقني واحترافي.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            highlightedWord: { type: Type.STRING },
            ctaText: { type: Type.STRING },
            theme: { type: Type.STRING, enum: ["light", "dark"] },
          },
          required: ["id", "title", "description", "theme"],
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data.map((item: any) => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      footerUrl: "yourbrand.com",
      logoText: "براندك",
    }));
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    return [];
  }
};
