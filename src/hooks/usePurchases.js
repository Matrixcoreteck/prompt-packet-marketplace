import { useCallback, useEffect, useState } from "react";

export function usePurchases() {
  const [owned, setOwned] = useState(new Set());

  const load = useCallback(async () => {
    try {
      const list = await window.storage.list("purchase:", false);
      if (list && list.keys) {
        setOwned(new Set(list.keys.map((k) => k.replace("purchase:", ""))));
      }
    } catch (e) {
      /* no purchases yet */
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const purchase = async (packId) => {
    await window.storage.set("purchase:" + packId, "1", false);
    setOwned((prev) => new Set([...prev, packId]));
  };

  return { owned, purchase };
}
