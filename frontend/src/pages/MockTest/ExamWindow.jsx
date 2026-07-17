// frontend/src/pages/MockTest/ExamWindow.jsx
// (FARJIYAT AKHI FILE REPLACE - Real Paper Shuffling Integration)

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDynamicMockTest } from "../../data/questionsData";

export default function ExamWindow() {
  const { testId } = useParams();
  
  // ⏱️ ૧૨૦ મિનિટનું સેકન્ડ્સમાં કાઉન્ટડાઉન (૧૨૦ * ૬૦ = ૭૨૦૦ સેકન્ડ)
  const [timeLeft, setTimeLeft] = useState(7200); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState([]);

  // 🔄 DYNAMIC QUESTION ENGINE ROUTING (અસલી પ્રશ્નોનું ડાયનેમિક સિંકિંગ)
  useEffect(() => {
    // getDynamicMockTest ફંક્શન દ્વારા જે-તે ટેસ્ટ આઈડી વાઇઝ પૂરા ૧૫૦ મિક્સ પ્રશ્નો લોડ થશે
    const loadedQuestions = getDynamicMockTest(testId);
    setQuestions(loadedQuestions);
  }, [testId]);

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
    
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    questions.forEach((q) => {
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
      totalQuestions: questions.length,
      score: correctCount,
      correctCount,
      wrongCount,
      skippedCount,
      selectedAnswers,
      submittedAt: new Date().toISOString()
    };

    localStorage.setItem(`mission_tat_result_${attemptId}`, JSON.stringify(resultPayload));
    
    alert(`🎉 કસોટી સફળતાપૂર્વક સબમિટ થઈ ગઈ છે! તમારો સ્કોર: ${correctCount}/${questions.length}`);
    window.location.href = `/mock-test/result/${attemptId}`;
  };

  if (questions.length === 0) return <div style={{ color: "#2c3e50", backgroundColor: "#f4f6f8", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif" }}>⚙️ પ્રશ્ન બેંક લોડ થઈ રહી છે...</div>;

  const currentQ = questions[currentIndex];
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
          <div style={{ fontSize: "14px", color: "#7f8c8d" }}>પ્રગતિ: <strong>{totalAttempted}</strong> / {questions.length} આપેલા જવાબ</div>
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
            <h2 style={{ fontSize: "17px", color: "#2c3e50", lineHeight: "1.6", marginTop: "20px", marginBottom: "25px" }}>{currentQ.questionText}</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === idx;
                return (
                  <div 
                    key={idx} 
                    onClick={() => handleOptionSelect(currentQ.id, idx)}
                    style={{ 
                      padding: "15px 20px", borderRadius: "12px", border: isSelected ? "2px solid #2980b9" : "1px solid #dcdde1", 
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
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex(currentIndex + 1)}
              style={{ backgroundColor: currentIndex === questions.length - 1 ? "#f5f6fa" : "#2980b9", color: currentIndex === questions.length - 1 ? "#7f8c8d" : "#fff", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: "bold", cursor: currentIndex === questions.length - 1 ? "not-allowed" : "pointer" }}
            >
              આગળનો પ્રશ્ન ➡️
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: QUESTIONS NAVIGATION PALETTE */}
        <div style={{ width: "320px", backgroundColor: "#ffffff", border: "1px solid #dcdde1", borderRadius: "20px", padding: "20px", display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 120px)", position: "sticky", top: "90px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          <h4 style={{ margin: "0 0 15px 0", fontSize: "14px", color: "#2f3640", borderBottom: "1px solid #f1f2f6", paddingBottom: "10px" }}>🧩 પ્રશ્ન પેલેટ ગ્રીડ</h4>
          
          <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", paddingRight: "4px" }}>
            {questions.map((q, idx) => {
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