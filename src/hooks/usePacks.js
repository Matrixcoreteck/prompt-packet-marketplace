import { useCallback, useEffect, useState } from "react";
import { STARTER_PACKS, normalizePack } from "../data/marketplace";

export function usePacks() {
  const [packs, setPacks] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const list = await window.storage.list("pack:", true);
      if (!list || !list.keys || list.keys.length === 0) {
        setPacks(STARTER_PACKS);
        return;
      }
      const loaded = [];
      for (const key of list.keys) {
        try {
          const res = await window.storage.get(key, true);
          if (res && res.value) loaded.push(JSON.parse(res.value));
        } catch (e) {
          /* skip unreadable entry */
        }
      }
      setPacks(loaded.length ? loaded.map(normalizePack) : STARTER_PACKS);
    } catch (e) {
      setError("Couldn't load the catalog. Showing sample packs instead.");
      setPacks(STARTER_PACKS);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addPack = async (pack) => {
    const id = "pack-" + Date.now();
    const record = normalizePack({ ...pack, id });
    await window.storage.set("pack:" + id, JSON.stringify(record), true);
    setPacks((prev) => [record, ...(prev || [])]);
    return record;
  };

  return { packs, addPack, error };
}
