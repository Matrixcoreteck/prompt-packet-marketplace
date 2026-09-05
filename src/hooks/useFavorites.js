import { useCallback, useEffect, useState } from "react";

// Buyer favorites / saved products. Each favorite is stored under
// `favorite:<id>` = "1" using the existing window.storage shim, so favorites
// persist in the browser without a backend. Returns the set of favorite ids
// plus a toggle helper.
export function useFavorites() {
  const [favorites, setFavorites] = useState(new Set());

  const load = useCallback(async () => {
    try {
      const list = await window.storage.list("favorite:", false);
      if (list && list.keys) {
        setFavorites(new Set(list.keys.map((k) => k.replace("favorite:", ""))));
      }
    } catch (e) {
      /* no favorites yet */
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFavorite = useCallback(async (packId) => {
    const key = "favorite:" + packId;
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
  }, []);

  return { favorites, toggleFavorite };
}
