// ═══════════════════════════════════════════════════════
// Firebase v10 — Clean + Production Ready Service Layer
// ═══════════════════════════════════════════════════════

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

// ──────────────────────────────────────────────────────
// ENV CONFIG (SECURE)
// ──────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
  throw new Error("❌ Firebase env variables missing");
}

// ──────────────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────────────
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// ═══════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════

export async function registerUser({ name, phone, email, password, role = "donor" }) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(cred.user, { displayName: name });

    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      name,
      phone,
      email,
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { user: cred.user, error: null };
  } catch (e) {
    return { user: null, error: mapError(e.code) };
  }
}

export async function loginUser({ email, password }) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { user: cred.user, error: null };
  } catch (e) {
    return { user: null, error: mapError(e.code) };
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (e) {
    return { error: e.message };
  }
}

export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(uid) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists()
      ? { profile: snap.data(), error: null }
      : { profile: null, error: "User not found" };
  } catch (e) {
    return { profile: null, error: e.message };
  }
}

// ═══════════════════════════════════════════════════════
// DONORS
// ═══════════════════════════════════════════════════════

export async function addDonor(data) {
  try {
    const ref = await addDoc(collection(db, "donors"), {
      ...data,
      amount: Number(data.amount) || 0,
      status: "pending",
      confirmedAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { id: ref.id, error: null };
  } catch (e) {
    return { id: null, error: e.message };
  }
}

export function subscribeToDonors(callback) {
  const q = query(collection(db, "donors"), orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    },
    (err) => {
      console.error("Donor subscription error:", err);
      callback([]);
    }
  );
}

export async function updateDonorStatus(id, status) {
  try {
    await updateDoc(doc(db, "donors", id), {
      status,
      confirmedAt: status === "paid" ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (e) {
    return { error: e.message };
  }
}

export async function deleteDonor(id) {
  try {
    await deleteDoc(doc(db, "donors", id));
    return { error: null };
  } catch (e) {
    return { error: e.message };
  }
}

// ═══════════════════════════════════════════════════════
// BUSINESS
// ═══════════════════════════════════════════════════════

export async function addBusiness(data) {
  try {
    const ref = await addDoc(collection(db, "businesses"), {
      ...data,
      isActive: true,
      plan: data.plan || "free",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { id: ref.id, error: null };
  } catch (e) {
    return { id: null, error: e.message };
  }
}

export function subscribeToBusinesses(callback) {
  const q = query(
    collection(db, "businesses"),
    where("isActive", "==", true),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    },
    (err) => {
      console.error("Business subscription error:", err);
      callback([]);
    }
  );
}

export async function toggleBusiness(id, isActive) {
  try {
    await updateDoc(doc(db, "businesses", id), {
      isActive,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (e) {
    return { error: e.message };
  }
}

// ═══════════════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════════════

export async function getDashboardStats() {
  try {
    const [donorSnap, bizSnap] = await Promise.all([
      getDocs(collection(db, "donors")),
      getDocs(query(collection(db, "businesses"), where("isActive", "==", true))),
    ]);

    const donors = donorSnap.docs.map((d) => d.data());

    const paid = donors.filter((d) => d.status === "paid");
    const pending = donors.filter((d) => d.status === "pending");

    return {
      stats: {
        totalDonors: donors.length,
        paidCount: paid.length,
        pendingCount: pending.length,
        totalCollection: paid.reduce((s, d) => s + (d.amount || 0), 0),
        businessCount: bizSnap.size,
      },
      error: null,
    };
  } catch (e) {
    return { stats: null, error: e.message };
  }
}

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════

function mapError(code) {
  const m = {
    "auth/email-already-in-use": "இந்த மின்னஞ்சல் ஏற்கனவே உள்ளது",
    "auth/user-not-found": "பயனர் இல்லை",
    "auth/wrong-password": "தவறான கடவுச்சொல்",
    "auth/invalid-email": "தவறான மின்னஞ்சல்",
    "auth/weak-password": "குறைந்தபட்சம் 6 எழுத்துகள் வேண்டும்",
    "auth/network-request-failed": "நெட்வொர்க் பிழை",
  };
  return m[code] || "பிழை ஏற்பட்டது";
}

export function formatDate(ts) {
  if (!ts) return "—";
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("ta-IN");
}

export function shouldSendReminder(dateStr) {
  if (!dateStr) return null;

  const today = new Date();
  const d = new Date(dateStr);

  today.setHours(0,0,0,0);
  d.setHours(0,0,0,0);

  const diff = Math.round((d - today) / (1000 * 60 * 60 * 24));

  if (diff === 30) return "1_month";
  if (diff === 7) return "1_week";
  if (diff === 0) return "same_day";

  return null;
}

// EXPORT (optional reuse)
export {
  collection, doc, addDoc, setDoc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy,
  onSnapshot, serverTimestamp, Timestamp,
};
