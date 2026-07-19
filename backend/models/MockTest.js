// backend/models/MockTest.js
// (Taddan navi file - Mock Test nu structure ane validation mate)

export const createMockTestModel = (data) => {
  return {
    title: data.title || "TET Mock Test",
    description: data.description || "",
    examType: data.examType, // 'TET_1', 'TET_2_MATHS', 'TET_2_SS', 'TET_2_LANG'
    testNumber: Number(data.testNumber), // 1 thi 50
    duration: Number(data.duration || 120), // 120 Minutes official time
    totalMarks: Number(data.totalMarks || 150),
    isPaid: data.isPaid === true || data.isPaid === "true",
    
    // 150 Unique Questions array
    questions: (data.questions || []).map((q, index) => ({
      questionId: `${data.examType.toLowerCase()}_t${data.testNumber}_q${index + 1}`, // Unique Filter ID
      questionText: q.questionText,
      options: q.options || [], // 4 options array
      correctOption: Number(q.correctOption) // 0, 1, 2, or 3
    })),
    
    createdAt: new Date().toISOString()
  };
};

export const createTestAttemptModel = (userId, testId, data) => {
  return {
    userId,
    testId,
    examType: data.examType,
    testNumber: data.testNumber,
    score: Number(data.score),
    totalQuestions: Number(data.totalQuestions || 150),
    correctCount: Number(data.correctCount),
    wrongCount: Number(data.wrongCount),
    userAnswers: data.userAnswers, // Object: { questionId: selectedOptionIndex }
    attemptedAt: new Date().toISOString()
  };
};