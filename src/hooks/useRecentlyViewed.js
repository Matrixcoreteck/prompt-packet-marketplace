import { useCallback, useEffect, useState } from "react";

// Tracks the products a buyer has recently opened, scoped to the signed-in
// account and stored under `recentlyViewed:<userId>` as an ordered array of
// ids (most recent first). Lightweight — no analytics, capped at 12.
export function useRecentlyViewed(userId) {
  const [recentIds, setRecentIds] = useState([]);

  const load = useCallback(async () => {
    if (!userId) {
      setRecentIds([]);
      return;
    }
    try {
      const res = await window.storage.get(`recentlyViewed:${userId}`, false);
      const val = res && res.value;
      if (Array.isArray(val)) setRecentIds(val);
      else setRecentIds([]);
    } catch (e) {
      /* nothing yet */
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const markViewed = useCallback(
    async (packId) => {
      if (!userId || !packId) return;
      setRecentIds((prev) => {
        const next = [packId, ...prev.filter((id) => id !== packId)].slice(0, 12);
        window.storage.set(`recentlyViewed:${userId}`, next, false).catch(() => {});
        return next;
      });
    },
    [userId]
  );

  return { recentIds, markViewed };
}
