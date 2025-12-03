export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface TextAnalysisResult {
  trustScore: number; // 0-100
  label: string; // e.g., "FAKE NEWS", "TRUE", "MISLEADING"
  summary: string; // Short 1-2 line conclusion
  category: string; // e.g. "Health", "Politics", "Viral Post"
  evidenceStrength: 'No Evidence' | 'Weak' | 'Strong Contradiction' | 'Verified Truth';
  explanation: string; // Simple english explanation
  consensusAnalysis: string; // Comparison of different news sources
  substantiatedFacts: string[];
  falseClaims: string[];
  missingContext: string;
  safetyTips: string[]; // Specific tips for this content
  groundingChunks: GroundingChunk[];
}

export interface ImageAnalysisResult {
  aiLikelihood: number; // 0-100
  verdict: string;
  confidence: string;
  visualArtifacts: string[];
  reasoning: string;
}

export type AnalysisMode = 'text' | 'image';

export enum LoadingState {
  IDLE = 'idle',
  ANALYZING = 'analyzing',
  COMPLETE = 'complete',
  ERROR = 'error',
}