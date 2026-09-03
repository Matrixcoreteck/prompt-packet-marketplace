// window.storage only exists inside Claude.ai's artifact sandbox. Outside of
// that (like here, once this runs in Base44 or anywhere else), it doesn't
// exist at all — so this file provides a drop-in replacement using the
// browser's localStorage, just so the app keeps working while you're
// getting set up.
//
// IMPORTANT: this is a stand-in, not a real backend. Data saved here only
// lives in one browser, isn't shared between users, and isn't tied to real
// payments. Once you've got the Stripe/Supabase backend (or Base44's own
// data layer) running, replace calls to window.storage with real API calls
// instead of this shim.

if (typeof window !== "undefined" && !window.storage) {
  const read = () => {
    try {
      return JSON.parse(localStorage.getItem("__promptpacks_storage__") || "{}");
    } catch {
      return {};
    }
  };
  const write = (data) => {
    localStorage.setItem("__promptpacks_storage__", JSON.stringify(data));
  };
  const scopedKey = (key, shared) => (shared ? `shared:${key}` : `personal:${key}`);

  window.storage = {
    async get(key, shared = false) {
      const data = read();
      const k = scopedKey(key, shared);
      if (!(k in data)) return null;
      return { key, value: data[k], shared };
    },
    async set(key, value, shared = false) {
      const data = read();
      const k = scopedKey(key, shared);
      data[k] = value;
      write(data);
      return { key, value, shared };
    },
    async delete(key, shared = false) {
      const data = read();
      const k = scopedKey(key, shared);
      const existed = k in data;
      delete data[k];
      write(data);
      return { key, deleted: existed, shared };
    },
    async list(prefix = "", shared = false) {
      const data = read();
      const scopePrefix = shared ? "shared:" : "personal:";
      const keys = Object.keys(data)
        .filter((k) => k.startsWith(scopePrefix))
        .map((k) => k.slice(scopePrefix.length))
        .filter((k) => k.startsWith(prefix));
      return { keys, prefix, shared };
    },
  };
}
