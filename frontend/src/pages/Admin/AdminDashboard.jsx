import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://mission-tat-backend.onrender.com";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ title: "", subtitle: "", description: "", price: "0", discount: "0", category: "TAT Secondary", isPaid: false });
  
  const [pdfLinksText, setPdfLinksText] = useState(""); 
  const [thumbnailFile, setThumbnailFile] = useState(null); // પાછું જૂનું ફાઈલ સ્ટેટ

  const [editingId, setEditingId] = useState(null);
  const [activeFiles, setActiveFiles] = useState([]); 
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  const categories = ["Mathematics", "Science", "Competitive Exams", "HTAT", "HMAT", "TET 1", "TET 2", "TAT Secondary", "TAT Higher Secondary", "Pedagogy", "Gujarati Vyakaran"];

  useEffect(() => { 
    fetchInventory(); 
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data);
    } catch(e) { console.error(e); }
  };

  const convertToDirectLink = (url) => {
    if (!url) return "";
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/) || url.match(/id=([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return `https://docs.google.com/uc?export=view&id=${match[1]}`;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    const linkLines = pdfLinksText.split("\n").map(l => l.trim()).filter(Boolean);
    const formattedFiles = linkLines.map((link, index) => {
      return {
        fileName: `Material File ${index + 1}`,
        fileUrl: convertToDirectLink(link)
      };
    });

    if (formattedFiles.length === 0 && !editingId) {
      setStatus({ loading: false, success: null, error: "🔗 કૃપા કરીને ઓછામાં ઓછી એક PDF લિંક નાખો ભાઈ." });
      return;
    }

    // ફોર્મ ડેટા (Multipart) ઈમેજ મોકલવા માટે
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
            <label style={{ display: "block", marginBottom: "10px", fontSize: "14px", color: "#a1a1aa", fontWeight: "bold" }}>🗂️ કેટેગરીઝ:</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", maxHeight: "150px", overflowY: "auto" }}>
              {categories.map(cat => (
                <label key={cat} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                  <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCategoryCheckboxChange(cat)} style={{ accentColor: "#dc2626" }} />
                  {cat}
                </label>
              ))}
            </div>
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
                    <button onClick={() => handleEditClick(prod)} style={{ background: "#27272a", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px" }}>🔧 Edit</button>
                    <button onClick={() => handleDeleteClick(pId)} style={{ background: "rgba(220,38,38,0.1)", color: "#dc2626", border: "1px solid #dc2626", padding: "8px 14px", borderRadius: "6px" }}>🗑️ Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}