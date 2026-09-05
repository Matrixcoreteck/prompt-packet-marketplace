import { useCallback, useEffect, useState } from "react";

// Buyer favorites / saved products, scoped to the signed-in account:
// `favorite:<userId>:<packId>` = "1". Persists in the browser via the
// existing window.storage shim — no backend yet.
export function useFavorites(userId) {
  const [favorites, setFavorites] = useState(new Set());

  const load = useCallback(async () => {
    if (!userId) {
      setFavorites(new Set());
      return;
    }
    try {
      const prefix = `favorite:${userId}:`;
      const list = await window.storage.list(prefix, false);
      if (list && list.keys) {
        setFavorites(new Set(list.keys.map((k) => k.slice(prefix.length)).filter(Boolean)));
      }
    } catch (e) {
      /* no favorites yet */
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFavorite = useCallback(
    async (packId) => {
      if (!userId || !packId) return;
      const key = `favorite:${userId}:${packId}`;
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(packId)) {
          next.delete(packId);
          window.storage.delete(key, false).catch(() => {});
        } else {
          next.add(packId);
          window.storage.set(key, "1", false).catch(() => {});
        }
        return next;
      });
    },
    [userId]
  );

  return { favorites, toggleFavorite };
}
