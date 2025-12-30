import { GoogleGenAI } from "@google/genai";
import { Movie, WizardState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRecommendationReason = async (
  movie: Movie,
  criteria: WizardState,
  lang: 'en' | 'ar' = 'en'
): Promise<string> => {
  const modelId = "gemini-3-flash-preview";
  
  const prompt = lang === 'ar' ? `
    أنت ناقد سينمائي ذكي، مطلع على الثقافة الشعبية، وتتحدث بأسلوب مشوق.
    المستخدم في حالة مزاجية: "${criteria.mood?.label}".
    يريد شيئاً من ثقافة: "${criteria.region?.label}".
    لديه وقت لـ: "${criteria.time?.label}".
    
    قمنا بترشيح: "${movie.title || movie.name}".
    نبذة عن العمل: "${movie.overview}".
    
    اكتب سبباً قصيراً جداً (حد أقصى جملتين)، بأسلوب قوي ومقنع يشرح لماذا هذا العمل هو الخيار الأمثل.
    ابدأ بـ "نسبة التطابق: 98% لأن..." أو ما شابه.
    يجب أن يكون النص باللغة العربية بلهجة نقدية ممتعة وغير مملة.
  ` : `
    You are a witty, pop-culture-savvy film critic.
    User Mood: "${criteria.mood?.label}".
    Cultural interest: "${criteria.region?.label}".
    Time budget: "${criteria.time?.label}".
    
    Recommendation: "${movie.title || movie.name}".
    Overview: "${movie.overview}".
    
    Write a very short reasoning (max 2 sentences) in a punchy, persuasive style explaining why this is a perfect match.
    Start with "Match score: 98% because..." or something similar.
    The tone should be professional yet entertaining. Response language must be English.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || (lang === 'ar' ? "خيار رائع يتناسب مع مزاجك الحالي تماماً." : "A brilliant choice that perfectly matches your current vibe.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return lang === 'ar' ? "خيار رائع يتناسب مع مزاجك الحالي." : "An excellent choice perfectly suited to your mood.";
  }
};