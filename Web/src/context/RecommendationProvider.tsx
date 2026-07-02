import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { RecommendationResponse } from "../types";
import { RecommendationContext } from "./recommendation-context";

const STORAGE_KEY = "car-dekho-recommendations";

function loadInitial(): RecommendationResponse | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RecommendationResponse) : null;
  } catch {
    return null;
  }
}

export function RecommendationProvider({ children }: { children: ReactNode }) {
  const [result, setResultState] = useState<RecommendationResponse | null>(
    loadInitial
  );

  const setResult = useCallback((next: RecommendationResponse | null) => {
    setResultState(next);
    try {
      if (next) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const value = useMemo(() => ({ result, setResult }), [result, setResult]);

  return (
    <RecommendationContext.Provider value={value}>
      {children}
    </RecommendationContext.Provider>
  );
}
