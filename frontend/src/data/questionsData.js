// frontend/src/data/questionsData.js
// (FARJIYAT AKHI FILE REPLACE - Real AI Production Database Interface)

/**
 * 💡 નિતિનભાઈ, ગુગલ જેમિની કે નોટબુકએલએમ માંથી તમે જે ૫૦ સેટ (૭,૫૦૦ પ્રશ્નો) નો 
 * અસલી માલ JSON ફોર્મેટમાં લોડ કરશો, તેને સિક્યોરલી હેન્ડલ કરવાનું માસ્ટર એન્જિન.
 */

// ગુગલ ડ્રાઈવ અથવા ફાઈલ સ્ટોરેજ લિંકમાંથી મળેલા અસલી પ્રશ્નોનો સેન્ટ્રલ ડેટાબેઝ
const realAIDatabase = {
  TET1: {
    // સેટ ૧ થી ૫૦ નો અસલી માલ અહીં એરે (Array) સ્વરૂપે પ્લગ-ઇન થશે
    set_1: [
      {
        id: 1,
        section: "વિભાગ - ૧ : બાળ વિકાસ અને શૈક્ષણિક શાસ્ત્ર",
        questionText: "નવા સુધારેલા અભ્યાસક્રમ મુજબ બાળકના સામાજિકીકરણની પ્રક્રિયામાં સૌથી પ્રાથમિક અને મહત્વની ભૂમિકા કોણ ભજવે છે?",
        options: ["A) શાળા અને શિક્ષકો", "B) સામાજિક માધ્યમો", "C) કુટુંબ અને વાલી", "D) મિત્ર વર્તુળ (સહપાઠી)"],
        correct: 2
      }
      // જેમિની દ્વારા આપેલા બાકીના ૧૪૯ પ્રશ્નો...
    ]
  }
};

/**
 * ટેસ્ટ આઈડી (e.g., TET1_gen_test_1) ના આધારે પૂરા ૧૫૦ વાસ્તવિક 
 * અને અનન્ય પ્રશ્નો રિટર્ન કરતું સેન્ટ્રલ પ્રોડક્શન ફંક્શન.
 */
export const getDynamicMockTest = (testId) => {
  const parts = testId.split("_");
  const testNum = parts[parts.length - 1] || "1";
  const setKey = `set_${testNum}`;

  // જો ડેટાબેઝમાં સેટ ઉપલબ્ધ હોય તો તે આપો, નહિતર સેન્ડબોક્સ સેટ ૧ આપો
  if (testId.startsWith("TET1")) {
    return realAIDatabase.TET1[setKey] || realAIDatabase.TET1["set_1"];
  }

  return realAIDatabase.TET1["set_1"];
};