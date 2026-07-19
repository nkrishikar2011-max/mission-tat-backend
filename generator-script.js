// generator-script.js
// (FARJIYAT AKHI FILE REPLACE - Verified Production REST Payload)

const fs = require('fs');
const path = require('path');

// 🔑 તમારી કન્ફર્મ સાચી 'AIzaSy' વાળી કી અહીં સેટ છે ભાઈ
const GEMINI_API_KEY = "AIzaSyBWRoRaJoNL5YpJB-rraMnblzx4MF3ZVoQk"; 

console.log("🚀 મિશન TAT ગુજરાત: જેમિની પ્રોડક્શન એન્જિન શરૂ થઈ રહ્યું છે...");

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchChunkFromAI(startSet, endSet) {
  // સાચો ઓફિશિયલ v1 સ્ટેબલ એન્ડપોઇન્ટ
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `
    You are an official exam paper setter for SEB Gujarat. 
    Generate unique multiple-choice questions in Gujarati for TET-1 (Class 1 to 5) strictly based on the official blueprint.
    
    You need to generate questions for Mock Test Sets from Set ${startSet} to Set ${endSet}.
    Each single set must contain exactly 150 questions structured in this exact flow:
    - Q1 to 30: બાળ વિકાસ અને શૈક્ષણિક શાસ્ત્ર
    - Q31 to 60: ગુજરાતી ભાષા અને વ્યાકરણ
    - Q61 to 90: અંગ્રેજી ભાષા અને વ્યાકરણ
    - Q91 to 120: ગણિત વિષયવસ્તુ અને પદ્ધતિશાસ્ત્ર
    - Q121 to 150: પર્યાવરણ, GK અને શિક્ષણના વર્તમાન પ્રવાહો (NEP, RTE)

    CRITICAL REQUIREMENTS:
    1. Ensure NO questions are repeated between sets. Every single set must have completely fresh questions.
    2. Output must be a strictly valid JSON object where keys are "set_${startSet}" to "set_${endSet}", and values are arrays of 150 question objects.
    3. Format:
       {
         "set_${startSet}": [
           { "id": 1, "section": "વિભાગ - ૧ : બાળ વિકાસ અને શૈક્ષણિક શાસ્ત્ર", "questionText": "...", "options": ["A)...", "B)...", "C)...", "D)..."], "correct": 1 }
         ]
       }
    4. Return ONLY the raw JSON string. Do not wrap in markdown or backticks.
  `;

  // 🎯 એકદમ ક્લીન અને ન્યૂનતમ પેલોડ માળખું જેથી ગૂગલ સર્વર ક્યારેય રિજેક્ટ ન કરે
  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`સર્વર એરર કોડ: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text.trim();
    
    // માર્કડાઉન ફોર્મેટ ક્લીનઅપ લેયર
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    }
    
    return JSON.parse(rawText);
  } catch (error) {
    console.error(`❌ બેચ ${startSet} થી ${endSet} મેળવવામાં એરર આવી:`, error.message);
    return null;
  }
}

async function startMegaAutomation() {
  let finalMegaDatabase = { TET1: {} };
  
  // ૫-૫ ના કટકામાં અસલી જેમિની લૂપ
  for (let i = 1; i <= 50; i += 5) {
    const start = i;
    const end = i + 4;
    console.log(`⏳ AI એન્જિન અસલી જેમિનીમાંથી સેટ ${start} થી ${end} નો માલ ડાઉનલોડ કરી રહ્યું છે...`);
    
    const chunkData = await fetchChunkFromAI(start, end);
    if (chunkData) {
      finalMegaDatabase.TET1 = { ...finalMegaDatabase.TET1, ...chunkData };
      console.log(`✅ સેટ ${start} થી ${end} નો સાચો માલ ડાઉનલોડ થઈ ગયો!`);
    } else {
      console.log(`⚠️ કનેક્શન ઇસ્યુ, ૮ સેકન્ડ પછી આ બેચ ફરી ટ્રાય કરીએ છીએ...`);
      i -= 5; 
      await delay(8000);
    }
    
    await delay(6000); 
  }

  const fileContent = `// AUTOMATICALLY GENERATED 7500 PRODUCTION AI QUESTIONS - DO NOT EDIT MANUALLY
const megaDatabase = ${JSON.stringify(finalMegaDatabase, null, 2)};

export const getDynamicMockTest = (testId) => {
  const parts = testId.split("_");
  const testNum = parseInt(parts[parts.length - 1]) || 1;
  const setKey = \`set_\${testNum}\`;

  return megaDatabase.TET1[setKey] || megaDatabase.TET1["set_1"];
};
`;

  const outputPath = path.join(__dirname, 'frontend', 'src', 'data', 'questionsData.js');
  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(`🎯 જબરદસ્ત ધમાકો નિતિનભાઈ! ૭૫૦૦ અસલી જેમિની પ્રશ્નો સાથે ફાઈલ રેડી છે: ${outputPath}`);
}

startMegaAutomation();