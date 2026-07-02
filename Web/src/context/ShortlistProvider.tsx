import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { ICar } from "../types";
import { ShortlistContext } from "./shortlist-context";
import {
  addShortlistItem,
  fetchShortlist,
  removeShortlistItem,
} from "../services/api";
import { getSessionId } from "../services/session";

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [sessionId] = useState(getSessionId);
  const [items, setItems] = useState<ICar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const cars = await fetchShortlist(sessionId);
        if (active) setItems(cars);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Failed to load shortlist."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [sessionId]);

  const isShortlisted = useCallback(
    (carId: string) => items.some((car) => car._id === carId),
    [items]
  );

  const addToShortlist = useCallback(
    async (car: ICar) => {
      setError(null);
      setItems((prev) =>
        prev.some((c) => c._id === car._id) ? prev : [car, ...prev]
      );
      try {
        await addShortlistItem(sessionId, car._id);
      } catch (err) {
        setItems((prev) => prev.filter((c) => c._id !== car._id));
        setError(
          err instanceof Error ? err.message : "Failed to add to shortlist."
        );
      }
    },
    [sessionId]
  );

  const removeFromShortlist = useCallback(
    async (carId: string) => {
      setError(null);
      const previous = items;
      setItems((prev) => prev.filter((c) => c._id !== carId));
      try {
        await removeShortlistItem(sessionId, carId);
      } catch (err) {
        setItems(previous);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to remove from shortlist."
        );
      }
    },
    [items, sessionId]
  );

  const toggleShortlist = useCallback(
    async (car: ICar) => {
      if (items.some((c) => c._id === car._id)) {
        await removeFromShortlist(car._id);
      } else {
        await addToShortlist(car);
      }
    },
    [items, addToShortlist, removeFromShortlist]
  );

  const clearShortlist = useCallback(async () => {
    setError(null);
    const previous = items;
    setItems([]);
    try {
      await Promise.all(
        previous.map((car) => removeShortlistItem(sessionId, car._id))
      );
    } catch (err) {
      setItems(previous);
      setError(
        err instanceof Error ? err.message : "Failed to clear shortlist."
      );
    }
  }, [items, sessionId]);

  const value = useMemo(
    () => ({
      items,
      loading,
      error,
      isShortlisted,
      toggleShortlist,
      removeFromShortlist,
      clearShortlist,
    }),
    [
      items,
      loading,
      error,
      isShortlisted,
      toggleShortlist,
      removeFromShortlist,
      clearShortlist,
    ]
  );

  return (
    <ShortlistContext.Provider value={value}>
      {children}
    </ShortlistContext.Provider>
  );
}
