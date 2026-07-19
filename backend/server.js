import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Razorpay from "razorpay";
import crypto from "crypto"; 
import { db } from "./config/firebase.js";
import fs from "fs/promises";
import { getProducts, createProduct, updateProduct, deleteProduct, viewPdf, downloadPdf, uploadConfig } from "./controllers/productController.js";
import { firebaseLogin } from './controllers/authController.js';
import mockTestRoutes from "./routes/mockTestRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// Razorpay Instance Configuration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Routing
app.use("/api/mock-tests", mockTestRoutes);
app.use("/public/uploads", express.static(path.join(__dirname, "public/uploads")));

// ડાયનેમિક પેપર જનરેટર રૂટ
app.post("/api/generate-mains-paper", async (req, res) => {
  try {
    const { subjectId } = req.body;
    const fileName = subjectId === 'sci_tech_maths' ? 'secondary_science_maths.json' : 'default.json';
    const filePath = path.join(__dirname, "data", fileName);
    
    const rawData = await fs.readFile(filePath, "utf-8");
    res.status(200).json({ success: true, papers: JSON.parse(rawData) });
  } catch (err) {
    console.error("Generator Error:", err);
    res.status(500).json({ error: "Data file not found or error reading file" });
  }
});

// 💳 ૧. Razorpay ઓર્ડર ક્રિએટ કરવાનો રાઉટ (POST)
app.post("/api/payments/order", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const options = {
      amount: amount * 100, 
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ success: false, error: "ઓર્ડર જનરેટ કરવામાં ભૂલ થઈ." });
  }
});

// 💳 ૨. પેમેન્ટ વેરીફાય કરવાનો અને ડેટાબેઝમાં ખરીદી નોંધવાનો રાઉટ (POST) - આ મિસિંગ હતો!
app.post("/api/payments/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, productId, userId, userName } = req.body;

    // Razorpay સિગ્નેચર વેરીફિકેશન લોજિક
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // પેમેન્ટ સિક્યોર છે, હવે ફાયરબેઝના 'purchases' કલેક્શનમાં એન્ટ્રી પાડો જેથી ફ્રન્ટએન્ડ અનલોક કરી શકે
      const purchaseData = {
        userId: userId || "",
        userName: userName || "Anonymous",
        productId: productId || "",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        purchasedAt: new Date().toISOString()
      };

      await db.collection("purchases").add(purchaseData);
      return res.status(200).json({ success: true, message: "પેમેન્ટ વેરીફાય થયું અને મટીરિયલ અનલોક થયું!" });
    } else {
      return res.status(400).json({ success: false, error: "Invalid payment signature!" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, error: "પેમેન્ટ વેરીફિકેશન પ્રક્રિયા નિષ્ફળ થઈ." });
  }
});

// 💳 ૩. પેમેન્ટ સ્ટેટસ વેરીફાય કરવાનો રાઉટ (GET)
app.get("/api/payments/check-status", async (req, res) => {
  try {
    const { productId, userId } = req.query;
    
    const purchaseSnapshot = await db.collection("purchases")
      .where("userId", "==", userId)
      .where("productId", "==", productId)
      .get();

    if (!purchaseSnapshot.empty) {
      return res.status(200).json({ hasPurchased: true });
    }
    res.status(200).json({ hasPurchased: false });
  } catch (error) {
    console.error("Check status error:", error);
    res.status(500).json({ error: "પેમેન્ટ સ્ટેટસ ચેક કરવામાં ભૂલ થઈ." });
  }
});

// 📊 1. રીઅલ-ટાઇમ ટ્રાફિક કાઉન્ટર રાઉટ (Hit Counter)
app.post("/api/analytics/hit", async (req, res) => {
  try {
    const trafficRef = db.collection("analytics").doc("site_traffic");
    const doc = await trafficRef.get();
    
    if (!doc.exists) {
      await trafficRef.set({ views: 1 });
    } else {
      await trafficRef.update({ views: (doc.data().views || 0) + 1 });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Traffic hit error:", error);
    res.status(500).json({ success: false });
  }
});

// 📊 2. એનાલિટિક્સ ડેટા મેળવવાનો રાઉટ
app.get("/api/analytics/traffic", async (req, res) => {
  try {
    const feedbackSnapshot = await db.collection("feedbacks").get();
    const productsSnapshot = await db.collection("products").get();
    const trafficDoc = await db.collection("analytics").doc("site_traffic").get();

    const totalFeedbacks = feedbackSnapshot.size;
    const totalViews = trafficDoc.exists ? (trafficDoc.data().views || 0) : 0;
    
    let totalDemands = 0;
    feedbackSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.materialDemand && data.materialDemand.trim() !== "") {
        totalDemands++;
      }
    });

    res.status(200).json({
      success: true,
      totalFeedbacks,
      totalDemands,
      totalViews,
      totalProducts: productsSnapshot.size
    });
  } catch (error) {
    console.error("Analytics Route Error:", error);
    res.status(500).json({ success: false, error: "સર્વરથી ટ્રાફિક ડેટા લોડ કરવામાં ભૂલ થઈ." });
  }
});

// ઓરિજિનલ પ્રોડક્ટ કંટ્રોલર્સ
app.get("/api/products", getProducts);
app.post("/api/products", uploadConfig, createProduct); 
app.put("/api/products/:id", uploadConfig, updateProduct);
app.delete("/api/products/:id", deleteProduct);
app.post('/api/auth/firebase-login', firebaseLogin);

// 💬 ૧. તાજેતરના બધા જ સજેશન્સ મેળવવાનો રાઉટ (GET)
app.get("/api/feedback", async (req, res) => {
  try {
    const snapshot = await db.collection("feedbacks").orderBy("createdAt", "desc").get();
    const feedbacks = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      feedbacks.push({ 
        id: doc.id, 
        ...data,
        mobile: data.userId || "નથી નોંધાયો"
      });
    });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Fetch feedback error:", error);
    res.status(500).json({ error: "ફીડબેક લોડ કરવામાં ભૂલ થઈ." });
  }
});

// 📝 ૨. નવો ફીડબેક પબ્લિશ કરવાનો રાઉટ (POST)
app.post("/api/feedback", async (req, res) => {
  try {
    const { materialDemand, reviewText, userName, userId } = req.body;
    
    const newFeedback = {
      materialDemand: materialDemand || "",
      reviewText: reviewText || "", 
      userName: userName || "Anonymous",
      userId: userId || "",
      createdAt: new Date().toISOString()
    };

    await db.collection("feedbacks").add(newFeedback);
    res.status(201).json({ success: true, message: "સૂચન સફળતાપૂર્વક પબ્લિશ થયું!" });
  } catch (error) {
    console.error("Add feedback error:", error);
    res.status(500).json({ error: "સૂચન સબમિટ કરવામાં ભૂલ થઈ." });
  }
});

// 💬 ૩. એડમિન દ્વારા કમેન્ટનો જવાબ (Reply) સબમિટ કરવાનો રાઉટ (POST)
app.post("/api/feedback/:id/reply", async (req, res) => {
  try {
    const { id } = req.params;
    const { adminReply } = req.body;

    const feedbackRef = db.collection("feedbacks").doc(id);
    await feedbackRef.update({
      adminReply: adminReply || "",
      repliedAt: new Date().toISOString()
    });

    res.status(200).json({ success: true, message: "જવાબ સફળતાપૂર્વક સબમિટ થયો!" });
  } catch (error) {
    console.error("Reply submit error:", error);
    res.status(500).json({ error: "જવાબ ગોઠવવામાં લોચો થયો." });
  }
});

// 🗑️ ૪. એડમિન દ્વારા કમેન્ટ ડિલીટ કરવાનો રાઉટ (DELETE)
app.delete("/api/feedback/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("feedbacks").doc(id).delete();
    res.status(200).json({ success: true, message: "પ્રતિભાવ સફળતાપૂર્વક ડિલીટ થયો!" });
  } catch (error) {
    console.error("Delete feedback error:", error);
    res.status(500).json({ error: "પ્રતિભાવ ડિલીટ કરવામાં ભૂલ થઈ." });
  }
});

// SERVER START
app.listen(5000, () => console.log("🚀 MISSION TAT GUJARAT Backend Live on Port 5000"));