// src/hooks/useDonors.js
// Custom hook — subscribes to Firestore donors in real time

import { useEffect, useState } from "react";
import { subscribeToDonors } from "../services/firebase";

export function useDonors() {
  const [donors, setDonors]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToDonors((data) => {
      setDonors(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const paid    = donors.filter((d) => d.status === "paid");
  const pending = donors.filter((d) => d.status === "pending");
  const total   = paid.reduce((s, d) => s + (d.amount || 0), 0);

  return { donors, paid, pending, total, loading };
}
