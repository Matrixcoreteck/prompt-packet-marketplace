import { useCallback, useEffect, useState } from "react";

// Tracks products the buyer has unlocked. Each purchase is stored under
// `purchase:<id>`. Legacy entries are the string "1"; newer entries store a
// small record `{ purchasedAt, pricePaid }`. Both are recognized as "owned"
// so existing purchase records keep working.
//
// `owned` is a Set of product ids (backward-compatible with everywhere that
// already calls `owned.has(id)`). `records` is a map of id -> purchase detail
// used by the Library's purchase history.
export function usePurchases() {
  const [owned, setOwned] = useState(new Set());
  const [records, setRecords] = useState({});

  const load = useCallback(async () => {
    try {
      const list = await window.storage.list("purchase:", false);
      if (!list || !list.keys) return;
      const nextOwned = new Set();
      const nextRecords = {};
      for (const key of list.keys) {
        const id = key.replace("purchase:", "");
        nextOwned.add(id);
        try {
          const res = await window.storage.get(key, false);
          const val = res && res.value;
          if (val && typeof val === "object") {
            nextRecords[id] = {
              purchasedAt: val.purchasedAt || null,
              pricePaid: val.pricePaid != null ? val.pricePaid : null,
            };
          } else {
            // legacy "1" entry — owned, but no purchase detail
            nextRecords[id] = { purchasedAt: null, pricePaid: null };
          }
        } catch {
          nextRecords[id] = { purchasedAt: null, pricePaid: null };
        }
      }
      setOwned(nextOwned);
      setRecords(nextRecords);
    } catch (e) {
      /* no purchases yet */
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const purchase = async (packId, pricePaid) => {
    const record = {
      purchasedAt: new Date().toISOString(),
      pricePaid: pricePaid != null ? pricePaid : null,
    };
    await window.storage.set("purchase:" + packId, record, false);
    setOwned((prev) => new Set([...prev, packId]));
    setRecords((prev) => ({ ...prev, [packId]: record }));
  };

  return { owned, records, purchase };
}
