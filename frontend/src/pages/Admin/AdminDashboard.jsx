import React, { useState, useEffect } from "react";
import axios from "axios";

// 🛠️ લાઈવ વેરસેલ અને ઓનરેન્ડર સર્વર માટે અસલી લાઈવ બેકએન્ડ પાથ
const API_BASE_URL = "https://mission-tat-backend.onrender.com";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [formData, setFormData] = useState({ title: "", subtitle: "", description: "", price: "0", discount: "0", category: "TAT Secondary", isPaid: false });
  
  const [pdfLinksText, setPdfLinksText] = useState(""); 
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [adminReplies, setAdminReplies] = useState({});
  const [trafficData, setTrafficData] = useState({ totalFeedbacks: 0, totalDemands: 0 });
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  const categories = ["Mathematics", "Science", "Competitive Exams", "HTAT", "HMAT", "TET 1", "TET 2", "TAT Secondary", "TAT Higher Secondary", "Pedagogy", "Gujarati Vyakaran"];

  useEffect(() => { 
    fetchInventory(); 
    fetchUserFeedbacks();
    fetchTrafficAnalytics();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data);
    } catch(e) { console.error(e); }
  };

  const fetchUserFeedbacks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/feedback`);
      setFeedbacks(res.data);
    } catch (e) { console.error(e); }
  };

 const fetchTrafficAnalytics = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/analytics/traffic`);
    if (res.data.success) {
      setTrafficData({
        totalFeedbacks: res.data.totalFeedbacks,
        totalDemands: res.data.totalDemands,
        totalViews: res.data.totalViews || 0 // 📊 નવો ડેટા સેટ કર્યો
      });
    }
  } catch (e) { console.error("ટ્રાફિક ડેટા મેળવવામાં લોચો થયો:", e); }
};

  // 🛠️ ફિક્સ: ડાઉનલોડ માટે સાચી ડાયરેક્ટ ડાઉનલોડ લિંક બનાવશે
  const convertToDirectLink = (url) => {
    if (!url) return "";
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/) || url.match(/id=([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return `https://docs.google.com/uc?export=download&id=${match[1]}`;
    }
    return url;
  };

  // 🛠️ ફિક્સ: વ્યુ માટે સાચી ઓપન/પ્રીવ્યૂ લિંક બનાવશે
  const convertToPreviewLink = (url) => {
    if (!url) return "";
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/) || url.match(/id=([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return url;
  };

  const handleCategoryCheckboxChange = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("🗑️ શું તમે ખરેખર આ ઉમેદવારનો પ્રતિભાવ/કમેન્ટ ડિલીટ કરવા માંગો છો?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/feedback/${id}`);
      alert("🗑️ પ્રતિભાવ સફળતાપૂર્વક ડિલીટ થઈ ગયો ભાઈ!");
      fetchUserFeedbacks();
      fetchTrafficAnalytics();
    } catch (e) { console.error(e); alert("પ્રતિભાવ ડિલીટ પ્રક્રિયા નિષ્ફળ થઈ."); }
  };

  const handleReplySubmit = async (id) => {
    const replyText = adminReplies[id];
    if (!replyText || !replyText.trim()) return alert("કૃપા કરીને જવાબ લખો ભાઈ!");
    try {
      await axios.post(`${API_BASE_URL}/api/feedback/${id}/reply`, { adminReply: replyText });
      alert("🎯 તમારો જવાબ સ્ટોર પેજ પર લાઈવ થઈ ગયો!");
      setAdminReplies({ ...adminReplies, [id]: "" });
      fetchUserFeedbacks();
    } catch (e) { console.error(e); alert("જવાબ મોકલવામાં લોચો થયો."); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    const linkLines = pdfLinksText.split("\n").map(l => l.trim()).filter(Boolean);
    const formattedFiles = linkLines.map((link, index) => {
      return {
        fileName: `Material File ${index + 1}`,
        fileUrl: convertToDirectLink(link), // 📥 ડાઉનલોડ બટન માટે સાચો એન્ડપોઇન્ટ
        viewUrl: convertToPreviewLink(link)  // 👁️ વ્યુ બટન માટે પ્રીવ્યૂ એન્ડપોઇન્ટ
      };
    });

    if (formattedFiles.length === 0 && !editingId) {
      setStatus({ loading: false, success: null, error: "🔗 કૃપા કરીને ઓછામાં ઓછી એક PDF લિંક નાખો ભાઈ." });
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("discount", formData.discount);
    data.append("isPaid", formData.isPaid);
    data.append("category", selectedCategories[0] || formData.category);
    data.append("categories", JSON.stringify(selectedCategories));
    data.append("files", JSON.stringify(formattedFiles));

    if (thumbnailFile) {
      data.append("thumbnail", thumbnailFile);
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/products/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setStatus({ loading: false, success: "🎉 બંડલ સફળતાપૂર્વક અપડેટ થઈ ગયું!", error: null });
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE_URL}/api/products`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setStatus({ loading: false, success: "🎉 નવું બંડલ સફળતાપૂર્વક પબ્લિશ થઈ ગયું!", error: null });
      }

      setFormData({ title: "", subtitle: "", description: "", price: "0", discount: "0", category: "TAT Secondary", isPaid: false });
      setSelectedCategories([]);
      setPdfLinksText("");
      setThumbnailFile(null);
      fetchInventory();
      fetchTrafficAnalytics();
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, success: null, error: "ડેટા સેવ કરવામાં કોઈ ભૂલ થઈ." });
    }
  };

  const handleEditClick = (prod) => {
    const actualId = prod._id || prod.id;
    setEditingId(actualId);
    setThumbnailFile(null);
    
    if (prod.files && Array.isArray(prod.files)) {
      // ઓરિજિનલ લિંક્સ પાછી બતાવશે
      setPdfLinksText(prod.files.map(f => f.fileUrl).join("\n"));
    } else {
      setPdfLinksText("");
    }

    setSelectedCategories(prod.categories || [prod.category].filter(Boolean));

    setFormData({ 
      title: prod.title, 
      subtitle: prod.subtitle, 
      description: prod.description, 
      price: prod.price ? prod.price.toString() : "0", 
      discount: prod.discount ? prod.discount.toString() : "0", 
      category: prod.category || "TAT Secondary", 
      isPaid: Boolean(prod.isPaid) 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("🗑️ શું તમે ખરેખર આ બંડલ ડિલીટ કરવા માંગો છો?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`);
      fetchInventory();
      fetchTrafficAnalytics();
    } catch (e) { alert("ડિલીટ પ્રક્રિયા નિષ્ફળ થઈ."); }
  };

  return (
    <div style={{ backgroundColor: "#09090b", color: "#fff", minHeight: "100vh", padding: "40px 24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ borderBottom: "1px solid #27272a", paddingBottom: "20px", marginBottom: "30px" }}>
          <h1 style={{ margin: 0 }}>MISSION TAT GUJARAT - CONTROL HUB</h1>
          <p style={{ color: "#71717a", fontSize: "12px", margin: "4px 0 0 0" }}>CLOUDINARY IMAGE & DRIVE PDF HYBRID SYSTEM</p>
        </div>

        {status.success && <div style={{ background: "rgba(22,163,74,0.15)", border: "1px solid #16a34a", color: "#22c55e", padding: "12px", borderRadius: "10px", marginBottom: "20px" }}>{status.success}</div>}
        {status.error && <div style={{ background: "rgba(220,38,38,0.15)", border: "1px solid #dc2626", color: "#ef4444", padding: "12px", borderRadius: "10px", marginBottom: "20px" }}>{status.error}</div>}
        
        <form onSubmit={handleSubmit} style={{ backgroundColor: "#18181b", padding: "30px", borderRadius: "24px", display: "flex", flexDirection: "column", gap: "18px", border: "1px solid #27272a" }}>
          <h3 style={{ margin: 0 }}>{editingId ? "🔧 EDIT BUNDLE" : "🚀 PUBLISH NEW BUNDLE PACK"}</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "15px" }}>
            <div style={{ border: "2px dashed #27272a", padding: "20px", borderRadius: "12px", textAlign: "center", background: "#09090b" }}>
              <label style={{ cursor: "pointer", display: "block" }}>
                <span style={{ fontSize: "14px", color: "#a1a1aa" }}>
                  {thumbnailFile ? `🖼️ Selected Cover: ${thumbnailFile.name}` : "🖼️ Select Cover Image (Cloudinary Auto Upload)"}
                </span>
                <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0])} style={{ display: "none" }} />
              </label>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "14px", color: "#a1a1aa" }}>🔗 PDF ફાઇલોની Google Drive લિંક્સ (દરેક નવી લિંક નવી લાઇન પર એન્ટર કરો):</label>
            <textarea 
              rows="5"
              placeholder="https://drive.google.com/file/d/xxxx1/view&#10;https://drive.google.com/file/d/xxxx2/view"
              required 
              value={pdfLinksText} 
              onChange={(e) => setPdfLinksText(e.target.value)} 
              style={{ background: "#000", border: "1px solid #27272a", padding: "12px", color: "#fff", borderRadius: "10px", fontFamily: "monospace", fontSize: "13px" }} 
            />
          </div>

          <input type="text" placeholder="મટીરિયલ ટાઇટલ" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={{ background: "#000", border: "1px solid #27272a", padding: "12px", color: "#fff", borderRadius: "10px" }} />
          <input type="text" placeholder="સબટાઈટલ" required value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} style={{ background: "#000", border: "1px solid #27272a", padding: "12px", color: "#fff", borderRadius: "10px" }} />
          <textarea placeholder="વર્ણન (Description)" rows="3" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ background: "#000", border: "1px solid #27272a", padding: "12px", color: "#fff", borderRadius: "10px" }} />

          <div style={{ background: "#000", padding: "15px", borderRadius: "10px", border: "1px solid #27272a" }}>
            <label style={{ display: "block", marginBottom: "10px", fontSize: "14px", color: "#a1a1aa", fontWeight: "bold" }}>🗂️ કેટેગરીઝ સિલેક્ટ કરો (એકથી વધુ ટીક કરી શકો છો):</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", maxHeight: "150px", overflowY: "auto", paddingRight: "5px" }}>
              {categories.map(cat => (
                <label key={cat} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer", padding: "4px" }}>
                  <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCategoryCheckboxChange(cat)} style={{ accentColor: "#dc2626", width: "16px", height: "16px" }} />
                  {cat}
                </label>
              ))}
            </div>
            <p style={{ margin: "10px 0 0 0", fontSize: "11px", color: "#dc2626" }}>સિલેક્ટ કરેલી કેટેગરીઝ: {selectedCategories.join(", ") || "કોઈ નહિ"}</p>
          </div>

          <div style={{ display: "flex", background: "#000", padding: "4px", borderRadius: "10px", border: "1px solid #27272a" }}>
            <button type="button" onClick={() => setFormData({...formData, isPaid: false, price: "0"})} style={{ flex: 1, padding: "10px", background: !formData.isPaid ? "#27272a" : "transparent", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold" }}>Free</button>
            <button type="button" onClick={() => setFormData({...formData, isPaid: true})} style={{ flex: 1, padding: "10px", background: formData.isPaid ? "#dc2626" : "transparent", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold" }}>Premium</button>
          </div>

          {formData.isPaid && (
            <input type="number" placeholder="કિંમત (₹)" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={{ background: "#000", border: "1px solid #27272a", padding: "12px", color: "#fff", borderRadius: "10px" }} />
          )}

          <button type="submit" disabled={status.loading} style={{ background: "#dc2626", color: "#fff", padding: "14px", borderRadius: "10px", border: "none", fontWeight: "bold", cursor: "pointer" }}>
            {status.loading ? "🚀 સેવિંગ પ્રોસેસ..." : editingId ? "🔧 ફેરફાર સેવ કરો" : "🚀 પબ્લિશ મટીરિયલ"}
          </button>
        </form>

       {/* 📊 REAL-TIME TRAFFIC & ACTIVITY HUB */}
<div style={{ background: "#18181b", padding: "25px", borderRadius: "24px", border: "1px solid #27272a", marginBottom: "30px", marginTop: "30px" }}>
  <h3 style={{ margin: "0 0 15px 0", color: "#fff" }}>📊 રીઅલ-ટાઇમ ટ્રાફિક અને એક્ટિવિટી મોનિટર</h3>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px" }}>
    
    {/* ૧. કુલ સાઇટ વિઝિટ્સ */}
    <div style={{ background: "#09090b", padding: "20px", borderRadius: "16px", border: "1px solid #27272a", textAlign: "center" }}>
      <span style={{ fontSize: "28px" }}>📈</span>
      <h4 style={{ margin: "10px 0 5px 0", color: "#a1a1aa", fontSize: "14px" }}>કુલ સાઇટ વિઝિટ્સ</h4>
      <strong style={{ fontSize: "20px", color: "#a855f7" }}>{trafficData.totalViews || 0} ક્લિક્સ</strong>
    </div>

    {/* ૨. કુલ યુઝર્સ */}
    <div style={{ background: "#09090b", padding: "20px", borderRadius: "16px", border: "1px solid #27272a", textAlign: "center" }}>
      <span style={{ fontSize: "28px" }}>👥</span>
      <h4 style={{ margin: "10px 0 5px 0", color: "#a1a1aa", fontSize: "14px" }}>કુલ યુઝર્સ (ટ્રાફિક)</h4>
      <strong style={{ fontSize: "20px", color: "#3b82f6" }}>{trafficData.totalFeedbacks || 0} લોક</strong>
    </div>

    {/* ૩. મટીરિયલ ડિમાન્ડ */}
    <div style={{ background: "#09090b", padding: "20px", borderRadius: "16px", border: "1px solid #27272a", textAlign: "center" }}>
      <span style={{ fontSize: "28px" }}>📥</span>
      <h4 style={{ margin: "10px 0 5px 0", color: "#a1a1aa", fontSize: "14px" }}>મટીરિયલ ડિમાન્ડ</h4>
      <strong style={{ fontSize: "20px", color: "#16a34a" }}>{trafficData.totalDemands || 0} ક્લિક્સ</strong>
    </div>

    {/* ૪. પ્રીમિયમ પેક */}
    <div style={{ background: "#09090b", padding: "20px", borderRadius: "16px", border: "1px solid #27272a", textAlign: "center" }}>
      <span style={{ fontSize: "28px" }}>💰</span>
      <h4 style={{ margin: "10px 0 5px 0", color: "#a1a1aa", fontSize: "14px" }}>પ્રીમિયમ પેક</h4>
      <strong style={{ fontSize: "20px", color: "#dc2626" }}>{products.filter(p => p.isPaid).length}</strong>
    </div>

    {/* ૫. ફ્રી બંડલ */}
    <div style={{ background: "#09090b", padding: "20px", borderRadius: "16px", border: "1px solid #27272a", textAlign: "center" }}>
      <span style={{ fontSize: "28px" }}>🎁</span>
      <h4 style={{ margin: "10px 0 5px 0", color: "#a1a1aa", fontSize: "14px" }}>ફ્રી બંડલ</h4>
      <strong style={{ fontSize: "20px", color: "#eab308" }}>{products.filter(p => !p.isPaid).length}</strong>
    </div>

  </div>
</div>
        {/* INVENTORY HUB */}
        <div style={{ background: "#18181b", padding: "30px", borderRadius: "24px", border: "1px solid #27272a", marginTop: "30px" }}>
          <h3>📦 ઇન્વેન્ટરી કંટ્રોલ ({products.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {products.map(prod => {
              const pId = prod._id || prod.id;
              return (
                <div key={pId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#09090b", padding: "16px", borderRadius: "12px", border: "1px solid #27272a" }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{prod.title}</h4>
                    <span style={{ fontSize: "12px", color: "#71717a" }}>
                      {Array.isArray(prod.categories) ? prod.categories.join(", ") : (prod.category || "General")} • {prod.isPaid ? `₹${prod.price}` : "FREE"} • 📂 {prod.files?.length || 0} Links મોજૂદ છે
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => handleEditClick(prod)} style={{ background: "#27272a", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer" }}>🔧 Edit</button>
                    <button onClick={() => handleDeleteClick(pId)} style={{ background: "rgba(220,38,38,0.1)", color: "#dc2626", border: "1px solid #dc2626", padding: "8px 14px", borderRadius: "6px", cursor: "pointer" }}>🗑️ Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 📢 કમેન્ટ્સ અને રિવ્યૂ કંટ્રોલ હબ */}
        <div style={{ background: "#18181b", padding: "30px", borderRadius: "24px", border: "1px solid #27272a", marginTop: "30px" }}>
          <h3>📢 પરીક્ષાર્થીઓના સુઝાવ અને કમેન્ટ્સ કંટ્રોલ ({feedbacks.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" }}>
            {(!Array.isArray(feedbacks) || feedbacks.length === 0) ? (
              <p style={{ color: "#71717a", fontSize: "13px" }}>હજી સુધી કોઈ કમેન્ટ કે પ્રતિભાવ આવ્યો નથી ભાઈ.</p>
            ) : (
              feedbacks.map((f) => {
                const feedbackId = f._id || f.id;
                return (
                  <div key={feedbackId} style={{ background: "#09090b", padding: "16px", borderRadius: "12px", border: "1px solid #27272a", borderLeft: "4px solid #dc2626" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong style={{ color: "#fff" }}>{f.userName || "અજ્ઞાત પરીક્ષાર્થી"}</strong>
                        <small style={{ color: "#71717a", fontSize: "11px", display: "block", marginTop: "2px" }}>મોબાઈલ: {f.userMobile || "નથી નોંધાયો"}</small>
                      </div>
                      <button onClick={() => handleDeleteFeedback(feedbackId)} style={{ background: "rgba(220,38,38,0.1)", color: "#dc2626", border: "1px solid #dc2626", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>🗑️ Delete</button>
                    </div>
                    
                    {f.materialDemand && <p style={{ margin: "8px 0 4px 0", fontSize: "13px", color: "#eab308" }}><strong>🔍 ડિમાન્ડ:</strong> {f.materialDemand}</p>}
                    {f.reviewText && <p style={{ margin: "4px 0 8px 0", fontSize: "13px", color: "#d4d4d8" }}><strong>✍️ પ્રતિભાવ:</strong> {f.reviewText}</p>}
                    
                    {f.adminReply && (
                      <div style={{ background: "#18181b", padding: "10px", borderRadius: "8px", marginTop: "8px", borderLeft: "3px solid #16a34a" }}>
                        <span style={{ color: "#16a34a", fontSize: "12px", fontWeight: "bold" }}>તમારો ઓફિશિયલ જવાબ:</span>
                        <p style={{ margin: "4px 0 0 0", color: "#a1a1aa", fontSize: "13px" }}>{f.adminReply}</p>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                      <input 
                        type="text" 
                        placeholder="ઉમેદવારને સજ્જડ જવાબ આપો..." 
                        value={adminReplies[feedbackId] || ""} 
                        onChange={(e) => setAdminReplies({ ...adminReplies, [feedbackId]: e.target.value })} 
                        style={{ flex: 1, padding: "8px", backgroundColor: "#000", color: "#fff", border: "1px solid #27272a", borderRadius: "6px", fontSize: "13px" }} 
                      />
                      <button onClick={() => handleReplySubmit(feedbackId)} style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}>Reply</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}