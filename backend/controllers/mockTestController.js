// backend/controllers/mockTestController.js
// (Taddan navi file - Aakha module nu logic handles kare chhe)

import { db } from "../config/firebase.js";
import { createMockTestModel, createTestAttemptModel } from "../models/MockTest.js";

// 1. Navi Mock Test create karvi (Firebase aapoap collection banavshe)
export const createMockTest = async (req, res) => {
  try {
    const testData = createMockTestModel(req.body);
    
    // Check if test number already exists for this exam type
    const testCheck = await db.collection("mock_tests")
      .where("examType", "==", testData.examType)
      .where("testNumber", "==", testData.testNumber)
      .get();
      
    if (!testCheck.empty) {
      return res.status(400).json({ error: `🚨 ટેસ્ટ નંબર ${testData.testNumber} આ કેટેગરીમાં પહેલેથી બનેલો છે ભાઈ!` });
    }

    const docRef = await db.collection("mock_tests").add(testData);
    res.status(201).json({ success: true, id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Badhi available tests nu list melavvu
export const getAllMockTests = async (req, res) => {
  try {
    const snap = await db.collection("mock_tests").orderBy("testNumber", "asc").get();
    const tests = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Ek specific test prashno sathe melavvi
export const getMockTestById = async (req, res) => {
  try {
    const doc = await db.collection("mock_tests").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "Test not found" });
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Test submit karvi ane instant result save karvu
export const submitTestAttempt = async (req, res) => {
  try {
    const { userId, testId, userAnswers } = req.body;
    
    const testDoc = await db.collection("mock_tests").doc(testId).get();
    if (!testDoc.exists) return res.status(404).json({ error: "Test not found" });
    const testData = testDoc.data();

    let correctCount = 0;
    let wrongCount = 0;

    testData.questions.forEach((q) => {
      const userAns = userAnswers[q.questionId];
      if (userAns !== undefined && Number(userAns) === q.correctOption) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const attemptData = createTestAttemptModel(userId, testId, {
      examType: testData.examType,
      testNumber: testData.testNumber,
      score: correctCount,
      totalQuestions: testData.questions.length,
      correctCount,
      wrongCount,
      userAnswers
    });

    const attemptRef = await db.collection("test_attempts").add(attemptData);
    
    // Update User Profile Analytics (Oto updates)
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      const currentAttempted = userData.attemptedIds || [];
      if (!currentAttempted.includes(testId)) {
        await userRef.update({
          attemptedIds: [...currentAttempted, testId]
        });
      }
    }

    res.status(200).json({ success: true, attemptId: attemptRef.id, ...attemptData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. User ni potani test history melavvi
export const getUserHistory = async (req, res) => {
  try {
    const snap = await db.collection("test_attempts")
      .where("userId", "==", req.params.userId)
      .orderBy("attemptedAt", "desc")
      .get();
    const history = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};