import React, { useState } from "react";
import axios from "axios";

export default function ModelPaperGenerator() {
  const [examType, setExamType] = useState(""); 
  const [subject, setSubject] = useState("");
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePaperIdx, setActivePaperIdx] = useState(null);

  const subjectsList = examType === "HigherSecondary" ? [
    { id: "maths_hs", name: "MATHS GUJARATI MEDIUM" },
    { id: "sci_tech_maths", name: "SCIENCE & TECHNOLOGY-MATHS GUJARATI MEDIUM" }
  ] : [
    { id: "sci_tech_maths", name: "SCIENCE & TECHNOLOGY-MATHS GUJARATI MEDIUM" }
  ];

  const handleGeneratePapers = async () => {
    if (!examType || !subject) {
      alert("⚠️ કૃપા કરીને પરીક્ષાનો પ્રકાર અને વિષય પસંદ કરો ભાઈ!");
      return;
    }

    setLoading(true);
    setActivePaperIdx(null);

    try {
      const res = await axios.post("http://localhost:5000/api/generate-mains-paper", { 
        subjectId: subject 
      });
      
      if (res.data && res.data.papers) {
        setPapers(res.data.papers);
      } else {
        alert("❌ પેપર ડેટા મળ્યો નથી ભાઈ!");
      }
    } catch (err) {
      console.error(err);
      alert("❌ ડેટા લોડ કરવામાં ભૂલ આવી!");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = (paperTitle) => {
    alert(`📄 ${paperTitle} ની PDF ડાઉનલોડ થઈ રહી છે ભાઈ!`);
  };

  return (
    <div style={{ backgroundColor: "#09090b", color: "#f4f4f5", minHeight: "100vh", padding: "40px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        <h1 style={{ textAlign: "center", color: "#fff" }}>📝 TAT Mains ૨૦૦ ગુણનું મોડલ પેપર જનરેટર</h1>

        <div style={{ backgroundColor: "#1c1c1e", padding: "30px", borderRadius: "24px", marginBottom: "30px" }}>
          <select value={examType} onChange={(e) => setExamType(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "10px", borderRadius: "8px" }}>
            <option value="">-- પરીક્ષા પસંદ કરો --</option>
            <option value="Secondary">TAT Secondary</option>
            <option value="HigherSecondary">TAT Higher Secondary</option>
          </select>
          
          <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "10px", borderRadius: "8px" }}>
            <option value="">-- વિષય પસંદ કરો --</option>
            {subjectsList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          <button onClick={handleGeneratePapers} style={{ width: "100%", padding: "15px", backgroundColor: "#FFE07D", border: "none", borderRadius: "8px", fontWeight: "bold" }}>
            {loading ? "⚙️ જનરેટ થઈ રહ્યું છે..." : "🚀 ૨૦૦ માર્ક્સનું પેપર જનરેટ કરો"}
          </button>
        </div>

        {papers.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {papers.map((p, idx) => (
                <button key={idx} onClick={() => setActivePaperIdx(idx)} style={{ padding: "15px", borderRadius: "10px", backgroundColor: activePaperIdx === idx ? "#FFE07D" : "#27272a", color: activePaperIdx === idx ? "#000" : "#fff" }}>
                  📄 મોડલ પેપર {idx + 1}
                </button>
              ))}
            </div>

            <div style={{ backgroundColor: "#1c1c1e", padding: "30px", borderRadius: "20px" }}>
              {activePaperIdx !== null && papers[activePaperIdx] ? (
                <div>
                  <h2 style={{ color: "#FFE07D", marginBottom: "20px" }}>{papers[activePaperIdx].title}</h2>
                  
                  <h3 style={{ color: "#fff", borderBottom: "1px solid #444", marginTop: "20px" }}>📚 પેપર-૧ (ભાષા - ૧૦૦ ગુણ)</h3>
                  {papers[activePaperIdx].paper1?.map((sec, i) => (
                    <div key={i} style={{ marginBottom: "15px" }}>
                      <p style={{ fontWeight: "bold", color: "#60a5fa" }}>{sec.title}</p>
                      <ul style={{ color: "#d4d4d8" }}>
                        {sec.items?.map((item, j) => <li key={j}>{item}</li>)}
                      </ul>
                    </div>
                  ))}

                  <h3 style={{ color: "#fff", borderBottom: "1px solid #444", marginTop: "20px" }}>📚 પેપર-૨ (વિષયવસ્તુ અને પદ્ધતિ - ૧૦૦ ગુણ)</h3>
                  {papers[activePaperIdx].paper2?.map((sec, i) => (
                    <div key={i} style={{ marginBottom: "15px" }}>
                      <p style={{ fontWeight: "bold", color: "#4ade80" }}>{sec.title}</p>
                      <ul style={{ color: "#d4d4d8" }}>
                        {sec.items?.map((item, j) => <li key={j}>{item}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p>પેપર પસંદ કરો ભાઈ...</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}