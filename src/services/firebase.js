// ═══════════════════════════════════════════════════════
// src/services/firebase.js
// Firebase v10 — Firestore + Auth configuration
// Replace the firebaseConfig values with your own from
// Firebase Console → Project Settings → Your Apps
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

// ─── YOUR FIREBASE CONFIG ─────────────────────────────
// TODO: Replace these values with your actual Firebase project config
// Go to: Firebase Console → Project Settings → General → Your Apps → SDK setup
const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY             || "PASTE_API_KEY_HERE",
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN         || "thiruvasal.firebaseapp.com",
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID          || "thiruvasal",
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET      || "thiruvasal.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1013411348504",
  appId:             process.env.REACT_APP_FIREBASE_APP_ID              || "1:1013411348504:web:a34bea6fc6b",
};

// ─── INITIALIZE ───────────────────────────────────────
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// ═══════════════════════════════════════════════════════
// AUTH SERVICES
// ═══════════════════════════════════════════════════════

/** Register a new user with email + password */
export async function registerUser({ name, phone, email, password, role = "donor" }) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });

    // Save user profile to Firestore
    await setDoc(doc(db, "users", credential.user.uid), {
      uid: credential.user.uid,
      name,
      phone,
      email,
      role, // "donor" | "admin"
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { user: credential.user, error: null };
  } catch (error) {
    return { user: null, error: firebaseErrorMessage(error.code) };
  }
}

/** Sign in existing user */
export async function loginUser({ email, password }) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return { user: credential.user, error: null };
  } catch (error) {
    return { user: null, error: firebaseErrorMessage(error.code) };
  }
}

/** Sign out */
export async function logoutUser() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

/** Get user profile from Firestore */
export async function getUserProfile(uid) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) return { profile: snap.data(), error: null };
    return { profile: null, error: "User not found" };
  } catch (error) {
    return { profile: null, error: error.message };
  }
}

/** Subscribe to auth state changes */
export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// ═══════════════════════════════════════════════════════
// DONOR SERVICES
// ═══════════════════════════════════════════════════════

/** Add a new donor (admin only) */
export async function addDonor({ name, phone, amount, purpose, donationDate, addedBy }) {
  try {
    const donorRef = await addDoc(collection(db, "donors"), {
      name,
      phone,
      amount: Number(amount),
      purpose,
      donationDate, // ISO string "YYYY-MM-DD"
      nextReminderDate: donationDate, // same date next year
      status: "pending", // "pending" | "paid"
      addedBy, // uid of admin
      confirmedAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: donorRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
}

/** Get all donors */
export async function getAllDonors() {
  try {
    const snap = await getDocs(
      query(collection(db, "donors"), orderBy("createdAt", "desc"))
    );
    const donors = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { donors, error: null };
  } catch (error) {
    return { donors: [], error: error.message };
  }
}

/** Real-time donor list subscription */
export function subscribeToDonors(callback) {
  const q = query(collection(db, "donors"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const donors = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(donors);
  });
}

/** Update donor confirmation status */
export async function updateDonorStatus(donorId, status) {
  try {
    await updateDoc(doc(db, "donors", donorId), {
      status, // "paid" | "pending"
      confirmedAt: status === "paid" ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

/** Update donor details */
export async function updateDonor(donorId, data) {
  try {
    await updateDoc(doc(db, "donors", donorId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

/** Delete a donor */
export async function deleteDonor(donorId) {
  try {
    await deleteDoc(doc(db, "donors", donorId));
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

// ═══════════════════════════════════════════════════════
// BUSINESS SERVICES
// ═══════════════════════════════════════════════════════

/** Add a new business listing */
export async function addBusiness({ name, service, price, phone, category, plan, ownerId }) {
  try {
    const ref = await addDoc(collection(db, "businesses"), {
      name,
      service,
      price,
      phone,
      category,
      plan: plan || "free", // "free" | "paid"
      ownerId,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: ref.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
}

/** Get all active business listings */
export async function getAllBusinesses() {
  try {
    const snap = await getDocs(
      query(
        collection(db, "businesses"),
        where("isActive", "==", true),
        orderBy("plan", "desc"), // paid listings first
        orderBy("createdAt", "desc")
      )
    );
    const businesses = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { businesses, error: null };
  } catch (error) {
    return { businesses: [], error: error.message };
  }
}

/** Real-time business subscription */
export function subscribeToBusinesses(callback) {
  const q = query(
    collection(db, "businesses"),
    where("isActive", "==", true),
    orderBy("plan", "desc"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const businesses = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(businesses);
  });
}

/** Toggle business active state */
export async function toggleBusiness(businessId, isActive) {
  try {
    await updateDoc(doc(db, "businesses", businessId), {
      isActive,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

// ═══════════════════════════════════════════════════════
// REMINDER SERVICES
// ═══════════════════════════════════════════════════════

/** Log a sent reminder */
export async function logReminder({ donorId, type, sentAt }) {
  try {
    await addDoc(collection(db, "reminders"), {
      donorId,
      type, // "1_month" | "1_week" | "same_day"
      sentAt: sentAt || serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

/** Get reminders for a donor */
export async function getDonorReminders(donorId) {
  try {
    const snap = await getDocs(
      query(
        collection(db, "reminders"),
        where("donorId", "==", donorId),
        orderBy("sentAt", "desc")
      )
    );
    return { reminders: snap.docs.map((d) => ({ id: d.id, ...d.data() })), error: null };
  } catch (error) {
    return { reminders: [], error: error.message };
  }
}

// ═══════════════════════════════════════════════════════
// ADMIN STATS
// ═══════════════════════════════════════════════════════

/** Get dashboard statistics */
export async function getDashboardStats() {
  try {
    const [donorsSnap, businessesSnap] = await Promise.all([
      getDocs(collection(db, "donors")),
      getDocs(query(collection(db, "businesses"), where("isActive", "==", true))),
    ]);

    const donors = donorsSnap.docs.map((d) => d.data());
    const paid = donors.filter((d) => d.status === "paid");
    const pending = donors.filter((d) => d.status === "pending");
    const totalCollection = paid.reduce((s, d) => s + (d.amount || 0), 0);

    return {
      stats: {
        totalDonors: donors.length,
        paidCount: paid.length,
        pendingCount: pending.length,
        totalCollection,
        businessCount: businessesSnap.size,
      },
      error: null,
    };
  } catch (error) {
    return { stats: null, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════

/** Convert Firebase error codes to Tamil-friendly messages */
function firebaseErrorMessage(code) {
  const messages = {
    "auth/email-already-in-use": "இந்த மின்னஞ்சல் ஏற்கனவே பயன்பாட்டில் உள்ளது",
    "auth/weak-password": "கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்",
    "auth/user-not-found": "பயனர் காணப்படவில்லை",
    "auth/wrong-password": "தவறான கடவுச்சொல்",
    "auth/invalid-email": "தவறான மின்னஞ்சல் முகவரி",
    "auth/too-many-requests": "பல முயற்சிகள் — சிறிது நேரம் காத்திருக்கவும்",
    "auth/network-request-failed": "நெட்வொர்க் பிழை — இணைப்பை சரிபாருங்கள்",
  };
  return messages[code] || "பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.";
}

/** Format Firestore Timestamp to readable date string */
export function formatDate(timestamp) {
  if (!timestamp) return "—";
  if (typeof timestamp === "string") return timestamp;
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("ta-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Check if a donation reminder should fire today */
export function shouldSendReminder(donationDateStr) {
  if (!donationDateStr) return null;
  const donation = new Date(donationDateStr);
  const today = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.ceil((donation - today) / msPerDay);

  if (diffDays === 30) return "1_month";
  if (diffDays === 7) return "1_week";
  if (diffDays === 0) return "same_day";
  return null;
}

export {
  collection, doc, addDoc, setDoc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy,
  onSnapshot, serverTimestamp, Timestamp,
};
