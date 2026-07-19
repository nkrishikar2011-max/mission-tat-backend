// frontend/src/firebase.js
// (FARJIYAT AKHI FILE REPLACE - Live Firebase API Protection Engine)

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔐 ⚡ મહત્વની સૂચના: તારા ફાયરબેઝ કન્સોલ (Project Settings) માંથી સાચી API Key લાવીને
// અહીં "YOUR_ACTUAL_API_KEY" ની જગ્યાએ પેસ્ટ કરી દેજે ભાઈ!
const firebaseConfig = {
  apiKey: "AIzaSyAqwjM1Fnad7RGZIfodmpjiH3qlywRKTls", 
  authDomain: "mission-tat-gujarat.firebaseapp.com",
  projectId: "mission-tat-gujarat",
  storageBucket: "mission-tat-gujarat.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🛡️ એન્ક્રિપ્ટેડ ઓથેન્ટિકેશન અને ક્લાઉડ ડેટાબેઝ સેફગાર્ડ એક્સપોર્ટ
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;