import { useCallback, useEffect, useState } from "react";

// Tracks the products a buyer has recently opened, stored locally under the
// `recentlyViewed` key as an ordered array of ids (most recent first). Kept
// lightweight — no analytics, just an ordered list capped at 12 entries.
export function useRecentlyViewed() {
  const [recentIds, setRecentIds] = useState([]);

  const load = useCallback(async () => {
    try {
      const res = await window.storage.get("recentlyViewed", false);
      const val = res && res.value;
      if (Array.isArray(val)) setRecentIds(val);
    } catch (e) {
      /* nothing yet */
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markViewed = useCallback(async (packId) => {
    if (!packId) return;
    setRecentIds((prev) => {
      const next = [packId, ...prev.filter((id) => id !== packId)].slice(0, 12);
      window.storage.set("recentlyViewed", next, false).catch(() => {});
      return next;
    });
  }, []);

  return { recentIds, markViewed };
}
