// frontend/src/pages/MockTest/ExamWindow.jsx
// (FARJIYAT AKHI FILE REPLACE - Live 150 Questions Exam Engine with Countdown Timer)

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ExamWindow() {
  const { testId } = useParams();
  
  // ⏱️ ૧૨૦ મિનિટનું સેકન્ડ્સમાં કાઉન્ટડાઉન (૧૨૦ * ૬૦ = ૭૨૦૦ સેકન્ડ)
  const [timeLeft, setTimeLeft] = useState(7200); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 📝 સિલેક્ટેડ અભ્યાસક્રમ આધારિત ૧૫૦ ડમી પ્રશ્નોનું ડાયનેમિક મેટ્રિક્સ (જેમાં પાછળથી અસલી માલ ભરીશું)
  const totalQuestionsCount = 150;
  const dummyQuestions = Array.from({ length: totalQuestionsCount }, (_, i) => {
    let sectionName = "વિભાગ - ૧ : બાળ વિકાસ અને શૈક્ષણિક શાસ્ત્ર";
    if (i >= 30 && i < 60) sectionName = "વિભાગ – ૨ : ગુજરાતી ભાષા";
    if (i >= 60 && i < 90) sectionName = "વિભાગ – ૩ : અંગ્રેજી ભાષા";
    if (i >= 90 && i < 120) sectionName = "વિભાગ – ૪ : ગણિત / વિષય વસ્તુ";
    if (i >= 120) sectionName = "વિભાગ – ૫ : પર્યાવરણ અને સામાન્ય પ્રવાહો";

    return {
      id: i + 1,
      section: sectionName,
      questionText: `પ્રશ્ન ${i + 1}: મિશન TAT પરીક્ષાના નવા સુધારેલા અભ્યાસક્રમ મુજબ નીચેનામાંથી કયું વિધાન શૈક્ષણિક મનોવિજ્ઞાનના સિદ્ધાંતને સાચી રીતે રજૂ કરે છે?`,
      options: [
        `વિકલ્પ A: બાળકેન્દ્રી શિક્ષણ પદ્ધતિનો પ્રભાવ`,
        `વિકલ્પ B: પ્રગતિશીલ શિક્ષણ અને CCE માળખું`,
        `વિકલ્પ C: અધ્યેતાની વ્યક્તિગત ભિન્નતાની સમજ`,
        `વિકલ્પ D: ઉપરોક્ત તમામ સાચા છે`
      ],
      correct: 3 // સાચો જવાબ વિકલ્પ D
    };
  });

  // ⏱️ TIMER EFFECT RUNNER
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // ⏳ સેકન્ડ્સને મિનિટ અને સેકન્ડના ફોર્મેટમાં કન્વર્ટ કરો
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ":" : ""}${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleOptionSelect = (qId, optionIdx) => {
    setSelectedAnswers({ ...selectedAnswers, [qId]: optionIdx });
  };

  const handleAutoSubmit = () => {
    alert("⏱️ સમય પૂરો થઈ ગયો છે ભાઈ! તમારી કસોટી ઓટોમેટોકલી સબમિટ થઈ રહી છે.");
    processSubmission();
  };

  const handleManualSubmit = () => {
    if (window.confirm("🏁 શું તમે ખરેખર આ ૧૫૦ પ્રશ્નોની મોક ટેસ્ટ સબમિટ કરવા માંગો છો ભાઈ?")) {
      processSubmission();
    }
  };

  const processSubmission = () => {
    setIsSubmitting(true);
    
    // 📊 રિયલ-ટાઇમ માર્ક્સ અને સ્કોરિંગ મેટ્રિક્સ કેલ્ક્યુલેશન
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    dummyQuestions.forEach((q) => {
      const userAns = selectedAnswers[q.id];
      if (userAns === undefined) {
        skippedCount++;
      } else if (userAns === q.correct) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const attemptId = "att_" + Date.now();
    const resultPayload = {
      attemptId,
      testId,
      totalQuestions: totalQuestionsCount,
      score: correctCount,
      correctCount,
      wrongCount,
      skippedCount,
      selectedAnswers,
      submittedAt: new Date().toISOString()
    };

    // ફાયરબેઝ બેકઅપ માટે સેઝન સેન્ડબોક્સમાં રિઝલ્ટ લોક કરો
    localStorage.setItem(`mission_tat_result_${attemptId}`, JSON.stringify(resultPayload));
    
    alert(`🎉 કસોટી સફળતાપૂર્વક સબમિટ થઈ ગઈ છે! તમારો સ્કોર: ${correctCount}/${totalQuestionsCount}`);
    window.location.href = `/mock-test/result/${attemptId}`;
  };

  const currentQ = dummyQuestions[currentIndex];
  const totalAttempted = Object.keys(selectedAnswers).length;

  return (
    <div style={{ backgroundColor: "#f4f6f8", color: "#2c3e50", minHeight: "100vh", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* 🧭 TOP EXAM HEADER BAR */}
      <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #dcdde1", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <div>
          <span style={{ fontSize: "12px", color: "#e67e22", fontWeight: "bold" }}>📝 LIVE EXAM PORTAL</span>
          <h3 style={{ margin: "2px 0 0 0", color: "#2f3640", fontSize: "16px" }}>ટેસ્ટ ID: {testId}</h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ fontSize: "14px", color: "#7f8c8d" }}>પ્રગતિ: <strong>{totalAttempted}</strong> / {totalQuestionsCount} આપેલા જવાબ</div>
          <div style={{ backgroundColor: timeLeft < 600 ? "#fadbd8" : "#d5f5e3", color: timeLeft < 600 ? "#c0392b" : "#27ae60", padding: "8px 16px", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", border: "1px solid" }}>
            ⏱️ સમય: {formatTime(timeLeft)}
          </div>
          <button onClick={handleManualSubmit} disabled={isSubmitting} style={{ backgroundColor: "#e74c3c", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
            {isSubmitting ? "⚙️ સબમિટિંગ..." : "પરીક્ષા પૂરી કરો 🏁"}
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN SPLIT GRID */}
      <div style={{ display: "flex", flex: 1, padding: "20px", gap: "20px", maxWidth: "1200px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        
        {/* LEFT COLUMN: QUESTION CONTENT WINDOW */}
        <div style={{ flex: 1, backgroundColor: "#ffffff", border: "1px solid #dcdde1", borderRadius: "20px", padding: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          <div>
            <span style={{ backgroundColor: "#e8f4fd", color: "#2980b9", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>{currentQ.section}</span>
            <h2 style={{ fontSize: "18px", color: "#2c3e50", lineHeight: "1.6", marginTop: "20px", marginBottom: "25px" }}>{currentQ.questionText}</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === idx;
                return (
                  <div 
                    key={idx} 
                    onClick={() => handleOptionSelect(currentQ.id, idx)}
                    style={{ 
                      padding: "16px 20px", borderRadius: "12px", border: isSelected ? "2px solid #2980b9" : "1px solid #dcdde1", 
                      backgroundColor: isSelected ? "#eaf2f8" : "#f9f9f9", cursor: "pointer", fontSize: "14px", color: "#2c3e50", transition: "all 0.1s" 
                    }}
                  >
                    <strong>{opt}</strong>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NEXT/PREV BOTTOM ACTION BAR */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px", borderTop: "1px solid #f1f2f6", paddingTop: "20px" }}>
            <button 
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
              style={{ backgroundColor: currentIndex === 0 ? "#f5f6fa" : "#2c3e50", color: currentIndex === 0 ? "#7f8c8d" : "#fff", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: "bold", cursor: currentIndex === 0 ? "not-allowed" : "pointer" }}
            >
              ⬅️ પાછળનો પ્રશ્ન
            </button>
            <button 
              disabled={currentIndex === totalQuestionsCount - 1}
              onClick={() => setCurrentIndex(currentIndex + 1)}
              style={{ backgroundColor: currentIndex === totalQuestionsCount - 1 ? "#f5f6fa" : "#2980b9", color: currentIndex === totalQuestionsCount - 1 ? "#7f8c8d" : "#fff", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: "bold", cursor: currentIndex === totalQuestionsCount - 1 ? "not-allowed" : "pointer" }}
            >
              આગળનો પ્રશ્ન ➡️
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: 150 QUESTIONS NAVIGATION PALETTE */}
        <div style={{ width: "320px", backgroundColor: "#ffffff", border: "1px solid #dcdde1", borderRadius: "20px", padding: "20px", display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 120px)", position: "sticky", top: "90px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          <h4 style={{ margin: "0 0 15px 0", fontSize: "14px", color: "#2f3640", borderBottom: "1px solid #f1f2f6", paddingBottom: "10px" }}>🧩 પ્રશ્ન પેલેટ ગ્રીડ</h4>
          
          <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", paddingRight: "4px" }}>
            {dummyQuestions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCurrent = currentIndex === idx;
              
              let btnBg = "#f5f6fa";
              let btnColor = "#7f8c8d";
              let btnBorder = "1px solid #dcdde1";

              if (isAnswered) {
                btnBg = "#2ecc71";
                btnColor = "#ffffff";
                btnBorder = "1px solid #27ae60";
              }
              if (isCurrent) {
                btnBg = "#2980b9";
                btnColor = "#ffffff";
                btnBorder = "2px solid #1f618d";
              }

              return (
                <button 
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  style={{ backgroundColor: btnBg, color: btnColor, border: btnBorder, borderRadius: "8px", padding: "10px 0", fontSize: "12px", fontWeight: "bold", cursor: "pointer", textAlign: "center" }}
                >
                  {q.id}
                </button>
              );
            })}
          </div>

          {/* PALETTE LEGEND INFO */}
          <div style={{ marginTop: "15px", borderTop: "1px solid #f1f2f6", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#7f8c8d" }}>
            <span>🔵 વર્તમાન</span>
            <span>🟢 આપેલા જવાબ</span>
            <span>⚪ બાકી પ્રશ્નો</span>
          </div>
        </div>

      </div>
    </div>
  );
}