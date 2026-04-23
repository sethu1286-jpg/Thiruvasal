// src/context/AuthContext.js
// Global authentication context — wraps entire app

import React, { createContext, useContext, useEffect, useState } from "react";
import { subscribeToAuth, getUserProfile, logoutUser } from "../services/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Firebase auth user
  const [profile, setProfile] = useState(null); // Firestore user profile
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase auth state
    const unsubscribe = subscribeToAuth(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch full profile from Firestore
        const { profile: p } = await getUserProfile(firebaseUser.uid);
        setProfile(p);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe; // cleanup on unmount
  }, []);

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
  };

  const isAdmin = profile?.role === "admin";
  const isDonor = profile?.role === "donor";

  const value = {
    user,
    profile,
    loading,
    isAdmin,
    isDonor,
    logout,
    setProfile, // allow profile update after registration
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/** Custom hook to consume auth context anywhere in the app */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
