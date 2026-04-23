// src/hooks/useBusinesses.js
// Custom hook — subscribes to Firestore businesses in real time

import { useEffect, useState } from "react";
import { subscribeToBusinesses } from "../services/firebase";

export function useBusinesses() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const unsub = subscribeToBusinesses((data) => {
      setBusinesses(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const premium = businesses.filter((b) => b.plan === "paid");
  const free    = businesses.filter((b) => b.plan === "free");

  return { businesses, premium, free, loading };
}
