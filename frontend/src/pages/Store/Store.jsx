import React, { useState, useEffect } from "react";
import axios from "axios";

const axiosInstance = axios;

export default function Store() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Materials");
  const [currentTab, setCurrentTab] = useState("materials");
  
  const [feedbacks, setFeedbacks] = useState([]);
  const [demandInput, setDemandInput] = useState("");
  const [reviewInput, setReviewInput] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // કસ્ટમ આઈડેન્ટિટી સ્ટેટ્સ
  const [user, setUser] = useState(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempMobile, setTempMobile] = useState("");

  const categories = ["All Materials", "Mathematics", "Science", "Competitive Exams", "HTAT", "HMAT", "TET 1", "TET 2", "TAT Secondary", "TAT Higher Secondary", "Pedagogy", "Gujarati Vyakaran"];

  const advancedModules = [
    { id: "ai", title: "🤖 AI Teacher", desc: "તમારા TAT અભ્યાસક્રમના કોઈપણ પ્રશ્નનું તાત્કાલિક સોલ્યુશન મેળવો." },
    { id: "tutor", title: "🧑‍🏫 Personal Tutor", desc: "તમારા નબળા વિષયો માટે પર્સનલાઈઝ્ડ લર્નિંગ રોડમેપ." },
    { id: "mock", title: "📝 Live Mock Tests", desc: "નવી પરીક્ષા પદ્ધતિ આધારિત નેગેટિવ માર્કિંગ વાળી ટેસ્ટ સીરીઝ." },
    { id: "notes", title: "📚 Quick Revision Notes", desc: "લાસ્ટ મિનિટ રિવિઝન માટે શોર્ટ ટિપ્સ અને ચાર્ટ્સ." },
    { id: "videos", title: "🎥 Premium Video Lectures", desc: "શ્રેષ્ઠ ફેકલ્ટી દ્વારા કન્સેપ્ટ ક્લિયરન્સ વિડીયો." }
  ];

  useEffect(() => { 
    fetchProducts(); 
    fetchFeedbacks();
    recordStoreHit(); // 📊 ઓટોમેટીક પેજ વિઝિટ રેકોર્ડ કરશે
    const savedUser = localStorage.getItem("custom_user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // 📊 ઓટોમેટીક ટ્રાફિક ટ્રેકર
  const recordStoreHit = async () => {
    try {
      await axiosInstance.post("https://mission-tat-backend.onrender.com/api/analytics/hit");
    } catch (e) { console.error("Traffic tracking log error", e); }
  };

  const formatImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/150";
    if (url.includes("localhost:5000")) {
      return url.replace("http://localhost:5000", "https://mission-tat-backend.onrender.com");
    }
    return url;
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("https://mission-tat-backend.onrender.com/api/products");
      setProducts(response.data);
    } catch (e) { console.error(e); }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await axiosInstance.get("https://mission-tat-backend.onrender.com/api/feedback");
      setFeedbacks(response.data);
    } catch (e) { console.error(e); }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!demandInput && !reviewInput) return alert("કૃપા કરીને મટીરિયલ ડિમાન્ડ અથવા રિવ્યૂ લખો!");
    
    if (!user) {
      setShowNameModal(true);
      return;
    }

    setFeedbackLoading(true);
    try {
      await axiosInstance.post("https://mission-tat-backend.onrender.com/api/feedback", {
        userId: user.mobile,
        userName: user.name,
        userMobile: user.mobile,
        materialDemand: demandInput,
        reviewText: reviewInput
      });
      setDemandInput("");
      setReviewInput("");
      alert("🎉 તમારું સૂચન સફળતાપૂર્વક સબમિટ થઈ ગયું છે!");
      fetchFeedbacks();
    } catch (err) { alert("સૂચન સબમિટ કરવામાં ભૂલ થઈ."); }
    finally { setFeedbackLoading(false); }
  };

  const saveIdentity = async (e) => {
    e.preventDefault();
    if (!tempName.trim() || !tempMobile.trim()) return alert("બંને વિગતો ભરવી ફરજિયાત છે!");
    
    const newIdentity = { name: tempName, mobile: tempMobile };
    localStorage.setItem("custom_user", JSON.stringify(newIdentity));
    setUser(newIdentity);
    setShowNameModal(false);
    
    setTempName("");
    setTempMobile("");

    executePaymentFlow(newIdentity);
  };

  const handleProductSelect = async (product) => {
    setSelectedProduct(product);
    if (!product.isPaid) { setIsUnlocked(true); return; }
    
    const userId = user ? user.mobile : "master_topper_user";
    try {
      const res = await axiosInstance.get(`https://mission-tat-backend.onrender.com/api/payments/check-status?productId=${product.id || product._id}&userId=${userId}`);
      setIsUnlocked(res.data.isPurchased);
    } catch (err) { setIsUnlocked(false); }
  };

  const triggerInlineView = (fileUrl) => {
    let liveUrl = fileUrl.includes("localhost:5000") 
      ? fileUrl.replace("http://localhost:5000", "https://mission-tat-backend.onrender.com") 
      : fileUrl;
    
    const match = liveUrl.match(/id=([a-zA-Z0-9-_]+)/) || liveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      liveUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    
    window.open(liveUrl, '_blank');
  };

  const triggerDownload = async (fileUrl) => {
    try {
      let liveUrl = fileUrl.includes("localhost:5000") 
        ? fileUrl.replace("http://localhost:5000", "https://mission-tat-backend.onrender.com") 
        : fileUrl;

      const match = liveUrl.match(/id=([a-zA-Z0-9-_]+)/) || liveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        liveUrl = `https://docs.google.com/uc?export=download&id=${match[1]}`;
      }

      window.open(liveUrl, '_blank');
    } catch (error) { 
      console.error(error);
      alert("❌ ડાઉનલોડ પ્રક્રિયામાં કોઈ ભૂલ થઈ."); 
    }
  };

  const executePaymentFlow = async (currentUser) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("https://mission-tat-backend.onrender.com/api/payments/order", { amount: selectedProduct.price });
      if (res.data.success) {
        const { order, keyId, isTestMode } = res.data;
        if (isTestMode) {
          if (window.confirm("💸 ટેસ્ટ મોડ પેમેન્ટ સિમ્યુલેશન: મટીરિયલ અનલોક કરવા OK દબાવો.")) {
            await axiosInstance.post("https://mission-tat-backend.onrender.com/api/payments/verify", { productId: selectedProduct.id || selectedProduct._id, userId: currentUser.mobile });
            setIsUnlocked(true);
          }
        } else {
          const options = {
            key: keyId, amount: order.amount, name: "MISSION TAT GUJARAT", order_id: order.id,
            handler: async () => { 
              await axiosInstance.post("https://mission-tat-backend.onrender.com/api/payments/verify", { productId: selectedProduct.id || selectedProduct._id, userId: currentUser.mobile }); 
              setIsUnlocked(true); 
            },
            prefill: { name: currentUser.name, contact: currentUser.mobile },
            theme: { color: "#dc2626" }
          };
          new window.Razorpay(options).open();
        }
      }
    } catch (err) { alert("❌ સર્વર એરર."); } 
    finally { setLoading(false); }
  };

  const initRazorpayPayment = async () => {
    if (!user) {
      setShowNameModal(true);
      return;
    }
    executePaymentFlow(user);
  };

  return (
    <div style={{ backgroundColor: "#09090b", color: "#fff", minHeight: "100vh", padding: "40px 24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* BRAND IDENTITY */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "900", letterSpacing: "1px", margin: 0 }}>MISSION TAT GUJARAT <span style={{ color: "#dc2626", fontSize: "14px", border: "1px solid #dc2626", padding: "2px 6px", borderRadius: "4px", marginLeft: "10px" }}>STORE</span></h1>
          <p style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>FREYA SOLUTION ACADEMY - PREMIUM RESOURCE HUB</p>
        </div>

        {/* PROFILE BANNER */}
        {user && (
          <div style={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "15px", padding: "15px", marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", color: "#a1a1aa" }}>👋 સ્વાગત છે, <strong style={{ color: "#fff" }}>{user.name}</strong> ({user.mobile})</span>
            <button onClick={() => { localStorage.removeItem("custom_user"); setUser(null); }} style={{ background: "none", color: "#ef4444", border: "none", cursor: "pointer", fontSize: "12px" }}>ઓળખ બદલો</button>
          </div>
        )}

        {/* TABS NAVIGATION */}
        <div style={{ display: "flex", borderBottom: "2px solid #27272a", marginBottom: "30px" }}>
          <button onClick={() => setCurrentTab("materials")} style={{ padding: "12px 24px", background: "transparent", border: "none", color: currentTab === "materials" ? "#dc2626" : "#71717a", borderBottom: currentTab === "materials" ? "2px solid #dc2626" : "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>📚 Study Materials Hub</button>
          <button onClick={() => setCurrentTab("advanced")} style={{ padding: "12px 24px", background: "transparent", border: "none", color: currentTab === "advanced" ? "#dc2626" : "#71717a", borderBottom: currentTab === "advanced" ? "2px solid #dc2626" : "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>⚡ Advanced Modules (AI & Tests)</button>
        </div>

        {/* TAB 1: MATERIALS LIST */}
        {currentTab === "materials" && (
          <>
            <div style={{ display: "flex", gap: "10px", marginBottom: "40px", overflowX: "auto", paddingBottom: "10px" }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: "8px 16px", fontSize: "12px", border: activeCategory === cat ? "1px solid #dc2626" : "1px solid #27272a", backgroundColor: activeCategory === cat ? "#dc2626" : "transparent", color: "#fff", borderRadius: "10px", cursor: "pointer", whiteSpace: "nowrap" }}>{cat}</button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "30px", marginBottom: "50px" }}>
              {products.filter(p => activeCategory === "All Materials" || (p.categories && p.categories.includes(activeCategory)) || p.category === activeCategory).map(prod => (
                <div key={prod.id || prod._id} onClick={() => handleProductSelect(prod)} style={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "20px", padding: "16px", cursor: "pointer" }}>
                  <img src={formatImageUrl(prod.thumbnail)} style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "12px" }} alt="cover" />
                  <div style={{ marginTop: "12px" }}>
                    <span style={{ color: "#dc2626", fontSize: "11px", fontWeight: "bold" }}>{Array.isArray(prod.categories) ? prod.categories.join(", ") : prod.category}</span>
                    <h3 style={{ margin: "4px 0" }}>{prod.title}</h3>
                    <span style={{ color: prod.isPaid ? "#dc2626" : "#16a34a", fontSize: "12px", fontWeight: "bold" }}>{prod.isPaid ? `₹${prod.price}` : "FREE"}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* TAB 2: ADVANCED */}
        {currentTab === "advanced" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px", marginBottom: "50px" }}>
            {advancedModules.map(mod => (
              <div key={mod.id} style={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "20px", padding: "24px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "12px", right: "-35px", background: "#eab308", color: "#000", fontSize: "10px", fontWeight: "bold", padding: "4px 35px", transform: "rotate(45deg)" }}>COMING SOON</div>
                <h3 style={{ margin: "0 0 10px 0", color: "#fff" }}>{mod.title}</h3>
                <p style={{ color: "#71717a", fontSize: "13px", lineHeight: "1.5", margin: 0 }}>{mod.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* FEEDBACK SYSTEM SECTION */}
        <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "24px", padding: "30px", marginTop: "40px" }}>
          <h2>📢 મટીરિયલ ડિમાન્ડ અને સજેશન ફોરમ</h2>
          <p style={{ color: "#a1a1aa", fontSize: "13px" }}>તમારો સાચો પ્રતિભાવ અને જરૂરી વિષય અહીં સબમિટ કરો.</p>
          
          <form onSubmit={handleFeedbackSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
            <input type="text" placeholder="તમારે કયા વિષયના PDF મટીરિયલની જરૂર છે? (દા.ત. TAT Secondary ગણિત)" value={demandInput} onChange={(e) => setDemandInput(e.target.value)} style={{ background: "#09090b", border: "1px solid #27272a", padding: "12px", color: "#fff", borderRadius: "10px" }} />
            <textarea placeholder="એપ વિશે તમારો રિવ્યૂ અહીં લખો..." rows="3" value={reviewInput} onChange={(e) => setReviewInput(e.target.value)} style={{ background: "#09090b", border: "1px solid #27272a", padding: "12px", color: "#fff", borderRadius: "10px" }} />
            <button type="submit" disabled={feedbackLoading} style={{ background: "#dc2626", color: "#fff", padding: "12px", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
              {feedbackLoading ? "સબમિટ થઈ રહ્યું છે..." : "🚀 સૂચન પબ્લિશ કરો"}
            </button>
          </form>

          {/* કમેન્ટ્સ લિસ્ટ */}
          <div style={{ marginTop: "30px", borderTop: "1px solid #27272a", paddingTop: "20px" }}>
            <h4 style={{ color: "#a1a1aa", marginBottom: "15px" }}>📌 તાજેતરના પરીક્ષાર્થીઓના સજેશન્સ ({feedbacks.length})</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "300px", overflowY: "auto" }}>
              {feedbacks.map(f => {
                const fId = f.id || f._id;
                return (
                  <div key={fId} style={{ background: "#09090b", padding: "15px", borderRadius: "12px", border: "1px solid #27272a" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#71717a", marginBottom: "6px" }}>
                      <span style={{ fontWeight: "bold", color: "#fff" }}>{f.userName}</span>
                      <span>{f.createdAt ? new Date(f.createdAt).toLocaleDateString("gu-IN") : ""}</span>
                    </div>
                    {f.materialDemand && <p style={{ margin: "4px 0", fontSize: "13px", color: "#eab308" }}><strong>🔍 ડિમાન્ડ:</strong> {f.materialDemand}</p>}
                    {f.reviewText && <p style={{ margin: "4px 0", fontSize: "13px", color: "#d4d4d8" }}><strong>✍️ પ્રતિભાવ:</strong> {f.reviewText}</p>}
                    
                    {f.adminReply && (
                      <div style={{ backgroundColor: "#18181b", padding: "10px", borderRadius: "8px", marginTop: "8px", borderLeft: "3px solid #22c55e", marginLeft: "10px" }}>
                        <strong style={{ color: "#22c55e", fontSize: "13px" }}>🧑‍🏫 👑 Mission TAT Gujarat (Admin):</strong>
                        <p style={{ color: "#a1a1aa", margin: "4px 0 0 0", fontSize: "13px" }}>{f.adminReply}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 👤 કસ્ટમ નેમ આઈડેન્ટિટી મોડલ */}
        {showNameModal && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 1000 }}>
            <div style={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "20px", padding: "25px", maxWidth: "400px", width: "100%" }}>
              <h3 style={{ margin: "0 0 10px 0" }}>👤 તમારી વિગત નોંધાવો</h3>
              <p style={{ color: "#a1a1aa", fontSize: "13px", marginBottom: "15px" }}>મટીરિયલ ઓર્ડર અને ડાઉનલોડ એક્સેસ ટ્રેકિંગ માટે કૃપા કરીને નામ અને ફોન નંબર આપો ભાઈ.</p>
              <form onSubmit={saveIdentity} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input type="text" placeholder="નામ" value={tempName} onChange={(e) => setTempName(e.target.value)} style={{ background: "#09090b", border: "1px solid #27272a", padding: "10px", color: "#fff", borderRadius: "8px" }} required />
                <input type="number" placeholder="મોબાઈલ નંબર" value={tempMobile} onChange={(e) => setTempMobile(e.target.value)} style={{ background: "#09090b", border: "1px solid #27272a", padding: "10px", color: "#fff", borderRadius: "8px" }} required />
                <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                  <button type="button" onClick={() => setShowNameModal(false)} style={{ flex: 1, padding: "10px", background: "#27272a", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>કેન્સલ</button>
                  <button type="submit" style={{ flex: 1, padding: "10px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>સેવ કરો</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* VAULT MODAL */}
        {selectedProduct && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 999 }}>
            <div style={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "24px", maxWidth: "600px", width: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 24px 12px 24px", borderBottom: "1px solid #27272a", position: "relative" }}>
                <button onClick={() => setSelectedProduct(null)} style={{ position: "absolute", top: "20px", right: "24px", background: "#27272a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>CLOSE</button>
                <h2 style={{ margin: "0 0 6px 0", paddingRight: "80px" }}>{selectedProduct.title}</h2>
                <p style={{ color: "#a1a1aa", margin: 0, fontSize: "14px" }}>{selectedProduct.subtitle}</p>
              </div>
              <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
                <p style={{ background: "#09090b", padding: "14px", borderRadius: "12px", fontSize: "13px", margin: "0 0 20px 0", border: "1px solid #27272a", lineHeight: "1.6" }}>{selectedProduct.description}</p>
                {!isUnlocked ? (
                  <button onClick={initRazorpayPayment} style={{ width: "100%", backgroundColor: "#dc2626", color: "#fff", padding: "14px", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" }}>{loading ? "Connecting..." : `Unlock Pack for ₹${selectedProduct.price}`}</button>
                ) : (
                  <div>
                    <h4 style={{ color: "#22c55e", margin: "0 0 12px 0" }}>🔓 અનલોક થયેલું મટીરિયલ બંડલ:</h4>
                    {selectedProduct.files && selectedProduct.files.length > 1 && (
                      <button onClick={() => selectedProduct.files.forEach(f => triggerDownload(f.fileUrl))} style={{ background: "#16a34a", color: "#fff", border: "none", padding: "10px 12px", borderRadius: "8px", cursor: "pointer", marginBottom: "15px", width: "100%", fontWeight: "bold" }}>⚡ Download All Files (Single Click)</button>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {selectedProduct.files?.map((file, idx) => (
                        <div key={idx} style={{ background: "#09090b", padding: "12px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #27272a" }}>
                          <span style={{ fontSize: "13px", paddingRight: "10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>{file.fileName}</span>
                          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                            <button onClick={() => triggerInlineView(file.fileUrl)} style={{ background: "#27272a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>View</button>
                            <button onClick={() => triggerDownload(file.fileUrl)} style={{ background: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Download</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}