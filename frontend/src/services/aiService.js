// frontend/src/services/aiService.js
import axios from 'axios';

// બેકએન્ડ સર્વરનું બેઝ URL (તમારા પ્રોજેક્ટ મુજબ સેટ કરવું, સામાન્ય રીતે localhost:5000 હોય છે)
const API_BASE_URL = 'http://localhost:5000/api/ai-teacher';

export const askAITeacherAPI = async (message, examType, subject, mode) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ask-teacher`, {
      message,
      examType,
      subject,
      mode
    });
    
    return response.data;
  } catch (error) {
    console.error("API Call Error:", error);
    throw error || new Error("સર્વર સાથે જોડાણ થઈ શક્યું નથી.");
  }
};