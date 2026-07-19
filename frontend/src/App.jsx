// frontend/src/App.jsx
// (FARJIYAT AKHI FILE REPLACE - Core Auth Infrastructure & Store Protected All-in-One)

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Existing Original Pages Imports (100% Protected)
import Store from "./pages/Store/Store";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Terms from "./pages/Legal/Terms";
import Privacy from "./pages/Legal/Privacy";
import Refund from "./pages/Legal/Refund";

// Premium Mock Test Module Pages Imports
import ExamWindow from "./pages/MockTest/ExamWindow";
import TestResult from "./pages/MockTest/TestResult";
import MockTestManager from "./pages/Admin/MockTestManager";
import MockTestDashboard from "./pages/MockTest/Dashboard";
import PremiumBuy from "./pages/Premium/PremiumBuy";

// Core Pages Imports (Leaderboard & Missing Diagnostics Router Connections)
import Leaderboard from "./pages/MockTest/Leaderboard";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import AnswerKey from "./pages/MockTest/AnswerKey";
import AnalyticsReport from "./pages/MockTest/AnalyticsReport";
import ModelPaperGenerator from "./pages/MockTest/ModelPaperGenerator";
// Authentication System Imports (Secure Identity Management)
import Login from "./pages/Auth/Login";
// ⚡ ફિક્સ: સાઈન-અપ કમ્પોનન્ટનું સેફ ઈમ્પોર્ટ વેલિડેશન
import SignUp from "./pages/Auth/SignUp";

// 🎬 NETFLIX-STYLE CINEMATIC SPLASH COMPONENT (અકબંધ સુરક્ષિત)
function SplashScreen({ onFinished }) {
  useEffect(() => {
    const timer = setTimeout(() => { onFinished(); }, 4500);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div style={{
      position: "fixed", inset: 0, backgroundColor: "#000000", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 99999
    }}>
      <style>{`
        @keyframes netflixIntro {
          0% { transform: scale(0.6); opacity: 0; filter: blur(12px); letter-spacing: 15px; }
          40% { opacity: 1; filter: blur(0px); letter-spacing: 4px; }
          85% { transform: scale(1.05); opacity: 1; filter: blur(0px); }
          100% { transform: scale(1.4); opacity: 0; filter: blur(15px); }
        }
        .netflix-title {
          color: #dc2626; font-size: 52px; font-weight: 900; margin: 0;
          font-family: 'Impact', 'Arial Black', sans-serif;
          animation: netflixIntro 4.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
      <div>
        <h1 className="netflix-title">MISSION TAT GUJARAT</h1>
      </div>
    </div>
  );
}

// 🚀 MAIN APP COMPONENT (સ્ટોર સેફગાર્ડ સિંક્રોનાઇઝ્ડ)
export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <Routes>
        {/* લીગલ અને પોલિસી પેજીસ */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        
        {/* મેઈન સ્ટોર, લોગિન અને એડમિન ડેશબોર્ડ (૧૦૦% પ્રોટેક્ટેડ ઓરિજિનલ ફ્લો) */}
        <Route path="/store" element={<Store />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* ઓટોમેટેડ મોબાઈલ ઓથોરિટી રૂટ્સ પાથ */}
        <Route path="/login" element={<Login />} />
        {/* ⚡ ફિક્સ: એન્ક્રિપ્ટેડ સાઈન-અપ સ્ક્રીનનો નવો રૂટ પાથ અહીં મર્જ કરી દીધો ભાઈ */}
        <Route path="/signup" element={<SignUp />} />

        {/* પ્રીમિયમ મોક ટેસ્ટ પોર્ટલ Routes */}
        <Route path="/mock-test/dashboard" element={<MockTestDashboard />} />
        <Route path="/mock-test/live/:testId" element={<ExamWindow />} />
        <Route path="/mock-test/result/:attemptId" element={<TestResult />} />
        // App.jsx ના રૂટ્સની અંદર આ લાઇન પ્લગ કરી દો ભાઈ:
<Route path="/mock-test/model-papers" element={<ModelPaperGenerator />} />
        {/* ડાયનેમિક સોલ્યુશન આન્સર કી અને એનાલિટિક્સ રૂટ્સ */}
        <Route path="/mock-test/answer-key/:attemptId" element={<AnswerKey />} />
        <Route path="/mock-test/analytics" element={<AnalyticsReport />} />
        
        {/* ઓલ ગુજરાત લાઈવ મેરિટ લિસ્ટ (Leaderboard) Route */}
        <Route path="/mock-test/leaderboard" element={<Leaderboard />} />

        {/* એડમિન મોક ટેસ્ટ કંટ્રોલ અને રીયલ-ટાઇમ એનાલિટિક્સ લોગ્સ */}
        <Route path="/admin/manage-mock-tests" element={<MockTestManager />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        
        {/* Razorpay સિક્યોર ગેટવે પેજ */}
        <Route path="/premium-buy" element={<PremiumBuy />} />

        {/* ડાયરેક્ટ સ્ટોર પેજ પર રીડાયરેક્ટ */}
        <Route path="*" element={<Navigate to="/store" replace />} />
      </Routes>
    </Router>
  );
}