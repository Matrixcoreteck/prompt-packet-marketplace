import { useCallback, useEffect, useState } from "react";
import {
  loadSession,
  signUp as signUpSvc,
  logIn as logInSvc,
  logOut as logOutSvc,
  updateDisplayName as updateDisplayNameSvc,
  setCreatorName as setCreatorNameSvc,
} from "../auth/authService";

// Auth state for the app. `user` is:
//   undefined  — still loading the session
//   null       — logged out
//   { ... }    — the signed-in account (never contains password material)
export function useAuth() {
  const [user, setUser] = useState(undefined);
  const [busy, setBusy] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    loadSession()
      .then((u) => setUser(u))
      .catch(() => setUser(null));
  }, []);

  const signUp = useCallback(async (email, password, displayName) => {
    setBusy(true);
    setAuthError(null);
    try {
      const u = await signUpSvc(email, password, displayName);
      setUser(u);
      return u;
    } catch (e) {
      setAuthError(e.message);
      return null;
    } finally {
      setBusy(false);
    }
  }, []);

  const logIn = useCallback(async (email, password) => {
    setBusy(true);
    setAuthError(null);
    try {
      const u = await logInSvc(email, password);
      setUser(u);
      return u;
    } catch (e) {
      setAuthError(e.message);
      return null;
    } finally {
      setBusy(false);
    }
  }, []);

  const logOut = useCallback(async () => {
    await logOutSvc();
    setUser(null);
    setAuthError(null);
  }, []);

  const updateDisplayName = useCallback(
    async (name) => {
      try {
        const u = await updateDisplayNameSvc(user.id, name);
        setUser(u);
        return u;
      } catch (e) {
        setAuthError(e.message);
        return null;
      }
    },
    [user]
  );

  const setCreatorName = useCallback(
    async (name) => {
      try {
        const u = await setCreatorNameSvc(user.id, name);
        setUser(u);
        return u;
      } catch (e) {
        setAuthError(e.message);
        return null;
      }
    },
    [user]
  );

  const clearAuthError = useCallback(() => setAuthError(null), []);

  return { user, busy, authError, signUp, logIn, logOut, updateDisplayName, setCreatorName, clearAuthError };
}
