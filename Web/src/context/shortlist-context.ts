import { createContext, useContext } from "react";
import type { ICar } from "../types";

export interface ShortlistContextValue {
  items: ICar[];
  loading: boolean;
  error: string | null;
  isShortlisted: (carId: string) => boolean;
  toggleShortlist: (car: ICar) => Promise<void>;
  removeFromShortlist: (carId: string) => Promise<void>;
  clearShortlist: () => Promise<void>;
}

export const ShortlistContext = createContext<ShortlistContextValue | null>(
  null
);

export function useShortlist(): ShortlistContextValue {
  const ctx = useContext(ShortlistContext);
  if (!ctx) {
    throw new Error("useShortlist must be used within a ShortlistProvider");
  }
  return ctx;
}
