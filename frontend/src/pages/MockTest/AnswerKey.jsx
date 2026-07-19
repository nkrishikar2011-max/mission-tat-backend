// frontend/src/pages/MockTest/AnswerKey.jsx
// (FIXED - Connected directly to real questionsData database)

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDynamicMockTest } from "../../data/questionsData";

export default function AnswerKey() {
  const { attemptId } = useParams();
  const [attemptData, setAttemptData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // સેન્ડબોક્સ સેશનમાંથી યુઝરના જવાબોની હિસ્ટ્રી ખેંચો
    const localData = localStorage.getItem(`mission_tat_result_${attemptId}`);
    let currentTestId = "TET1_gen_test_1"; // ડિફોલ્ટ સેટ-૧
    
    if (localData) {
      const parsed = JSON.parse(localData);
      setAttemptData(parsed);
      if (parsed.testId) currentTestId = parsed.testId;
    } else {
      setAttemptData({
        testId: "TET1_gen_test_1",
        selectedAnswers: {}
      });
    }

    // 🎯 અસલી ડેટાબેઝમાંથી પ્રશ્નો લોડ કરવાનું પાકું લોજિક
    const loadedQuestions = getDynamicMockTest(currentTestId);
    setQuestions(loadedQuestions);
    setLoading(false);
  }, [attemptId]);

  if (loading) return <div style={{ color: "#2c3e50", backgroundColor: "#f4f6f8", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif" }}>⚙️ સોલ્યુશન કી જનરેટ થઈ રહી છે...</div>;

  return (
    <div style={{ backgroundColor: "#f4f6f8", color: "#2c3e50", minHeight: "100vh", padding: "30px 24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "850px", margin: "0 auto" }}>
        
        {/* TOP VIP NAVIGATION BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#ffffff", border: "1px solid #dcdde1", padding: "20px 30px", borderRadius: "20px", marginBottom: "30px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div>
            <span style={{ fontSize: "12px", color: "#2980b9", fontWeight: "bold" }}>📖 DETAILED SOLUTION KEY</span>
            <h2 style={{ margin: "4px 0 0 0", color: "#2f3640", fontSize: "18px" }}>અસલી પ્રશ્નોની સંપૂર્ણ આન્સર કી</h2>
          </div>
          <button 
            onClick={() => window.location.href = "/mock-test/dashboard"}
            style={{ backgroundColor: "#2980b9", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}
          >
            🏫 ડેશબોર્ડ પર જાઓ
          </button>
        </div>

        {/* 📚 SOLUTIONS LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {questions.map((q) => {
            const userAns = attemptData?.selectedAnswers?.[q.id];
            const isAnswered = userAns !== undefined;
            const isCorrect = isAnswered && userAns === q.correct;

            let cardStatusBorder = "#dcdde1";
            let statusLabel = "⚪ તમે આ પ્રશ્ન સ્કીપ કર્યો હતો";
            let labelColor = "#7f8c8d";

            if (isAnswered) {
              if (isCorrect) {
                cardStatusBorder = "#2ecc71";
                statusLabel = "🟢 તમારો જવાબ સાચો છે ભાઈ!";
                labelColor = "#27ae60";
              } else {
                cardStatusBorder = "#e74c3c";
                statusLabel = "🔴 તમારો જવાબ ખોટો છે ભાઈ!";
                labelColor = "#c0392b";
              }
            }

            return (
              <div 
                key={q.id} 
                style={{ 
                  backgroundColor: "#ffffff", border: `1px solid ${cardStatusBorder}`, borderLeft: `6px solid ${isAnswered ? (isCorrect ? "#2ecc71" : "#e74c3c") : "#bdc3c7"}`,
                  padding: "24px 30px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" 
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <span style={{ backgroundColor: "#f5f6fa", color: "#7f8c8d", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold" }}>{q.section}</span>
                  <span style={{ fontSize: "12px", fontWeight: "bold", color: labelColor }}>{statusLabel}</span>
                </div>

                <h3 style={{ fontSize: "16px", color: "#2c3e50", lineHeight: "1.6", margin: "0 0 16px 0" }}>
                  <strong>પ્રશ્ન {q.id}:</strong> {q.questionText}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {q.options.map((opt, idx) => {
                    const isUserSelection = userAns === idx;
                    // questionsData માં correct ઇન્ડેક્સ ૧-આધારિત કે ૦-આધારિત છે તે મુજબ સેટ થશે
                   const isCorrectOption = q.correct === (idx + 1);

                    let optBg = "#f9f9f9";
                    let optBorder = "1px solid #dcdde1";
                    let optIcon = "";

                    if (isCorrectOption) {
                      optBg = "#d5f5e3";
                      optBorder = "1px solid #2ecc71";
                      optIcon = " ✅ (સાચો જવાબ)";
                    } else if (isUserSelection && !isCorrect) {
                      optBg = "#fadbd8";
                      optBorder = "1px solid #e74c3c";
                      optIcon = " ❌ (તમારો જવાબ)";
                    }

                    return (
                      <div 
                        key={idx}
                        style={{ padding: "12px 16px", borderRadius: "10px", backgroundColor: optBg, border: optBorder, fontSize: "13px", color: "#2c3e50", fontWeight: (isCorrectOption || isUserSelection) ? "bold" : "normal" }}
                      >
                        {opt} {optIcon}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}