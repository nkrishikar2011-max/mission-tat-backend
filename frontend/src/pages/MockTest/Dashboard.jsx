// frontend/src/pages/MockTest/Dashboard.jsx
// (Taddan navi file - Midnight Cyber Gold theme sathe User Dashboard & History Hub)

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://mission-tat-backend.onrender.com";

export default function MockTestDashboard() {
  const navigate = useNavigate();
  const [testList, setTestList] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // temporary static user state - real logic user context mathi aavshe
  const [userProfile, setUserProfile] = useState({
    uid: "USER_FIREBASE_ID_TEMPORARY",
    name: "નિતિન સિંઘલ",
    isPremium: true // Gold aura activation filter
  });

  useEffect(() => {
    // Fetch all available tests and user history parallelly
    Promise.all([
      axios.get(`${API_BASE_URL}/api/mock-tests/all`),
      axios.get(`${API_BASE_URL}/api/mock-tests/user-history/${userProfile.uid}`)
    ])
      .then(([testsRes, historyRes]) => {
        setTestList(testsRes.data);
        setHistory(historyRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userProfile.uid]);

  if (loading) return <div style={{ color: "#FFE07D", backgroundColor: "#09090b", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>⚙️ પ્રીમિયમ ડેશબોર્ડ લોડ થઈ રહ્યું છે...</div>;

  return (
    <div style={{ backgroundColor: "#09090b", color: "#f4f4f5", minHeight: "100vh", padding: "40px 24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1050px", margin: "0 auto" }}>
        
        {/* Style tag for Golden Glowing Animations */}
        <style>{`
          @keyframes goldGlow {
            0% { border-color: #FFE07D; box-shadow: 0 0 5px rgba(255,224,125,0.2); }
            50% { border-color: #F5B041; box-shadow: 0 0 20px rgba(245,176,65,0.6); }
            100% { border-color: #FFE07D; box-shadow: 0 0 5px rgba(255,224,125,0.2); }
          }
          .premium-card {
            border: 2px solid #FFE07D;
            animation: goldGlow 3s infinite ease-in-out;
          }
        `}</style>

        {/* Header section with User Profile Card */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "24px", marginBottom: "40px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "32px", color: "#fff" }}>🎯 મોક ટેસ્ટ સેન્ટર</h1>
            <p style={{ color: "#a1a1aa", marginTop: "6px" }}>મિશન TAT ગુજરાત ઓટોમેટેડ ટેસ્ટ પોર્ટલ</p>
          </div>

          {/* User Profile Info Card (Premium Visual Filter) */}
          <div 
            className={userProfile.isPremium ? "premium-card" : ""} 
            style={{ 
              backgroundColor: "#1c1c1e", 
              padding: "20px", 
              borderRadius: "20px", 
              border: userProfile.isPremium ? "none" : "1px solid #27272a",
              display: "flex", 
              alignItems: "center", 
              gap: "16px" 
            }}
          >
            <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: userProfile.isPremium ? "linear-gradient(135deg, #FFE07D 0%, #F5B041 100%)" : "#27272a", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "24px", color: "#000" }}>
              {userProfile.isPremium ? "👑" : "👤"}
            </div>
            <div>
              <h4 style={{ margin: 0, color: "#fff", fontSize: "16px" }}>
                {userProfile.name} 
                {userProfile.isPremium && <span style={{ color: "#FFE07D", fontSize: "11px", marginLeft: "6px", verticalAlign: "middle", border: "1px solid #FFE07D", padding: "2px 6px", borderRadius: "6px" }}>PREMIUM</span>}
              </h4>
              <p style={{ margin: "4px 0 0 0", color: "#a1a1aa", fontSize: "12px" }}>કુલ આપેલી પરીક્ષાઓ: {history.length}</p>
            </div>
          </div>
        </div>

        {/* Core Layout Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
          
          {/* Left Column: Live Available Mock Tests */}
          <div>
            <h3 style={{ color: "#fff", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>🚀 ઉપલબ્ધ મોક ટેસ્ટ</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {testList.length === 0 ? (
                <p style={{ color: "#71717a" }}>હાલમાં કોઈ નવી ટેસ્ટ ઉપલબ્ધ નથી ભાઈ.</p>
              ) : (
                testList.map((test) => (
                  <div key={test.id} style={{ backgroundColor: "#1c1c1e", border: "1px solid #27272a", padding: "20px", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ margin: 0, color: "#fff", fontSize: "18px" }}>{test.title}</h4>
                      <div style={{ display: "flex", gap: "12px", marginTop: "8px", fontSize: "12px", color: "#a1a1aa" }}>
                        <span>⏱️ {test.duration} મિનિટ</span>
                        <span>📊 ગુણ: {test.totalMarks}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/mock-test/live/${test.id}`)}
                      style={{ 
                        background: "linear-gradient(135deg, #FFE07D 0%, #F5B041 100%)", 
                        color: "#000", 
                        border: "none", 
                        padding: "10px 18px", 
                        borderRadius: "10px", 
                        fontWeight: "bold", 
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                    >
                      ટેસ્ટ આપો
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: User Analytics & past Attempt History */}
          <div>
            <h3 style={{ color: "#fff", marginBottom: "20px" }}>📊 તમારો પરફોર્મન્સ ટ્રેકર</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {history.length === 0 ? (
                <div style={{ backgroundColor: "#1c1c1e", border: "1px solid #27272a", padding: "30px", borderRadius: "16px", textAlign: "center", color: "#71717a" }}>
                  તમે હજી સુધી એકપણ ટેસ્ટ આપી નથી ભાઈ. પેલી ટેસ્ટ આપો એટલે અહીં ગ્રાફ અને હિસ્ટ્રી જનરેટ થશે!
                </div>
              ) : (
                history.map((attempt) => (
                  <div key={attempt.id} style={{ backgroundColor: "#1c1c1e", border: "1px solid #27272a", padding: "16px", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: "11px", color: "#FFE07D", fontWeight: "bold" }}>TEST #{attempt.testNumber}</span>
                      <h5 style={{ margin: "4px 0 0 0", color: "#fff", fontSize: "15px" }}>{attempt.examType.replace("_", " ")}</h5>
                      <span style={{ fontSize: "11px", color: "#71717a" }}>{new Date(attempt.attemptedAt).toLocaleDateString("gu-IN")}</span>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "18px", fontWeight: "bold", color: "#4ade80" }}>{attempt.score} <span style={{ fontSize: "12px", color: "#a1a1aa" }}>/ {attempt.totalQuestions}</span></div>
                        <span style={{ fontSize: "11px", color: "#a1a1aa" }}>મેળવેલ ગુણ</span>
                      </div>
                      <button 
                        onClick={() => navigate(`/mock-test/result/${attempt.id}`)}
                        style={{ background: "#09090b", color: "#FFE07D", border: "1px solid #FFE07D", padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                      >
                        રિવ્યૂ
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}