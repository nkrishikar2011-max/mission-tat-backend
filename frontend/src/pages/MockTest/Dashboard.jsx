// frontend/src/pages/MockTest/Dashboard.jsx
// (FARJIYAT AKHI FILE REPLACE - Absolute Local Bypass & Store Safe Integration)

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../../config/firebase"; 

const API_BASE_URL = "http://localhost:5000";

export default function MockTestDashboard() {
  const navigate = useNavigate();
  const user = auth?.currentUser; 
  
  const [testList, setTestList] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⚡ લોકલ ડેવલપમેન્ટ માટે ડિફોલ્ટ ટ્રુ કરી દીધું જેથી લૂપ કે લૉકનો સવાલ જ ના રહે
  const [isPremium, setIsPremium] = useState(true);
  const [premiumSubject, setPremiumSubject] = useState("ગણિત અને મનોવિજ્ઞાન VIP");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // યુઝર હિસ્ટ્રી લોડર
        if (user) {
          try {
            const historyRes = await axios.get(`${API_BASE_URL}/api/mock-tests/user-history/${user.uid}`);
            if (historyRes.data) setHistory(historyRes.data);
          } catch (histErr) {
            console.log("History load error:", histErr);
          }
        }

        // બધી મોક ટેસ્ટ લોડ કરો
        const testsRes = await axios.get(`${API_BASE_URL}/api/mock-tests/all`);
        if (testsRes.data) setTestList(testsRes.data);

      } catch (globalErr) {
        console.error("Global fetch error on dashboard:", globalErr);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) return <div style={{ color: "#FFE07D", backgroundColor: "#09090b", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>⚙️ લોડિંગ થઈ રહ્યું છે...</div>;

  return (
    <div style={{ backgroundColor: "#09090b", color: "#f4f4f5", minHeight: "100vh", padding: "40px 24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1050px", margin: "0 auto" }}>
        
        {/* TOP PANEL PROFILE HEADER */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "24px", marginBottom: "40px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "32px", color: "#fff" }}>🎯 મોક ટેસ્ટ સેન્ટર</h1>
            <p style={{ color: "#a1a1aa", marginTop: "6px" }}>મિશન TAT ગુજરાત ઓટોમેટેડ ટેસ્ટ પોર્ટલ</p>
          </div>

          <div style={{ backgroundColor: "#1c1c1e", padding: "20px", borderRadius: "20px", border: "2px solid #FFE07D", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "linear-gradient(135deg, #FFE07D 0%, #F5B041 100%)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "24px", color: "#000" }}>
              👑
            </div>
            <div>
              <h4 style={{ margin: 0, color: "#fff", fontSize: "16px" }}>
                {user?.displayName || "શિક્ષક મિત્ર"} 
                <span style={{ color: "#FFE07D", fontSize: "11px", marginLeft: "6px", border: "1px solid #FFE07D", padding: "2px 6px", borderRadius: "6px" }}>PREMIUM</span>
              </h4>
              <p style={{ margin: "4px 0 0 0", color: "#a1a1aa", fontSize: "12px" }}>વિષય: {premiumSubject}</p>
            </div>
          </div>
        </div>

        {/* MAIN BODY CONTENTS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
          <div>
            <h3 style={{ color: "#fff", marginBottom: "20px" }}>🚀 ઉપલબ્ધ મોક ટેસ્ટ</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {testList.length === 0 ? (
                <p style={{ color: "#71717a" }}>હાલમાં કોઈ નવી ટેસ્ટ ઉપલબ્ધ નથી ભાઈ.</p>
              ) : (
                testList.map((test) => {
                  // લોકલ સિક્યોરિટી ફ્લેગ: હંમેશા અનલોક મોડ
                  const isLocked = false; 

                  return (
                    <div key={test.id} style={{ backgroundColor: "#1c1c1e", border: "1px solid #27272a", padding: "20px", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h4 style={{ margin: 0, color: "#fff", fontSize: "17px" }}>{test.title}</h4>
                        <div style={{ display: "flex", gap: "12px", marginTop: "8px", fontSize: "12px", color: "#a1a1aa" }}>
                          <span>⏱️ {test.duration} મિનિટ</span>
                          <span>📊 ગુણ: {test.totalMarks || "150"}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => navigate(`/mock-test/live/${test.id}`)}
                        style={{ background: "linear-gradient(135deg, #FFE07D 0%, #F5B041 100%)", color: "#000", border: "none", padding: "10px 18px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}
                      >
                        ટેસ્ટ આપો
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div>
            <h3 style={{ color: "#fff", marginBottom: "20px" }}>📊 તમારો પરફોર્મન્સ ટ્રેקר</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {history.length === 0 ? (
                <div style={{ backgroundColor: "#1c1c1e", border: "1px solid #27272a", padding: "30px", borderRadius: "16px", textAlign: "center", color: "#71717a" }}>
                  તમે હજી સુધી એકપણ ટેસ્ટ આપી નથી ભાઈ.
                </div>
              ) : (
                history.map((attempt) => (
                  <div key={attempt.id} style={{ backgroundColor: "#1c1c1e", border: "1px solid #27272a", padding: "16px", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: "11px", color: "#FFE07D", fontWeight: "bold" }}>TEST #{attempt.testNumber || "1"}</span>
                      <h5 style={{ margin: "4px 0 0 0", color: "#fff", fontSize: "15px" }}>{attempt.examType || "Mock Test"}</h5>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ fontSize: "18px", fontWeight: "bold", color: "#4ade80" }}>{attempt.score} <span style={{ fontSize: "12px", color: "#a1a1aa" }}>/ {attempt.totalQuestions}</span></div>
                      <button onClick={() => navigate(`/mock-test/result/${attempt.id}`)} style={{ background: "#09090b", color: "#FFE07D", border: "1px solid #FFE07D", padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>રિવ્યૂ</button>
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