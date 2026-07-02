import { createContext, useContext } from "react";
import type { RecommendationResponse } from "../types";

export interface RecommendationContextValue {
  result: RecommendationResponse | null;
  setResult: (result: RecommendationResponse | null) => void;
}

export const RecommendationContext =
  createContext<RecommendationContextValue | null>(null);

export function useRecommendation(): RecommendationContextValue {
  const ctx = useContext(RecommendationContext);
  if (!ctx) {
    throw new Error(
      "useRecommendation must be used within a RecommendationProvider"
    );
  }
  return ctx;
}
