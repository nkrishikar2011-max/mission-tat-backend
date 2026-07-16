// frontend/src/pages/MockTest/ExamWindow.jsx
// (Taddan navi file - Midnight Cyber Gold theme sathe live exam screen)

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "https://mission-tat-backend.onrender.com";

export default function ExamWindow() {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [test, setTest] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOptionIndex }
  const [timeLeft, setTimeLeft] = useState(7200); // 120 minutes in seconds
  const [loading, setLoading] = useState(true);

  // Load Test Data
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/mock-tests/${testId}`)
      .then(res => {
        setTest(res.data);
        setTimeLeft(res.data.duration * 60);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [testId]);

  // Live Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (qId, optIdx) => {
    setAnswers({ ...answers, [qId]: optIdx });
  };

  const handleAutoSubmit = () => {
    handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      const userId = "USER_FIREBASE_ID_TEMPORARY"; // Context mathi aavshe pachhi
      const payload = { userId, testId, userAnswers: answers };
      const res = await axios.post(`${API_BASE_URL}/api/mock-tests/submit`, payload);
      navigate(`/mock-test/result/${res.data.attemptId}`);
    } catch (err) {
      alert("ટેસ્ટ સબમિટ કરવામાં ભૂલ થઈ ભાઈ!");
    }
  };

  if (loading) return <div style={{ color: "#FFE07D", backgroundColor: "#09090b", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>⚙️ પ્રીમિયમ ટેસ્ટ એન્જિન લોડ થઈ રહ્યું છે...</div>;
  if (!test) return <div style={{ color: "#ef4444", backgroundColor: "#09090b", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>🚨 ટેસ્ટ મળી નથી ભાઈ!</div>;

  const currentQuestion = test.questions[currentIdx];

  return (
    <div style={{ backgroundColor: "#09090b", color: "#f4f4f5", minHeight: "100vh", padding: "24px", fontFamily: "sans-serif" }}>
      
      {/* Top Glassmorphic Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(28, 28, 30, 0.8)", backdropFilter: "blur(12px)", padding: "16px 24px", borderRadius: "16px", border: "1px solid #27272a", marginBottom: "24px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "20px", color: "#fff" }}>{test.title}</h2>
          <span style={{ color: "#FFE07D", fontSize: "12px", fontWeight: "bold" }}>👑 PREMIUM EXAM PORTAL</span>
        </div>
        
        {/* Neon Timer Box */}
        <div style={{ background: timeLeft < 600 ? "rgba(220,38,38,0.2)" : "#09090b", border: timeLeft < 600 ? "1px solid #dc2626" : "1px solid #FFE07D", padding: "10px 20px", borderRadius: "10px", color: timeLeft < 600 ? "#ef4444" : "#FFE07D", fontWeight: "bold", fontSize: "18px", fontFamily: "monospace", boxShadow: "0 0 10px rgba(255, 224, 125, 0.2)" }}>
          ⏱️ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>
        
        {/* Left Side: Question Box */}
        <div style={{ backgroundColor: "#1c1c1e", border: "1px solid #27272a", padding: "30px", borderRadius: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "400px" }}>
          <div>
            <span style={{ color: "#FFE07D", fontWeight: "bold", fontSize: "14px" }}>પ્રશ્ન {currentIdx + 1} / {test.questions.length}</span>
            <h3 style={{ fontSize: "22px", marginTop: "12px", lineHeight: "1.5", color: "#fff" }}>{currentQuestion.questionText}</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
              {currentQuestion.options.map((opt, i) => {
                const isSelected = answers[currentQuestion.questionId] === i;
                return (
                  <button 
                    key={i} 
                    onClick={() => handleSelectOption(currentQuestion.questionId, i)}
                    style={{ width: "100%", textAlign: "left", padding: "16px", borderRadius: "12px", border: isSelected ? "1px solid #FFE07D" : "1px solid #27272a", background: isSelected ? "rgba(255,224,125,0.08)" : "#09090b", color: isSelected ? "#FFE07D" : "#f4f4f5", fontSize: "16px", cursor: "pointer", transition: "all 0.2s" }}
                  >
                    <strong style={{ marginRight: "10px", color: isSelected ? "#FFE07D" : "#a1a1aa" }}>{String.fromCharCode(65 + i)}.</strong> {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Control Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px", borderTop: "1px solid #27272a", paddingTop: "20px" }}>
            <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(currentIdx - 1)} style={{ background: "#09090b", color: "#fff", border: "1px solid #27272a", padding: "10px 20px", borderRadius: "10px", cursor: "pointer" }}>⬅️ પાછળ</button>
            
            {currentIdx < test.questions.length - 1 ? (
              <button onClick={() => setCurrentIdx(currentIdx + 1)} style={{ background: "linear-gradient(135deg, #FFE07D 0%, #F5B041 100%)", color: "#000", border: "none", padding: "10px 24px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>આગળ વધો ➡️</button>
            ) : (
              <button onClick={handleSubmit} style={{ background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)", color: "#000", border: "none", padding: "10px 30px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>🏁 ટેસ્ટ સબમિટ કરો</button>
            )}
          </div>
        </div>

        {/* Right Side: 150 Questions Matrix Palette */}
        <div style={{ backgroundColor: "#1c1c1e", border: "1px solid #27272a", padding: "20px", borderRadius: "24px", height: "fit-content" }}>
          <h4 style={{ margin: "0 0 14px 0", color: "#fff", fontSize: "15px" }}>🎯 પ્રશ્નોની સ્થિતિ</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", maxHeight: "350px", overflowY: "auto", paddingRight: "4px" }}>
            {test.questions.map((q, idx) => {
              const isAnswered = answers[q.questionId] !== undefined;
              const isCurrent = idx === currentIdx;
              
              let btnBg = "#09090b";
              let border = "1px solid #27272a";
              let txtColor = "#a1a1aa";

              if (isAnswered) {
                btnBg = "rgba(74,222,128,0.15)";
                border = "1px solid #4ade80";
                txtColor = "#4ade80";
              }
              if (isCurrent) {
                border = "2px solid #FFE07D";
                txtColor = "#FFE07D";
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => setCurrentIdx(idx)}
                  style={{ width: "100%", height: "42px", borderRadius: "8px", background: btnBg, border: border, color: txtColor, fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}