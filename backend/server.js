import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Razorpay from "razorpay";
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

// ================= PAYMENTS API =================
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

app.post("/api/payments/verify", async (req, res) => {
  await db.collection("purchases").add({ userId: req.body.userId || "master_topper_user", productId: req.body.productId, unlockedAt: new Date().toISOString(), status: "Success" });
  res.status(200).json({ success: true });
});

app.get("/api/payments/check-status", async (req, res) => {
  const snap = await db.collection("purchases").where("userId", "==", req.query.userId || "master_topper_user").where("productId", "==", req.query.productId).get();
  res.status(200).json({ isPurchased: !snap.empty });
});

// ================= SERVER START =================
app.listen(5000, () => console.log("🚀 MISSION TAT GUJARAT Backend Live on Port 5000"));
// આ લાઈન તમારા server.js માં જ્યાં બાકીના રાઉટ્સ ઇમ્પોર્ટ કર્યા છે ત્યાં મૂકવી:


// અને જ્યાં app.use('/api/products', ...) લખ્યું છે તેની નીચે આ લાઈન જોડી દેવી:
