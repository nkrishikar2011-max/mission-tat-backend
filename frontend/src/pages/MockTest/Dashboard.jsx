// frontend/src/pages/MockTest/Dashboard.jsx
// (FARJIYAT AKHI FILE REPLACE - Multi-Stage Lock/Unlock Comfort Layout Engine)

import React, { useState, useEffect } from "react";

export default function MockTestDashboard() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 🧭 નેવિગેશન સ્ટેટ્સ: 'EXAM_TYPE' -> 'TET2_SUBJECTS' -> 'TEST_LIST'
  const [viewStage, setViewStage] = useState("EXAM_TYPE"); 
  const [selectedExam, setSelectedExam] = useState(""); // "TET1" or "TET2"
  const [selectedSubject, setSelectedSubject] = useState(""); // "maths", "bhasha", "samajik"

  useEffect(() => {
    const sessionData = localStorage.getItem("mission_tat_logged_in_user");
    if (sessionData) {
      setUserProfile(JSON.parse(sessionData));
    } else {
      // સેન્ડબોક્સ બેકઅપ પ્રોફાઇલ
      setUserProfile({
        name: "શિક્ષક મિત્ર",
        mobile: "9999999999",
        isTet1Unlocked: false,
        isTet2MathsUnlocked: false,
        isTet2BhashaUnlocked: false,
        isTet2SamajikUnlocked: false
      });
    }
    setLoading(false);
  }, []);

  // 🔒 લાઈફટાઈમ અનલોક સ્ટેટસ વેલિડેશન ચેક
  const checkUnlockStatus = () => {
    if (selectedExam === "TET1") return userProfile?.isTet1Unlocked;
    if (selectedExam === "TET2") {
      if (selectedSubject === "maths") return userProfile?.isTet2MathsUnlocked;
      if (selectedSubject === "bhasha") return userProfile?.isTet2BhashaUnlocked;
      if (selectedSubject === "samajik") return userProfile?.isTet2SamajikUnlocked;
    }
    return false;
  };

  const isCurrentPackageUnlocked = checkUnlockStatus();

  // 📝 ડાયનેમિક ૫૦ મોક ટેસ્ટ જનરેટર (૨ ફ્રી + ૪૮ પેઇડ)
  const generateTestMatrix = () => {
    const titlePrefix = selectedExam === "TET1" 
      ? "TET-1 જનરલ મોક ટેસ્ટ" 
      : `TET-2 ${selectedSubject === "maths" ? "ગણિત-વિજ્ઞાન" : selectedSubject === "bhasha" ? "ભાષા વિષય" : "સામાજિક વિજ્ઞાન"} મોક ટેસ્ટ`;

    return Array.from({ length: 50 }, (_, i) => ({
      id: `${selectedExam}_${selectedSubject || "gen"}_test_${i + 1}`,
      title: `${titlePrefix} - ${String(i + 1).padStart(2, "0")}`,
      totalQuestions: i < 2 ? 15 : 150, // ફ્રી ટેસ્ટ નાની અને મોક ટેસ્ટ ફૂલ લેન્થ
      duration: i < 2 ? 20 : 120,
      isFree: i < 2 
    }));
  };

  const handleStartExam = (testId, isFree) => {
    if (!isFree && !isCurrentPackageUnlocked) {
      alert("🔒 આ પ્રીમિયમ મોક ટેસ્ટ લોક છે ભાઈ! કૃપા કરીને તેને અનલોક કરવા માટે ઉપર આપેલા બટન પરથી પેમેન્ટ કરો.");
      return;
    }
    alert(`🚀 પરીક્ષા એન્જિન શરૂ થઈ રહ્યું છે ભાઈ! બેસ્ટ ઓફ લક.`);
    window.location.href = `/mock-test/live/${testId}`;
  };

  // 💳 સિમ્યુલેટેડ લાઈફટાઈમ ક્લાઉડ અનલોક પ્રોસેસર (લૂપ બાયપાસ)
  const handleUnlockPackage = () => {
    const updatedProfile = { ...userProfile };
    if (selectedExam === "TET1") updatedProfile.isTet1Unlocked = true;
    if (selectedExam === "TET2") {
      if (selectedSubject === "maths") updatedProfile.isTet2MathsUnlocked = true;
      if (selectedSubject === "bhasha") updatedProfile.isTet2BhashaUnlocked = true;
      if (selectedSubject === "samajik") updatedProfile.isTet2SamajikUnlocked = true;
    }
    setUserProfile(updatedProfile);
    localStorage.setItem("mission_tat_logged_in_user", JSON.stringify(updatedProfile));
    alert("🎉 અલ્ટ્રા સિક્યોર પેમેન્ટ સક્સેસ! આ કોર્સની તમામ ૪૮ ટેસ્ટ લાઈફટાઈમ માટે અનલોક થઈ ગઈ છે ભાઈ.");
  };

  if (loading) return <div style={{ color: "#2c3e50", backgroundColor: "#f4f6f8", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif" }}>⚙️ મુખ્ય ડેશબોર્ડ લોડ થઈ રહ્યું છે...</div>;

  return (
    <div style={{ backgroundColor: "#f4f6f8", color: "#2c3e50", minHeight: "100vh", padding: "30px 24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* TOP VIP WELCOME BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#ffffff", border: "1px solid #dcdde1", padding: "20px 30px", borderRadius: "20px", marginBottom: "30px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div>
            <span style={{ fontSize: "11px", color: "#2980b9", fontWeight: "bold", letterSpacing: "1px" }}>🛡️ MISSION TAT GUJARAT SYSTEM</span>
            <h2 style={{ margin: "4px 0 0 0", color: "#2f3640", fontSize: "20px" }}>👋 નમસ્તે, {userProfile?.name || "શિક્ષક મિત્ર"}</h2>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} style={{ backgroundColor: "#e74c3c", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>🚪 લોગઆઉટ</button>
          </div>
        </div>

        {/* STAGE 1: EXAM SELECTION MATRIX */}
        {viewStage === "EXAM_TYPE" && (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h3 style={{ color: "#2f3640", marginBottom: "30px", fontSize: "22px" }}>🎯 કૃપા કરીને તમારો મુખ્ય કોર્સ પસંદ કરો</h3>
            <div style={{ display: "flex", justifyContent: "center", gap: "24px" }}>
              <div onClick={() => { setSelectedExam("TET1"); setSelectedSubject(""); setViewStage("TEST_LIST"); }} style={{ backgroundColor: "#ffffff", border: "1px solid #dcdde1", padding: "40px 50px", borderRadius: "24px", cursor: "pointer", boxShadow: "0 6px 16px rgba(0,0,0,0.03)", transition: "transform 0.2s" }}>
                <span style={{ fontSize: "40px" }}>🏫</span>
                <h4 style={{ margin: "15px 0 0 0", fontSize: "20px", color: "#2c3e50" }}>TET - 1</h4>
                <p style={{ color: "#7f8c8d", fontSize: "12px", marginTop: "6px" }}>ધોરણ ૧ થી ૫ ના શિક્ષકો માટે</p>
              </div>
              <div onClick={() => { setSelectedExam("TET2"); setViewStage("TET2_SUBJECTS"); }} style={{ backgroundColor: "#ffffff", border: "1px solid #dcdde1", padding: "40px 50px", borderRadius: "24px", cursor: "pointer", boxShadow: "0 6px 16px rgba(0,0,0,0.03)" }}>
                <span style={{ fontSize: "40px" }}>📐</span>
                <h4 style={{ margin: "15px 0 0 0", fontSize: "20px", color: "#2c3e50" }}>TET - 2</h4>
                <p style={{ color: "#7f8c8d", fontSize: "12px", marginTop: "6px" }}>ધોરણ ૬ થી ૮ ના શિક્ષકો માટે</p>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: TET-2 SUBJECT SELECTION BOARD */}
        {viewStage === "TET2_SUBJECTS" && (
          <div>
            <button onClick={() => setViewStage("EXAM_TYPE")} style={{ background: "none", border: "none", color: "#2980b9", fontWeight: "bold", cursor: "pointer", marginBottom: "20px" }}>⬅️ મુખ્ય કોર્સ મેનુમાં પાછા જાઓ</button>
            <h3 style={{ color: "#2f3640", marginBottom: "25px", fontSize: "20px" }}>📚 તમારો સ્પેશિયલ વિષય પસંદ કરો:</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {[
                { id: "bhasha", title: "ભાષા (Language)", icon: "✍️" },
                { id: "maths", title: "ગણિત - વિજ્ઞાન (Maths & Sci)", icon: "🧮" },
                { id: "samajik", title: "સામાજિક વિજ્ઞાન (Social Sci)", icon: "🌍" }
              ].map((sub) => (
                <div key={sub.id} onClick={() => { setSelectedSubject(sub.id); setViewStage("TEST_LIST"); }} style={{ backgroundColor: "#ffffff", border: "1px solid #dcdde1", padding: "30px 20px", borderRadius: "20px", cursor: "pointer", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                  <span style={{ fontSize: "32px" }}>{sub.icon}</span>
                  <h4 style={{ margin: "12px 0 0 0", fontSize: "16px", color: "#2c3e50" }}>{sub.title}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 3: 50 TESTS CENTRAL SYSTEM (2 FREE + 48 LOCKED) */}
        {viewStage === "TEST_LIST" && (
          <div>
            <button onClick={() => { setViewStage(selectedExam === "TET1" ? "EXAM_TYPE" : "TET2_SUBJECTS"); }} style={{ background: "none", border: "none", color: "#2980b9", fontWeight: "bold", cursor: "pointer", marginBottom: "20px" }}>⬅️ પાછળ જાઓ</button>
            
            {/* PAYWALL UPGRADE PROMOTER BANNER */}
            <div style={{ backgroundColor: isCurrentPackageUnlocked ? "#e8f8f5" : "#fef9e7", border: isCurrentPackageUnlocked ? "1px solid #2ecc71" : "1px solid #f39c12", padding: "20px 24px", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
              <div>
                <h4 style={{ margin: 0, color: "#2c3e50", fontSize: "16px" }}>
                  🏁 સ્ટેટસ: {isCurrentPackageUnlocked ? "🔓 તમામ ૫૦ મોક ટેસ્ટ અનલોક છે ભાઈ!" : "🔒 ૨ ફ્રી ટેસ્ટ ચાલુ છે, બાકીની ૪૮ ટેસ્ટ લોક છે."}
                </h4>
                <p style={{ margin: "4px 0 0 0", color: "#7f8c8d", fontSize: "12px" }}>ખરીદ્યા બાદ તમામ ટેસ્ટ કાયમી માટે અનલોક જ રહેશે.</p>
              </div>
              {!isCurrentPackageUnlocked && (
                <button onClick={handleUnlockPackage} style={{ backgroundColor: "#f39c12", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}>
                  🎯 ₹499 માં આખો કોર્સ અનલોક કરો
                </button>
              )}
            </div>

            {/* MOCK TEST ITEMS LIST SCROLL */}
            <h3 style={{ color: "#2f3640", marginBottom: "20px", fontSize: "18px" }}>📋 મોક ટેસ્ટ શ્રેણી સીરીઝ (ટોટલ ૫૦ ટેસ્ટ)</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {generateTestMatrix().map((test) => {
                const isAccessible = test.isFree || isCurrentPackageUnlocked;
                return (
                  <div key={test.id} style={{ backgroundColor: "#ffffff", border: "1px solid #dcdde1", padding: "18px 24px", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: isAccessible ? 1 : 0.75 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <h4 style={{ margin: 0, fontSize: "15px", color: "#2c3e50" }}>{test.title}</h4>
                        {test.isFree ? (
                          <span style={{ backgroundColor: "#e8f8f5", color: "#2ecc71", fontSize: "10px", fontWeight: "bold", padding: "2px 6px", borderRadius: "4px" }}>FREE TEST</span>
                        ) : (
                          <span style={{ backgroundColor: isCurrentPackageUnlocked ? "#e8f4fd" : "#f5f6fa", color: isCurrentPackageUnlocked ? "#2980b9" : "#7f8c8d", fontSize: "10px", fontWeight: "bold", padding: "2px 6px", borderRadius: "4px" }}>
                            {isCurrentPackageUnlocked ? "🔓 UNLOCKED" : "🔒 LOCKED"}
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "16px", marginTop: "6px", fontSize: "12px", color: "#7f8c8d" }}>
                        <span>📋 પ્રશ્નો: <strong>{test.totalQuestions}</strong></span>
                        <span>⏱️ સમય: <strong>{test.duration} મિનિટ</strong></span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleStartExam(test.id, test.isFree)}
                      style={{ 
                        background: isAccessible ? "linear-gradient(135deg, #2980b9 0%, #3498db 100%)" : "#bdc3c7", 
                        color: "#fff", 
                        border: "none", 
                        padding: "10px 20px", 
                        borderRadius: "10px", 
                        fontWeight: "bold", 
                        cursor: isAccessible ? "pointer" : "not-allowed" 
                      }}
                    >
                      {test.isFree || isCurrentPackageUnlocked ? "ટેસ્ટ આપો ➡️" : "🔒 લોક છે"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}