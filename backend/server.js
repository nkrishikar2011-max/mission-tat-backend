// backend/server.js
// (FARJIYAT AKHI FILE REPLACE - Original Systems + Premium Mock Test Payments Integration)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Razorpay from "razorpay";
import crypto from "crypto"; // Signature verification માટે જરૂરી
import { db } from "./config/firebase.js";
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  viewPdf, 
  downloadPdf, 
  uploadConfig 
} from "./controllers/productController.js";

// 📱 ઓટીપી લોગિન માટે નવું ફાયરબેઝ લોગિન ફંક્શન ઈમ્પોર્ટ કર્યું
import { firebaseLogin } from './controllers/authController.js';
import mockTestRoutes from "./routes/mockTestRoutes.js";

dotenv.config();

// ⚡ પૂર્વાવલોકન: પહેલા એપને ઇનિશિયલાઇઝ કરવી ફરજિયાત છે
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= MIDDLEWARES =================
app.use(cors());

// ⚡ ફિક્સ: સાઇઝ લિમિટ વધારીને 500mb કરી દો જેથી ૧૮ MB ની ફાઇલ સહેલાઈથી પાસ થઈ જાય
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// બેકએન્ડના સ્ટેટિક રૂટ્સ
app.use("/public/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// મોક ટેસ્ટ મેઈન એન્જિન રૂટ્સ
app.use("/api/mock-tests", mockTestRoutes);

// ================= RAZORPAY CONFIG =================
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_5M8UBrwvserR8o";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";
const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });

// ================= CORES ROUTING =================
app.get("/api/products", getProducts);
app.post("/api/products", uploadConfig, createProduct); 
app.put("/api/products/:id", uploadConfig, updateProduct);
app.delete("/api/products/:id", deleteProduct);
app.get("/api/products/view/:filename", viewPdf);
app.get("/api/products/download/:filename", downloadPdf);

// ================= FIREBASE FREE AUTH API =================
app.post('/api/auth/firebase-login', firebaseLogin);

// ================= USER PREMIUM STATUS & DATA FETCH =================
// મોક ટેસ્ટ ડેશબોર્ડ પર યુઝરનું પ્રીમિયમ સ્ટેટસ રિયલ-ટાઇમ ચેક કરવા માટે
app.get("/api/users/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();
    
    if (!doc.exists) {
      // જો યુઝર ડેટાબેઝમાં ન હોય, તો ડિફોલ્ટ ફ્રી સ્ટેટસ આપો
      return res.status(200).json({ uid, isPremium: false, premiumSubject: "" });
    }
    
    res.status(200).json(doc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= USER TRACKING & FEEDBACK =================
app.post("/api/users/track-download", async (req, res) => {
  try {
    const { uid } = req.body;
    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();
    if (!doc.exists) return res.status(404).json({ error: "User not found" });
    const currentData = doc.data();
    const updatedData = { xp: (currentData.xp || 0) + 10, downloadCount: (currentData.downloadCount || 0) + 1 };
    await userRef.update(updatedData);
    res.status(200).json({ success: true, ...updatedData });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post("/api/feedback", async (req, res) => {
  try {
    const { userId, userName, materialDemand, reviewText } = req.body;
    const docRef = await db.collection("feedbacks").add({ userId, userName, materialDemand, reviewText, createdAt: new Date().toISOString() });
    res.status(201).json({ success: true, id: docRef.id });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get("/api/feedback", async (req, res) => {
  const snap = await db.collection("feedbacks").orderBy("createdAt", "desc").get();
  res.status(200).json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
});

app.delete("/api/feedback/:id", async (req, res) => {
  try {
    await db.collection("feedbacks").doc(req.params.id).delete();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/feedback/:id/reply", async (req, res) => {
  try {
    const { adminReply } = req.body;
    await db.collection("feedbacks").doc(req.params.id).update({
      adminReply,
      repliedAt: new Date().toISOString()
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= MOCK TEST PREMIUM PAYMENTS HUB (NEW INTEGRATION) =================

// 1. ઓર્ડર ક્રિએશન એન્ડપોઇન્ટ (મોક ટેસ્ટ પ્રીમિયમ અનલોક - ₹49)
app.post("/api/payments/create-order", async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "User ID missing" });

    const options = {
      amount: Math.round(Number(amount) * 100), // પૈસામાં રૂપાંતર
      currency: "INR",
      receipt: `mock_test_rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Mock Test Payment Order Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. પેમેન્ટ વેરિફિકેશન અને ઓટો-અપગ્રેડ પ્રોફાઇલ ગેટવે
app.post("/api/payments/verify", async (req, res) => {
  try {
    const { userId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    // સિક્યોરિટી સિગ્નેચર હેસ ચેક
    const generatedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature === razorpaySignature || RAZORPAY_KEY_SECRET === "dummy_secret") {
      // ઓટોમેટેડ ડેટાબેઝ અપગ્રેડેશન - યુઝરને લાઈવ Premium અને વિષય એલોટ કરો
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      const premiumPayload = {
        isPremium: true,
        premiumSubject: "TET_2_MATHS",
        updatedAt: new Date().toISOString()
      };

      if (!userDoc.exists) {
        await userRef.set(premiumPayload);
      } else {
        await userRef.update(premiumPayload);
      }

      // પર્ચેઝ લોગ રેકોર્ડ કરો
      await db.collection("purchases").add({
        userId,
        productId: "MOCK_TEST_PREMIUM_PASS",
        razorpayPaymentId,
        unlockedAt: new Date().toISOString(),
        status: "Success"
      });

      res.status(200).json({ success: true, message: "👑 Premium Status Activated Successfully!" });
    } else {
      res.status(400).json({ success: false, message: "Invalid Payment Signature!" });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================= ORIGINAL PAYMENTS API (EXISTING STORE) =================
app.post("/api/payments/order", async (req, res) => {
  try {
    const { amount } = req.body;
    if (RAZORPAY_KEY_SECRET === "dummy_secret") {
       return res.status(200).json({ success: true, isTestMode: true, keyId: RAZORPAY_KEY_ID, order: { id: `order_${Date.now()}`, amount: amount * 100, currency: "INR" } });
    }
    const order = await razorpay.orders.create({ amount: Math.round(Number(amount) * 100), currency: "INR", receipt: `rcpt_${Date.now()}` });
    res.status(200).json({ success: true, order, keyId: RAZORPAY_KEY_ID });
  } catch (error) { res.status(500).json({ success: false }); }
});

app.post("/api/payments/order/verify", async (req, res) => {
  await db.collection("purchases").add({ userId: req.body.userId || "master_topper_user", productId: req.body.productId, unlockedAt: new Date().toISOString(), status: "Success" });
  res.status(200).json({ success: true });
});

app.get("/api/payments/check-status", async (req, res) => {
  const snap = await db.collection("purchases").where("userId", "==", req.query.userId || "master_topper_user").where("productId", "==", req.query.productId).get();
  res.status(200).json({ isPurchased: !snap.empty });
});

// ================= SERVER START =================
app.listen(5000, () => console.log("🚀 MISSION TAT GUJARAT Backend Live on Port 5000"));