import { GoogleGenAI, Type } from "@google/genai";
import { TextAnalysisResult, ImageAnalysisResult } from "../types";

// Helper to clean Markdown JSON
const cleanJSON = (text: string) => {
  if (!text) return "";
  return text.replace(/```json\n?/g, "").replace(/```/g, "").trim();
};

export const analyzeTextMisinformation = async (text: string): Promise<TextAnalysisResult> => {
  // Initialize inside function to ensure env var is ready
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const modelId = "gemini-2.5-flash"; 
    
    // We strictly define the expected JSON structure in the prompt string 
    const jsonStructure = JSON.stringify({
      trustScore: 85, // Example: 0 (Fake) to 100 (True)
      label: "FAKE NEWS | REAL | SATIRE | MISLEADING",
      summary: "Short summary",
      category: "Category Name",
      evidenceStrength: "No Evidence | Weak | Strong Contradiction | Verified Truth",
      explanation: "Simple English explanation...",
      consensusAnalysis: "Channel A says X, Channel B says Y. Majority says Z.",
      substantiatedFacts: ["fact 1", "fact 2"],
      falseClaims: ["fake claim 1"],
      missingContext: "Context info...",
      safetyTips: ["Tip 1", "Tip 2", "Tip 3"]
    }, null, 2);

    const response = await ai.models.generateContent({
      model: modelId,
      contents: text,
      config: {
        systemInstruction: `
          You are Veritas AI, a strict fact-checking engine.
          
          YOUR GOAL:
          Analyze the text for misinformation, propaganda, fake news, and imaginary surveys. 
          Use SIMPLE ENGLISH suitable for a general audience.
          
          CRITICAL SCORING RULES:
          - **trustScore**: Integer 0-100.
            - **100**: Verified Truth / Fact / Real News from reputable sources.
            - **80-99**: Mostly True / Likely Real.
            - **50-79**: Mixed / Missing Context / Unverified.
            - **0-49**: Fake News / Propaganda / Satire / False.
          
          REQUIREMENTS:
          1. **Check Top Trusted Sources**: Verify against major global news agencies (Reuters, AP, BBC, CNN, NYT, Al Jazeera, etc.).
          2. **Analyze Consensus (CRITICAL)**: 
             - Check if different channels are reporting different things.
             - If there is a conflict, explicitly state: "Some sources (e.g., [Source A]) report [X], while others (e.g., [Source B]) report [Y]. However, the majority consensus is [Z]."
             - If all sources agree, state that the consensus is unanimous.
             - If only obscure/unreliable sources are reporting it, flag it.
          3. **Detect Categories**: Classify into categories like "Political Propaganda", "Health Misinformation", "Viral Social Media Rumor", "Scam/Phishing", "Satire", or "Legitimate News".
          4. **Evidence Strength**: Determine if there is evidence to support or refute the claims.
          5. **Safety Tips**: Give 3 specific tips to the user on how they can verify this specific type of content themselves.
          
          OUTPUT FORMAT:
          Return strictly valid JSON matching this structure. Do not include markdown code blocks.
          ${jsonStructure}
        `,
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = response.text || "";
    
    let parsedData;
    try {
        parsedData = JSON.parse(cleanJSON(rawText));
    } catch (e) {
        console.error("JSON Parse Error", e, rawText);
        throw new Error("Failed to parse AI response.");
    }

    // Extract grounding metadata (sources)
    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingChunks = rawChunks.map((chunk: any) => ({
      web: chunk.web ? {
        uri: chunk.web.uri || '',
        title: chunk.web.title || ''
      } : undefined
    })).filter((c: any) => c.web);

    // Merge parsed data with defaults to ensure type safety
    return {
      trustScore: typeof parsedData.trustScore === 'number' ? parsedData.trustScore : 0,
      label: parsedData.label || "UNKNOWN",
      summary: parsedData.summary || "Analysis incomplete.",
      category: parsedData.category || "General",
      evidenceStrength: parsedData.evidenceStrength || "No Evidence",
      explanation: parsedData.explanation || "Could not generate explanation.",
      consensusAnalysis: parsedData.consensusAnalysis || "No consensus data available.",
      substantiatedFacts: Array.isArray(parsedData.substantiatedFacts) ? parsedData.substantiatedFacts : [],
      falseClaims: Array.isArray(parsedData.falseClaims) ? parsedData.falseClaims : [],
      missingContext: parsedData.missingContext || "",
      safetyTips: Array.isArray(parsedData.safetyTips) ? parsedData.safetyTips : [],
      groundingChunks
    };

  } catch (error) {
    console.error("Text analysis failed:", error);
    throw error;
  }
};

export const analyzeImageAI = async (base64Image: string, mimeType: string): Promise<ImageAnalysisResult> => {
  // Initialize inside function
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const modelId = "gemini-2.5-flash"; 
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: `You are a hostile, hyper-critical digital forensics expert.
            
            YOUR TASK: Detect modern, high-quality AI generation (Midjourney v6, DALL-E 3, Flux).
            These models create "perfect" images that often fool casual observers.
            
            BE EXTREMELY SKEPTICAL. If an image looks "too perfect", "cinematic", or "smooth", it is likely AI.

            Analyze specifically for:
            1. **Hyper-Realism & "Plastic" Skin**: Does skin look too smooth, glowing, or pore-less?
            2. **Perfect Lighting**: Is the lighting dramatically cinematic with no logical source?
            3. **Background Logic**: Are background objects blurry in a non-optical way, or do they merge into each other?
            4. **Text/Details**: Are small background text or patterns slightly garbled?
            5. **Anatomy**: Look closely at fingers, teeth, and ear shapes.

            SCORING (aiLikelihood):
            - **90-100**: Obvious AI (artifacts, bad hands, impossible physics).
            - **70-89**: High Quality AI (too smooth, perfect lighting, "Midjourney look").
            - **30-69**: Ambiguous / Heavily Filtered.
            - **0-29**: Authentic Raw Photo (camera noise, imperfections, bad lighting).

            Explain your "Confidence Score" clearly.
            
            Return JSON.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiLikelihood: { type: Type.NUMBER, description: "Probability 0-100 that image is AI." },
            verdict: { type: Type.STRING, description: "Main Verdict e.g. 'LIKELY AI', 'REAL PHOTO'" },
            confidence: { type: Type.STRING, description: "High, Medium, Low" },
            visualArtifacts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of flaws found." },
            reasoning: { type: Type.STRING, description: "Detailed explanation of the confidence score and findings." }
          },
          required: ["aiLikelihood", "verdict", "confidence", "visualArtifacts", "reasoning"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from model");

    const result = JSON.parse(jsonText) as ImageAnalysisResult;
    return result;

  } catch (error) {
    console.error("Image analysis failed:", error);
    throw error;
  }
};