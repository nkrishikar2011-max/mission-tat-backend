// backend/routes/mockTestRoutes.js
// (FARJIYAT AKHI FILE REPLACE - Server to Frontend Bridge Sync)

import express from "express";
import { db } from "../config/firebase.js";

const router = express.Router();

// 1. Route: Get All Mock Tests (/api/mock-tests/all)
router.get("/all", async (req, res) => {
  try {
    const snapshot = await db.collection("mock_tests").get();
    const tests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(tests);
  } catch (error) {
    console.error("Dashboard fetch error on backend:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Route: Bulk Import Mock Test (/api/mock-tests/bulk-import)
router.post("/bulk-import", async (req, res) => {
  try {
    const testData = req.body;
    
    // ડેટાબેઝ સેવિંગ ઓટોમેશન
    const docRef = await db.collection("mock_tests").add({
      title: testData.title,
      duration: testData.duration,
      totalMarks: testData.totalMarks,
      isPaid: testData.isPaid ?? true,
      examType: testData.examType || "TET_2_MATHS",
      questions: testData.questions || [],
      createdAt: new Date().toISOString()
    });
    
    res.status(201).json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Admin bulk import error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Route: Get User Exam Attempts History (/api/mock-tests/user-history/:uid)
router.get("/user-history/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const snapshot = await db.collection("attempts")
      .where("userId", "==", uid)
      .get();
    
    const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Route: Delete Mock Test (/api/mock-tests/:id)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("mock_tests").doc(id).delete();
    res.status(200).json({ success: true, message: "Test removed from portal" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;