// frontend/src/pages/MockTest/AnswerKey.jsx
// (FARJIYAT AKHI FILE REPLACE - Full 150 Questions Live Solution & Answer Key Engine)

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function AnswerKey() {
  const { attemptId } = useParams();
  const [attemptData, setAttemptData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 📝 ૧૫૦ પ્રશ્નોનું સેન્ટ્રલ માસ્ટર ડેટા સેટ (સુધારેલા અભ્યાસક્રમ મુજબ)
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
      correct: 3 // સાચો જવાબ ઇન્ડેક્સ 3 (વિકલ્પ D)
    };
  });

  useEffect(() => {
    // સેન્ડબોક્સ સેશનમાંથી યુઝરના જવાબોની હિસ્ટ્રી ખેંચો
    const localData = localStorage.getItem(`mission_tat_result_${attemptId}`);
    if (localData) {
      setAttemptData(JSON.parse(localData));
    } else {
      // બેકઅપ ડમી જવાબો (જો હિસ્ટ્રી ના મળે તો)
      setAttemptData({
        testId: "tat_live_mock_test",
        selectedAnswers: { 1: 3, 2: 1, 3: 3 } // ડમી અટેમ્પ્ટેડ લોગ
      });
    }
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
            <h2 style={{ margin: "4px 0 0 0", color: "#2f3640", fontSize: "18px" }}>૧૫૦ પ્રશ્નોની સંપૂર્ણ આન્સર કી</h2>
          </div>
          <button 
            onClick={() => window.location.href = "/mock-test/dashboard"}
            style={{ backgroundColor: "#2980b9", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}
          >
            🏫 ડેશબોર્ડ પર જાઓ
          </button>
        </div>

        {/* 📚 150 QUESTIONS SOLUTIONS LIST CONTAINER */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {dummyQuestions.map((q) => {
            const userAns = attemptData?.selectedAnswers?.[q.id];
            const isAnswered = userAns !== undefined;
            const isCorrect = isAnswered && userAns === q.correct;

            // 🎨 સ્ટેટસ એલર્ટ કાર્ડ બેકગ્રાઉન્ડ સેટિંગ્સ
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
                {/* Section Meta Tag */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <span style={{ backgroundColor: "#f5f6fa", color: "#7f8c8d", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold" }}>{q.section}</span>
                  <span style={{ fontSize: "12px", fontWeight: "bold", color: labelColor }}>{statusLabel}</span>
                </div>

                {/* Question Text */}
                <h3 style={{ fontSize: "16px", color: "#2c3e50", lineHeight: "1.6", margin: "0 0 16px 0" }}>
                  <strong>પ્રશ્ન {q.id}:</strong> {q.questionText}
                </h3>

                {/* Options Layout Matrix */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {q.options.map((opt, idx) => {
                    const isUserSelection = userAns === idx;
                    const isCorrectOption = q.correct === idx;

                    let optBg = "#f9f9f9";
                    let optBorder = "1px solid #dcdde1";
                    let optIcon = "";

                    if (isCorrectOption) {
                      optBg = "#d5f5e3"; // સાચો ઓપ્શન હંમેશા લીલો દેખાશે
                      optBorder = "1px solid #2ecc71";
                      optIcon = " ✅ (સાચો જવાબ)";
                    } else if (isUserSelection && !isCorrect) {
                      optBg = "#fadbd8"; // જો યુઝરે ખોટો ટીક કર્યો હોય તો એ લાલ દેખાશે
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