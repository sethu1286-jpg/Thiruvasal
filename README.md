# 🏛️ திருவாசல் (Thiruvasal)
### AyyaAkilam (ஐயா அகிலம்) — Temple Donation Management Platform

> **Blue + Orange Sun** themed spiritual web app  
> Built with **React + Firebase Firestore + Vercel**  
> 100% free for users

---

## 📁 Project Structure

```
thiruvasal/
├── public/
│   ├── index.html          ← HTML shell with Tamil fonts
│   └── manifest.json       ← PWA manifest
├── src/
│   ├── index.js            ← React entry point
│   ├── App.jsx             ← Root component + auth guard + routing
│   ├── context/
│   │   └── AuthContext.js  ← Global auth state (Firebase Auth)
│   ├── services/
│   │   └── firebase.js     ← ALL Firebase operations (auth + firestore)
│   ├── hooks/
│   │   ├── useDonors.js    ← Real-time donor subscription hook
│   │   └── useBusinesses.js← Real-time business subscription hook
│   ├── components/
│   │   └── UI.jsx          ← Shared components (TopBar, Card, Modal, SunIcon…)
│   ├── screens/
│   │   ├── LoginScreen.jsx    ← Register / Login
│   │   ├── HomeScreen.jsx     ← Dashboard with sun hero + stats
│   │   ├── CharityScreen.jsx  ← தருமநிலயம் — Donor CRUD
│   │   ├── BusinessScreen.jsx ← வர்த்தகம் — Business listings
│   │   ├── ProfileScreen.jsx  ← User profile + logout
│   │   └── AdminScreen.jsx    ← Admin dashboard (3 tabs)
│   └── styles/
│       ├── global.css         ← Animations, utilities, sun theme
│       └── theme.js           ← Design tokens (colors, fonts, shadows)
├── firebase.json           ← Firebase CLI config
├── firestore.rules         ← Firestore security rules
├── firestore.indexes.json  ← Firestore composite indexes
├── vercel.json             ← Vercel deployment config
├── .env.example            ← Environment variable template
├── .gitignore
└── package.json
```

---

## 🚀 Setup in 5 Steps

### Step 1 — Clone & Install
```bash
# Download project and install packages
cd thiruvasal
npm install
```

### Step 2 — Create Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → Name it `thiruvasal`
3. Disable Google Analytics (optional) → **Create project**
4. Click **"Web"** icon (</>) → Register app as `thiruvasal-web`
5. Copy the `firebaseConfig` object shown

### Step 3 — Enable Firebase Services
In Firebase Console:
- **Authentication** → Sign-in method → Enable **Email/Password**
- **Firestore Database** → Create database → Start in **test mode** (change to production rules later)

### Step 4 — Configure Environment
```bash
# Copy the example file
cp .env.example .env

# Edit .env and paste your Firebase values:
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=thiruvasal.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=thiruvasal
REACT_APP_FIREBASE_STORAGE_BUCKET=thiruvasal.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 5 — Run Locally
```bash
npm start
# Opens at http://localhost:3000
```

---

## 🔐 Admin Setup

After registering, manually set a user as admin in Firestore:

1. Firebase Console → **Firestore Database**
2. Open `users` collection → find your user document
3. Change `role` field from `"donor"` to `"admin"`
4. Refresh the app → Admin tab appears

---

## 🌐 Deploy to Vercel

### Option A — Vercel CLI (fastest)
```bash
npm install -g vercel
npm run build
vercel --prod
```
Then add environment variables in **Vercel Dashboard → Settings → Environment Variables**

### Option B — GitHub + Vercel (recommended)
1. Push code to GitHub: `git push origin main`
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import repo
3. Add all `REACT_APP_*` environment variables
4. Click **Deploy** — done!

---

## 🔒 Deploy Firestore Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select your project)
firebase init firestore

# Deploy rules + indexes
firebase deploy --only firestore
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0F1B3D` (deep blue) |
| Surface | `#162347` (mid blue) |
| Sun Orange | `#FF8C00` |
| Sun Bright | `#FFA833` |
| Text Primary | `#F0F6FF` |
| Text Muted | `#9BB5E0` |
| Display Font | Cinzel (serif) |
| Body Font | Noto Sans Tamil + Poppins |

---

## 📊 Firestore Collections

```
users/          { uid, name, phone, email, role }
donors/         { name, phone, amount, purpose, donationDate, status, nextReminderDate, addedBy }
businesses/     { name, service, price, phone, category, plan, ownerId, isActive }
reminders/      { donorId, type, sentAt }
```

---

## 💡 Features

| Feature | Status |
|---------|--------|
| Email/Password Auth | ✅ |
| Tamil UI | ✅ |
| Real-time Firestore sync | ✅ |
| Donor CRUD (admin) | ✅ |
| Donation confirmation (Yes/No) | ✅ |
| Business listing (free/premium) | ✅ |
| Admin dashboard with live stats | ✅ |
| PWA installable | ✅ |
| Vercel deployment | ✅ |
| Firestore security rules | ✅ |
| Reminder notification logic | ✅ (backend needed for SMS) |

---

## 📱 Making it a Phone App (Later)

Once the web version is stable, you can wrap it as a mobile app using **Capacitor**:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init
npm run build
npx cap add android
npx cap open android
```

---

*"கொடுப்பவன் கோடி இன்பம் பெறுவான்"*  
Built with ❤️ for temples across Tamil Nadu
