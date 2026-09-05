// Account layer for The Prompt Index.
//
// This app has no backend yet, so accounts live in the browser via the same
// window.storage shim the rest of the app uses. Passwords are NEVER stored in
// plain text — only a salted SHA-256 hash, which is never returned to the UI.
// The session is a plain userId marker (no tokens, no password material).
//
// The API mirrors what a real auth provider offers (signUp / logIn / logOut /
// session / profile update), so this file can be swapped for a real backend
// (Supabase, Base44 auth, etc.) later without touching any component code.

const SESSION_KEY = "authSession";
const ACCOUNT_PREFIX = "account:";
const INDEX_KEY = "accountIndex";

async function sha256Hex(text) {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Fallback for non-secure contexts (should not happen in the preview).
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return `fnv-${h.toString(16)}-${text.length}`;
}

function randomSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Never expose password material to the app — strip it here.
function sanitize(account) {
  if (!account) return null;
  return {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
    createdAt: account.createdAt,
    creatorName: account.creatorName || null,
  };
}

async function getIndex() {
  const res = await window.storage.get(INDEX_KEY, false);
  return res && res.value && typeof res.value === "object" ? res.value : {};
}

async function getAccount(id) {
  const res = await window.storage.get(ACCOUNT_PREFIX + id, false);
  return res && res.value && typeof res.value === "object" ? res.value : null;
}

async function setSession(userId) {
  await window.storage.set(SESSION_KEY, { userId, startedAt: new Date().toISOString() }, false);
}

export async function loadSession() {
  try {
    const res = await window.storage.get(SESSION_KEY, false);
    const s = res && res.value;
    if (!s || !s.userId) return null;
    const account = await getAccount(s.userId);
    if (!account) {
      await window.storage.delete(SESSION_KEY, false);
      return null;
    }
    return sanitize(account);
  } catch {
    return null;
  }
}

export async function signUp(email, password, displayName) {
  const cleanEmail = (email || "").trim().toLowerCase();
  const name = (displayName || "").trim();
  if (!cleanEmail || !password || !name) throw new Error("All fields are required.");
  const index = await getIndex();
  if (index[cleanEmail]) throw new Error("An account with this email already exists. Try logging in.");
  const id = "user-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  const salt = randomSalt();
  const hash = await sha256Hex(salt + ":" + password);
  const account = {
    id,
    email: cleanEmail,
    displayName: name,
    createdAt: new Date().toISOString(),
    passwordSalt: salt,
    passwordHash: hash,
    creatorName: null,
  };
  await window.storage.set(ACCOUNT_PREFIX + id, account, false);
  await window.storage.set(INDEX_KEY, { ...index, [cleanEmail]: id }, false);
  await setSession(id);
  await claimLegacyData(id);
  return sanitize(account);
}

export async function logIn(email, password) {
  const cleanEmail = (email || "").trim().toLowerCase();
  const index = await getIndex();
  const id = index[cleanEmail];
  const account = id ? await getAccount(id) : null;
  if (!account) throw new Error("No account found with this email. Create one first.");
  const hash = await sha256Hex(account.passwordSalt + ":" + password);
  if (hash !== account.passwordHash) throw new Error("Incorrect email or password.");
  await setSession(id);
  await claimLegacyData(id);
  return sanitize(account);
}

export async function logOut() {
  await window.storage.delete(SESSION_KEY, false);
}

export async function updateDisplayName(userId, name) {
  const account = await getAccount(userId);
  if (!account) throw new Error("Account not found.");
  account.displayName = name.trim();
  await window.storage.set(ACCOUNT_PREFIX + userId, account, false);
  return sanitize(account);
}

// Set once, on the user's first published product. After that the creator
// identity is locked to the account — no retyping, and every product from
// the same account points at the same creator identity.
export async function setCreatorName(userId, name) {
  const account = await getAccount(userId);
  if (!account) throw new Error("Account not found.");
  if (!account.creatorName) {
    account.creatorName = name.trim();
    await window.storage.set(ACCOUNT_PREFIX + userId, account, false);
  }
  return sanitize(account);
}

// One-time migration: the pre-account demo kept purchases, favorites,
// recently-viewed and the builder draft in global keys. The first account
// to sign in on this browser claims them, so the demo experience carries
// over cleanly — and from then on data is scoped per user, never mixed.
async function claimLegacyData(userId) {
  try {
    const purchases = await window.storage.list("purchase:", false);
    for (const key of purchases?.keys || []) {
      const packId = key.replace("purchase:", "");
      if (packId.includes(":")) continue; // already user-scoped
      const res = await window.storage.get(key, false);
      const val = res && res.value;
      const record =
        val && typeof val === "object"
          ? { purchasedAt: val.purchasedAt || null, pricePaid: val.pricePaid != null ? val.pricePaid : null }
          : { purchasedAt: null, pricePaid: null };
      await window.storage.set(`purchase:${userId}:${packId}`, record, false);
      await window.storage.delete(key, false);
    }
    const favs = await window.storage.list("favorite:", false);
    for (const key of favs?.keys || []) {
      const packId = key.replace("favorite:", "");
      if (packId.includes(":")) continue;
      await window.storage.set(`favorite:${userId}:${packId}`, "1", false);
      await window.storage.delete(key, false);
    }
    const rv = await window.storage.get("recentlyViewed", false);
    if (rv && Array.isArray(rv.value) && rv.value.length) {
      const mine = await window.storage.get(`recentlyViewed:${userId}`, false);
      if (!mine || !mine.value) await window.storage.set(`recentlyViewed:${userId}`, rv.value, false);
      await window.storage.delete("recentlyViewed", false);
    }
    const draft = await window.storage.get("draft:product", false);
    if (draft && draft.value) {
      const mine = await window.storage.get(`draft:product:${userId}`, false);
      if (!mine || !mine.value) await window.storage.set(`draft:product:${userId}`, draft.value, false);
      await window.storage.delete("draft:product", false);
    }
  } catch {
    /* migration is best-effort */
  }
}
