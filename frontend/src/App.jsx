// frontend/src/App.jsx
// (FARJIYAT AKHI FILE REPLACE - Store + Mock Tests + Leaderboard + Admin Analytics All-in-One)

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Existing Original Pages Imports
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

// New Core Pages Imports (Leaderboard & Admin Logs Analytics)
import Leaderboard from "./pages/MockTest/Leaderboard";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";

// 🎬 NETFLIX-STYLE CINEMATIC SPLASH COMPONENT
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

// 🚀 MAIN APP COMPONENT
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
        
        {/* મેઈન સ્ટોર અને એડમિન ડેશબોર્ડ */}
        <Route path="/store" element={<Store />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* પ્રીમિયમ મોક ટેસ્ટ પોર્ટલ Routes */}
        <Route path="/mock-test/dashboard" element={<MockTestDashboard />} />
        <Route path="/mock-test/live/:testId" element={<ExamWindow />} />
        <Route path="/mock-test/result/:attemptId" element={<TestResult />} />
        
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