// frontend/src/firebase.js
// (Taddan navi/Full file - Central Firebase Security Engine)

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔐 તારા ફાયરબેઝ પ્રોજેક્ટના ક્રેડેન્શિયલ્સ (સેન્ડબોક્સ સિક્યોરિટી મોડ)
// પ્રોડક્શનમાં આને .env ફાઈલમાંથી લોડ કરાય, પણ અત્યારે લોકલી કનેક્ટ કરવા માટેનું ગ્રીડ
const firebaseConfig = {
  apiKey: "AIzaSyA1-YOUR_ACTUAL_API_KEY_HERE",
  authDomain: "mission-tat-gujarat.firebaseapp.com",
  projectId: "mission-tat-gujarat",
  storageBucket: "mission-tat-gujarat.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🛡️ એન્ક્રિપ્ટેડ ઓથેન્ટિકેશન અને ડેટાબેઝ એન્જિન એક્સપોર્ટ
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;