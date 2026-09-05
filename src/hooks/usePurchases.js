import { useCallback, useEffect, useState } from "react";

// Tracks products the buyer has unlocked. Purchases are scoped to the
// signed-in account: `purchase:<userId>:<packId>`. Legacy pre-account
// records are claimed into the first account that signs in (see
// authService.claimLegacyData), so demo purchases carry over safely.
//
// `owned` stays a Set of product ids (backward-compatible with everywhere
// that already calls `owned.has(id)`). `records` maps id -> purchase detail
// for the Library's purchase history.
export function usePurchases(userId) {
  const [owned, setOwned] = useState(new Set());
  const [records, setRecords] = useState({});

  const load = useCallback(async () => {
    if (!userId) {
      setOwned(new Set());
      setRecords({});
      return;
    }
    try {
      const prefix = `purchase:${userId}:`;
      const list = await window.storage.list(prefix, false);
      if (!list || !list.keys) return;
      const nextOwned = new Set();
      const nextRecords = {};
      for (const key of list.keys) {
        const packId = key.slice(prefix.length);
        if (!packId) continue;
        nextOwned.add(packId);
        try {
          const res = await window.storage.get(key, false);
          const val = res && res.value;
          nextRecords[packId] =
            val && typeof val === "object"
              ? { purchasedAt: val.purchasedAt || null, pricePaid: val.pricePaid != null ? val.pricePaid : null }
              : { purchasedAt: null, pricePaid: null };
        } catch {
          nextRecords[packId] = { purchasedAt: null, pricePaid: null };
        }
      }
      setOwned(nextOwned);
      setRecords(nextRecords);
    } catch (e) {
      /* no purchases yet */
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const purchase = async (packId, pricePaid) => {
    if (!userId) return;
    const record = {
      purchasedAt: new Date().toISOString(),
      pricePaid: pricePaid != null ? pricePaid : null,
    };
    await window.storage.set(`purchase:${userId}:${packId}`, record, false);
    setOwned((prev) => new Set([...prev, packId]));
    setRecords((prev) => ({ ...prev, [packId]: record }));
  };

  return { owned, records, purchase };
}
