// frontend/src/pages/MockTest/AnswerKey.jsx
// (Taddan navi file - Full Paper Solution & Color Coded Response Sheet)

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export default function AnswerKey() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadKeyData = async () => {
      try {
        setLoading(true);
        // લોકલ ટેસ્ટિંગ સેન્ડબોક્સ ડમી ડેટા (જો એપીઆઈ ડેટા મેચ ન થાય તો ક્રેશ રોકવા માટે)
        const mockAttempt = {
          score: 142,
          totalQuestions: 150,
          examType: "TET_2_MATHS",
          testNumber: 1,
          userAnswers: { "q_key_1": 0, "q_key_2": 1, "q_key_3": 2 }
        };

        const mockTest = {
          title: "TAT/TET-2 ગણિત અને મનોવિજ્ઞાન VIP મોક ટેસ્ટ - 01",
          questions: [
            { questionId: "q_key_1", questionText: "ગણિતના કોઈ પ્રમેયની સાબિતી આપવા માટે કઈ પદ્ધતિનો ઉપયોગ સામાન્ય રીતે ઉલટો કરવામાં આવે છે?", options: ["વિશ્લેષણ પદ્ધતિ", "સંશ્લેષણ પદ્ધતિ", "આગમન પદ્ધતિ", "નિગમન પદ્ધતિ"], correctOption: 0 },
            { questionId: "q_key_2", questionText: "જીન પિયાજેના જ્ઞાનાત્મક વિકાસના સિદ્ધાંત મુજબ 'મૂર્ત ક્રિયાત્મક તબક્કો' કયા વર્ષમાં જોવા મળે છે?", options: ["૦ થી ૨ વર્ષ", "૨ થી ૭ વર્ષ", "૭ થી ૧૧ વર્ષ", "૧૧ થી ૧૫ વર્ષ"], correctOption: 2 },
            { questionId: "q_key_3", questionText: "જો વર્તુળની ત્રિજ્યામાં ૧૦% નો વધારો કરવામાં આવે, તો તેના ક્ષેત્રફળમાં કેટલા ટકાનો વધારો થાય?", options: ["૧૦%", "૨૦%", "૨૧%", "૧૦૦%"], correctOption: 2 }
          ]
        };

        try {
          const res = await axios.get(`${API_BASE_URL}/api/mock-tests/user-history/TEST_GUEST_USER_123`);
          const currentAttempt = res.data.find(a => a.id === attemptId);
          if (currentAttempt) {
            setAttempt(currentAttempt);
            const testRes = await axios.get(`${API_BASE_URL}/api/mock-tests/${currentAttempt.testId}`);
            if (testRes.data) setTestData(testRes.data);
          } else {
            setAttempt(mockAttempt);
            setTestData(mockTest);
          }
        } catch (err) {
          setAttempt(mockAttempt);
          setTestData(mockTest);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadKeyData();
  }, [attemptId]);

  if (loading) return <div style={{ color: "#FFE07D", backgroundColor: "#09090b", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>⚙️ આન્સર-કી જનરેટ થઈ રહી છે...</div>;

  return (
    <div style={{ backgroundColor: "#09090b", color: "#f4f4f5", minHeight: "100vh", padding: "40px 24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "850px", margin: "0 auto" }}>
        
        {/* Top Header Panel */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1c1c1e", border: "1px solid #27272a", padding: "20px 30px", borderRadius: "20px", marginBottom: "30px" }}>
          <div>
            <span style={{ fontSize: "11px", color: "#FFE07D", fontWeight: "bold", textTransform: "uppercase" }}>ઓફિશિયલ આન્સર કી</span>
            <h2 style={{ margin: "4px 0 0 0", color: "#fff", fontSize: "20px" }}>{testData.title}</h2>
          </div>
          <button onClick={() => navigate("/mock-test/dashboard")} style={{ background: "linear-gradient(135deg, #FFE07D 0%, #F5B041 100%)", color: "#000", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
            ડેશબોર્ડ
          </button>
        </div>

        {/* Legend Box */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "24px", padding: "12px 20px", backgroundColor: "#1c1c1e", borderRadius: "12px", fontSize: "13px", border: "1px solid #27272a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><div style={{ width: "12px", height: "12px", backgroundColor: "rgba(34,197,94,0.2)", border: "1px solid #22c55e", borderRadius: "3px" }} /> <span style={{ color: "#22c55e", fontWeight: "bold" }}>સાચો જવાબ</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><div style={{ width: "12px", height: "12px", backgroundColor: "rgba(239,68,68,0.2)", border: "1px solid #ef4444", borderRadius: "3px" }} /> <span style={{ color: "#ef4444", fontWeight: "bold" }}>તમારો ખોટો જવાબ</span></div>
        </div>

        {/* Questions Grid Loop */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {testData.questions.map((q, idx) => {
            const userAns = attempt.userAnswers[q.questionId];
            const isCorrect = userAns !== undefined && Number(userAns) === q.correctOption;

            return (
              <div key={idx} style={{ backgroundColor: "#1c1c1e", border: "1px solid #27272a", padding: "24px", borderRadius: "20px" }}>
                <h4 style={{ margin: "0 0 16px 0", color: "#fff", lineHeight: "1.5", fontSize: "16px" }}>
                  {idx + 1}. {q.questionText}
                </h4>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {q.options.map((opt, oIdx) => {
                    let optBg = "#09090b";
                    let optBorder = "1px solid #27272a";
                    let markerColor = "#a1a1aa";

                    if (oIdx === q.correctOption) {
                      optBg = "rgba(34,197,94,0.15)";
                      optBorder = "1px solid #22c55e";
                      markerColor = "#22c55e";
                    } else if (userAns !== undefined && oIdx === Number(userAns) && !isCorrect) {
                      optBg = "rgba(239,68,68,0.15)";
                      optBorder = "1px solid #ef4444";
                      markerColor = "#ef4444";
                    }

                    return (
                      <div key={oIdx} style={{ padding: "14px 18px", background: optBg, border: optBorder, color: "#fff", borderRadius: "12px", fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <strong style={{ marginRight: "10px", color: markerColor }}>{String.fromCharCode(65 + oIdx)}.</strong> {opt}
                        </div>
                        {oIdx === q.correctOption && <span style={{ color: "#22c55e", fontWeight: "bold", fontSize: "12px" }}>✓ સાચું વિધાન</span>}
                        {userAns !== undefined && oIdx === Number(userAns) && !isCorrect && <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: "12px" }}>✗ તમારી પસંદગી</span>}
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