// frontend/src/pages/Auth/Login.jsx
// (FARJIYAT AKHI FILE REPLACE - Live Firebase Cloud Login Engine)

import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (mobileNumber.length < 10) {
        alert("🚨 કૃપા કરીને સાચો ૧૦ આંકડાનો મોબાઈલ નંબર લખો ભાઈ!");
        setLoading(false);
        return;
      }

      // 🔐 FIREBASE CLOUD MASQUERADE LAYER
      // મોબાઈલ નંબરને ફાયરબેઝ વેલિડેશન માટે સિક્યોર વર્ચ્યુઅલ ડોમેઈન માસ્કમાં કન્વર્ટ કરો
      const secureEmail = `${mobileNumber}@missiontat.com`;

      // Firebase Authentication સાથે લાઈવ સાઈન-ઈન વેરિફિકેશન
      const userCredential = await signInWithEmailAndPassword(auth, secureEmail, password);
      const user = userCredential.user;

      alert("🎉 ફાયરબેઝ વેલિડેશન સક્સેસ! મિશન TAT પોર્ટલ પર આપનું સ્વાગત છે ભાઈ.");
      
      // સેશન સુરક્ષા માટે લાઈવ લોગિન ડેટા લોકલ સ્ટોરેજમાં સેટ કરો
      localStorage.setItem("mission_tat_logged_in_user", JSON.stringify({
        uid: user.uid,
        mobile: mobileNumber,
        role: "teacher"
      }));

      // સીધા મોક ટેસ્ટ ડેશબોર્ડ પર રીડાયરેક્ટ કરો
      window.location.href = "/mock-test/dashboard";
    } catch (err) {
      console.error("Firebase Login Engine Error:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        alert("🔒 મોબાઈલ નંબર અથવા પાસવર્ડ ખોટો છે ભાઈ! ફરીથી ચેક કરી લો.");
      } else {
        alert(`❌ લોગિન ફેઈલ થયું ભાઈ: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f4f6f8", color: "#2c3e50", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif", padding: "20px" }}>
      <div style={{ maxWidth: "400px", width: "100%", backgroundColor: "#ffffff", border: "1px solid #dcdde1", borderRadius: "24px", padding: "40px 30px", textAlign: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.04)" }}>
        
        <span style={{ fontSize: "38px" }}>🎯</span>
        <h2 style={{ margin: "12px 0 6px 0", fontSize: "24px", color: "#2f3640", fontWeight: "bold" }}>મિશન TAT ગુજરાત</h2>
        <p style={{ color: "#7f8c8d", fontSize: "13px", margin: "0 0 30px 0" }}>શિક્ષક ઓટોમેટેડ ક્લાઉડ લોગિન</p>

        <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px", textAlign: "left" }}>
          
          <div>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#2c3e50", display: "block", marginBottom: "6px" }}>મોબાઈલ નંબર</label>
            <input 
              type="tel" 
              maxLength="10"
              placeholder="તમારો ૧૦ આંકડાનો નંબર લખો" 
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
              style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #dcdde1", backgroundColor: "#f9f9f9", color: "#2c3e50", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#2c3e50", display: "block", marginBottom: "6px" }}>પાસવર્ડ</label>
            <input 
              type="password" 
              placeholder="તમારો સિક્યોર પાસવર્ડ લખો" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #dcdde1", backgroundColor: "#f9f9f9", color: "#2c3e50", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "#2980b9", color: "#ffffff", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", marginTop: "10px" }}
          >
            {loading ? "⚙️ સિક્યોર વેરિફિકેશન..." : "પોર્ટલમાં લોગિન કરો ➡️"}
          </button>

        </form>

        <div style={{ marginTop: "20px", fontSize: "13px" }}>
          <span style={{ color: "#7f8c8d" }}>નવું એકાઉન્ટ બનાવવું છે? </span>
          <a href="/signup" style={{ color: "#27ae60", fontWeight: "bold", textDecoration: "none" }}>સાઈન-અપ કરો</a>
        </div>

      </div>
    </div>
  );
}