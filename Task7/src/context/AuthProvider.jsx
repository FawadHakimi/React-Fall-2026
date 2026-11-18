import { useState, useEffect, useCallback, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import {
  subscribeToAuth,
  signupWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  getAuthErrorMessage,
} from "../services/authService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToAuth(
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      },
      (err) => {
        setError(getAuthErrorMessage(err));
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const clearError = useCallback(() => setError(""), []);

  const run = useCallback(async (action) => {
    setError("");
    try {
      await action();
      return true;
    } catch (err) {
      setError(getAuthErrorMessage(err));
      return false;
    }
  }, []);

  const signup = useCallback(
    (email, password) => run(() => signupWithEmail(email, password)),
    [run],
  );
  const login = useCallback(
    (email, password) => run(() => loginWithEmail(email, password)),
    [run],
  );
  const loginGoogle = useCallback(() => run(() => loginWithGoogle()), [run]);
  const logout = useCallback(() => run(() => logoutUser()), [run]);

  const value = useMemo(
    () => ({ user, loading, error, clearError, signup, login, loginGoogle, logout }),
    [user, loading, error, clearError, signup, login, loginGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}