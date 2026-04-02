
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIGroundedSearch = async (query: string, products: Product[]) => {
  try {
    const context = JSON.stringify(products.map(p => ({ id: p.id, name: p.name, category: p.category, description: p.description })));
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert shopping assistant for SubKuch.pk. 
      Users search for products using natural language.
      Query: "${query}"
      Available Products: ${context}
      
      Task: Return a JSON array of product IDs that best match the query. Order them by relevance. 
      If no match is found, return an empty array [].
      Only return the JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const matchedIds: string[] = JSON.parse(response.text || "[]");
    return products.filter(p => matchedIds.includes(p.id));
  } catch (error) {
    console.error("Gemini Search Error:", error);
    // Fallback to simple string matching
    return products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.category.toLowerCase().includes(query.toLowerCase())
    );
  }
};

export const getProductRecommendation = async (product: Product, allProducts: Product[]) => {
  try {
    const context = JSON.stringify(allProducts.filter(p => p.id !== product.id).map(p => ({ id: p.id, name: p.name, category: p.category })));
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the product "${product.name}" in category "${product.category}", suggest 3 relevant items from this list: ${context}.
      Return a JSON array of exactly 3 product IDs.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    const suggestedIds: string[] = JSON.parse(response.text || "[]");
    return allProducts.filter(p => suggestedIds.includes(p.id));
  } catch (error) {
    return allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
  }
};
