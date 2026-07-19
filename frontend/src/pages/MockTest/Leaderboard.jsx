// frontend/src/pages/MockTest/Leaderboard.jsx
// (Taddan navi file - Midnight Cyber Gold Theme sathe Live Merit List & Rank Board)

import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://mission-tat-backend.onrender.com";

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // બેકએન્ડમાંથી લીડરબોર્ડનો ડેટા ફેચ કરવો
    axios.get(`${API_BASE_URL}/api/mock-tests/leaderboard`)
      .then(res => {
        if (res.data) setLeaderboardData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Leaderboard fetch error:", err);
        // ટેસ્ટિંગ માટે સ્ટેટિક ડેટા સેટ કરીએ જો બેકએન્ડ હજી કનેક્ટ ન હોય
        setLeaderboardData([
          { name: "નિતિન સિંઘલ", score: 142, totalQuestions: 150, xp: 450, isPremium: true },
          { name: "આરવ પટેલ", score: 135, totalQuestions: 150, xp: 380, isPremium: false },
          { name: "રીન્કલ શર્મા", score: 131, totalQuestions: 150, xp: 350, isPremium: true },
          { name: "જયેશ પંચાલ", score: 122, totalQuestions: 150, xp: 290, isPremium: false }
        ]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ color: "#FFE07D", backgroundColor: "#09090b", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>⚙️ મેરિટ લિસ્ટ લોડ થઈ રહ્યું છે...</div>;

  return (
    <div style={{ backgroundColor: "#09090b", color: "#f4f4f5", minHeight: "100vh", padding: "40px 24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Header Title */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ margin: 0, fontSize: "36px", color: "#fff", fontWeight: "900" }}>🏆 ઓલ ગુજરાત મેરિટ લિસ્ટ</h1>
          <p style={{ color: "#FFE07D", marginTop: "8px", fontWeight: "bold" }}>મિશન TAT ગુજરાત લાઈવ લીડરબોર્ડ</p>
        </div>

        {/* Rank Table Wrapper */}
        <div style={{ backgroundColor: "#1c1c1e", border: "1px solid #27272a", borderRadius: "24px", padding: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px 100px", padding: "12px 16px", borderBottom: "1px solid #27272a", color: "#a1a1aa", fontSize: "14px", fontWeight: "bold" }}>
            <span>રેન્ક</span>
            <span>વિદ્યાર્થીનું નામ</span>
            <span style={{ textAlign: "center" }}>સ્કોર</span>
            <span style={{ textAlign: "right" }}>કુલ XP</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
            {leaderboardData.map((student, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;
              
              // Top 3 માટે અલગ ગોલ્ડન ચમક
              let rankBg = "#09090b";
              let rankColor = "#f4f4f5";
              if (rank === 1) { rankBg = "linear-gradient(135deg, #FFE07D 0%, #F5B041 100%)"; rankColor = "#000"; }
              else if (rank === 2) { rankBg = "#e4e4e7"; rankColor = "#000"; }
              else if (rank === 3) { rankBg = "#cd7f32"; rankColor = "#fff"; }

              return (
                <div 
                  key={index} 
                  style={{ 
                    display: "grid", 
                    gridTemplateColumns: "80px 1fr 100px 100px", 
                    alignItems: "center", 
                    padding: "16px", 
                    backgroundColor: "#09090b", 
                    border: student.isPremium ? "1px solid #FFE07D" : "1px solid #27272a", 
                    borderRadius: "16px",
                    boxShadow: student.isPremium ? "0 0 10px rgba(255, 224, 125, 0.1)" : "none"
                  }}
                >
                  {/* Rank Badge */}
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: rankBg, color: rankColor, display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>
                    {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
                  </div>

                  {/* Student Name */}
                  <div style={{ fontWeight: "bold", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                    {student.name}
                    {student.isPremium && <span style={{ color: "#FFE07D", fontSize: "10px", border: "1px solid #FFE07D", padding: "1px 4px", borderRadius: "4px" }}>PRO</span>}
                  </div>

                  {/* Score */}
                  <div style={{ textAlign: "center", fontWeight: "bold", color: "#4ade80", fontSize: "18px" }}>
                    {student.score} <span style={{ fontSize: "12px", color: "#a1a1aa" }}>/{student.totalQuestions}</span>
                  </div>

                  {/* XP Points */}
                  <div style={{ textAlign: "right", fontWeight: "bold", color: "#FFE07D" }}>
                    ⭐ {student.xp}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}