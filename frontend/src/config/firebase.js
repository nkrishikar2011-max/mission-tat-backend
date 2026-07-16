import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// 🛠️ ડેટાબેઝ માટે ફાયરબેઝ સ્ટોર ઇમ્પોર્ટ કર્યો
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy_api_key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mission-tat-gujarat.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mission-tat-gujarat",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mission-tat-gujarat.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000:web:000000000"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
// 🛠️ ડેટાબેઝ ઇનિશિયલાઇઝ કર્યો
const db = getFirestore(app);

// 🚀 બધી જ જરૂરી વસ્તુઓ એક્સપોર્ટ કરી દીધી
export { auth, googleProvider, signInWithPopup, db };