/* eslint-disable */
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
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

// ── Firebase Config ───────────────────────────────────────
// These values come from Vercel Environment Variables.
// Go to: Vercel Dashboard -> Project -> Settings -> Environment Variables
// Add all 6 REACT_APP_FIREBASE_* variables then redeploy.
const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY             || "AIzaSyABFYdnOQAf1-WkVxanFsXxM2fj6-XOnrU",
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN         || "thiruvasal.firebaseapp.com",
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID          || "thiruvasal",
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET      || "thiruvasal.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1013411348504",
  appId:             process.env.REACT_APP_FIREBASE_APP_ID              || "1:1013411348504:web:a34bea6fc6b",
};

// ── Initialize ────────────────────────────────────────────
const app = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

// ── Auth Services ─────────────────────────────────────────

export async function registerUser({ name, phone, email, password, role }) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    await setDoc(doc(db, "users", credential.user.uid), {
      uid: credential.user.uid,
      name,
      phone,
      email,
      role: role || "donor",
      createdAt: serverTimestamp(),
    });
    return { user: credential.user, error: null };
  } catch (error) {
    return { user: null, error: firebaseError(error.code) };
  }
}

export async function loginUser({ email, password }) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return { user: credential.user, error: null };
  } catch (error) {
    return { user: null, error: firebaseError(error.code) };
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getUserProfile(uid) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) return { profile: snap.data(), error: null };
    return { profile: null, error: "User not found" };
  } catch (error) {
    return { profile: null, error: error.message };
  }
}

export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// ── Donor Services ────────────────────────────────────────

export async function addDonor({ name, phone, amount, purpose, donationDate, addedBy }) {
  try {
    const ref = await addDoc(collection(db, "donors"), {
      name,
      phone,
      amount: Number(amount),
      purpose,
      donationDate,
      nextReminderDate: donationDate,
      status: "pending",
      addedBy,
      confirmedAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: ref.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
}

export function subscribeToDonors(callback) {
  const q = query(collection(db, "donors"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function updateDonorStatus(donorId, status) {
  try {
    await updateDoc(doc(db, "donors", donorId), {
      status,
      confirmedAt: status === "paid" ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

export async function updateDonor(donorId, data) {
  try {
    await updateDoc(doc(db, "donors", donorId), { ...data, updatedAt: serverTimestamp() });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

export async function deleteDonor(donorId) {
  try {
    await deleteDoc(doc(db, "donors", donorId));
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

// ── Business Services ─────────────────────────────────────

export async function addBusiness({ name, service, price, phone, category, plan, ownerId }) {
  try {
    const ref = await addDoc(collection(db, "businesses"), {
      name, service, price, phone, category,
      plan: plan || "free",
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

export function subscribeToBusinesses(callback) {
  const q = query(
    collection(db, "businesses"),
    where("isActive", "==", true),
    orderBy("plan", "desc"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function toggleBusiness(businessId, isActive) {
  try {
    await updateDoc(doc(db, "businesses", businessId), { isActive, updatedAt: serverTimestamp() });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

// ── Helpers ───────────────────────────────────────────────

export function formatDate(timestamp) {
  if (!timestamp) return "-";
  if (typeof timestamp === "string") return timestamp;
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function firebaseError(code) {
  const map = {
    "auth/email-already-in-use": "Email already registered. Please login.",
    "auth/weak-password":         "Password must be at least 6 characters.",
    "auth/user-not-found":        "No account found. Please register.",
    "auth/wrong-password":        "Wrong password. Please try again.",
    "auth/invalid-email":         "Invalid email address.",
    "auth/too-many-requests":     "Too many attempts. Please wait.",
    "auth/network-request-failed":"Network error. Check your connection.",
    "auth/invalid-credential":    "Invalid email or password.",
  };
  return map[code] || "Something went wrong. Please try again.";
}
