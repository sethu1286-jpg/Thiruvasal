/* eslint-disable */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo
} from "react";

import {
  subscribeToAuth,
  getUserProfile,
  logoutUser
} from "../services/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = subscribeToAuth(async (firebaseUser) => {
      if (!isMounted) return;

      try {
        if (firebaseUser) {
          setUser(firebaseUser);

          // ✅ Fetch profile safely
          try {
            const { profile: p } = await getUserProfile(firebaseUser.uid);
            if (isMounted) setProfile(p || {});
          } catch (err) {
            console.error("Profile fetch error:", err);
            if (isMounted) setProfile({});
          }

        } else {
          setUser(null);
          setProfile(null);
        }

      } catch (err) {
        console.error("Auth error:", err);
        if (isMounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe && unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setProfile(null);
    }
  };

  // ✅ Memoized context value (performance boost)
  const value = useMemo(() => ({
    user,
    profile,
    loading,

    isAdmin: profile?.role === "admin",
    isDonor: profile?.role === "donor",

    logout,
    setProfile,
  }), [user, profile, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
