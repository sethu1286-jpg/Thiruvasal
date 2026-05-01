/* eslint-disable */
import React, { createContext, useContext, useEffect, useState } from "react";
import { subscribeToAuth, getUserProfile, logoutUser } from "../services/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    try {
      unsubscribe = subscribeToAuth(async (firebaseUser) => {
        try {
          if (firebaseUser) {
            setUser(firebaseUser);
            const { profile: p } = await getUserProfile(firebaseUser.uid);
            setProfile(p);
          } else {
            setUser(null);
            setProfile(null);
          }
        } catch (err) {
          console.error("Auth error:", err);
          setUser(null);
          setProfile(null);
        } finally {
          setLoading(false);
        }
      });
    } catch (err) {
      console.error("Firebase error:", err);
      setLoading(false);
    }
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      isAdmin: profile?.role === "admin",
      isDonor: profile?.role === "donor",
      logout,
      setProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
