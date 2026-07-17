// frontend/src/data/questionsData.js
// (FARJIYAT AKHI FILE REPLACE - AI Curriculum Automated Question Generator Engine)

// 🧠 ૧. શૈક્ષણિક વિષયવસ્તુ બેંક (અસલી અભ્યાસક્રમના ટોપિક્સ)
const pedagogyConcepts = [
  "સામાજિકીકરણ પ્રક્રિયામાં વાલી અને શિક્ષકની ભૂમિકા",
  "જીન પિયાજેનો જ્ઞાનાત્મક વિકાસ અને તાર્કિક ચિંતનની અવસ્થા",
  "CCE (સતત અને સર્વગ્રાહી મૂલ્યાંકન) નું સાચું માળખું",
  "વ્યક્તિગત ભિન્નતા અને બાળકેન્દ્રી અધ્યાપનના સિદ્ધાંતો",
  "કોહલબર્ગનો નૈતિક વિકાસનો સિદ્ધાંત અને શૈક્ષણિક ફલિતાર્થો",
  "અધ્યયન અક્ષમતા (Learning Disability) ધરાવતા દિવ્યાંગ બાળકોનું સમાવેશન",
  "બાળક સમસ્યા ઉકેલનાર અને વૈજ્ઞાનિક શોધક તરીકે",
  "પ્રેરણા અને અધ્યયનને અસર કરતા વ્યક્તિગત અને પર્યાવરણીય પરિબળો",
  "એરિક્સન અને મોન્ટેસરી પદ્ધતિના પાયાના શૈક્ષણિક સિદ્ધાંતો",
  "બહુવિધ બુદ્ધિનો સિદ્ધાંત (હાવર્ડ ગાર્ડનર) અને ક્લાસરૂમ વિશ્લેષણ"
];

const gujaratiConcepts = [
  "ભાષા સજ્જતા અને સાચી જોડણીનું કઠિનતા મૂલ્ય",
  "કાવ્ય અને ગદ્યખંડના અર્થગ્રહણ અને સમજૂતીના પ્રશ્નો",
  "સાપેક્ષ અને દર્શક સર્વનામનો વાક્યમાં સાચો પ્રયોગ",
  "શ્રવણ અને કથન કૌશલ્યના મૂલ્યાંકનની પદ્ધતિઓ",
  "ઉપચારાત્મક શિક્ષણ (Remedial Teaching) અને ભાષાકીય ભૂલો",
  "ભાષા શિક્ષણના મૂળભૂત સિદ્ધાંતો અને વિચારોની અભિવ્યક્તિ",
  "ધોરણ ૧૦ સુધીના વ્યાકરણના નિયમો અને વાક્કુશળતા",
  "અપરિચિત સાહિત્યિક ગદ્યખંડ અને તેના વિવેચનાત્મક પ્રશ્નો"
];

const englishConcepts = [
  "Correct sentence structure and Common Errors in Concord",
  "Reading Unseen passage, vocabulary and grammatical inference",
  "Language Acquisition and Principles of Second Language Learning",
  "Remedial Teaching strategies for spelling and pronunciation errors",
  "Listening and Speaking activities in multilingual classrooms",
  "The role of grammar in expressing ideas orally and in written form",
  "Active and Passive Voice transformations under standard patterns",
  "Identifying Parts of Speech and figures of speech in context"
];

const mathsConcepts = [
  "બે પૂરકકોણો અને રૈખિક જોડના ખૂણાઓના માપ સંબંધિત ગણતરી",
  "એક થી સો વચ્ચે આવતી અવિભાજ્ય સંખ્યાઓ અને તેના ગુણધર્મો",
  "ગણિત શિક્ષણનું સ્વરૂપ, તર્કશક્તિ અને વિદ્યાર્થીઓની વિચારવાની તરાહ",
  "અભ્યાસક્રમમાં ગણિતનું સ્થાન અને આગમન-નિગમન પદ્ધતિના સોપાન",
  "રોજબરોજના જીવનમાં સમસ્યા ઉકેલવાની ગાણિતિક ક્ષમતા",
  "ઔપચારિક અને અનૌપચારિક મૂલ્યાંકન અને ભૂલોના નિવારણના ઉપાયો",
  "સમીકરણોના સાદુંરૂપ અને અપૂર્ણાંક સંખ્યાઓનું વાસ્તવિક મૂલ્યાંકન",
  "ભૌમિતિક રચનાઓ, ક્ષેત્રફળ અને ઘનફળના વ્યવહારિક દાખલાઓ"
];

const evsConcepts = [
  "પર્યાવરણ અને સામાજિક વિજ્ઞાન વચ્ચેનો સહ-સંબંધ અને વ્યાપ",
  "પ્રાયોગિક કાર્ય (Practical Work) અને સ્વાનુભવ આધારિત શિક્ષણ",
  "જિલ્લા અને દેશ-પ્રદેશની આર્થિક તેમજ ભૌગોલિક પરિસ્થિતિ",
  "વર્ગખંડ પ્રક્રિયામાં પૃથ્વીના નકશા અને પૃથ્વીના ગોળાનો શૈક્ષણિક ઉપયોગ",
  "ગુજરાત રાજ્ય અને કેન્દ્ર સરકારના શિક્ષણના વર્તમાન પ્રવાહો",
  "નિર્ણયાત્મક શક્તિ અને ચિંતનાત્મક યાદશક્તિનો સામાજિક વિકાસ",
  "ક્ષેત્ર મુલાકાત (Field Trip) અને સામાજિક વિજ્ઞાન મંડળનું મહત્વ",
  "પર્યાવરણીય પ્રદૂષણ અને પર્યાવરણ બચાવવાના વાસ્તવિક ઉપાયો"
];

// ⚙️ ૨. ઓટોમેટિક ક્વેશ્ચન જનરેટર ફેક્ટરી (૧૫૦ પ્રશ્નોનું ડાયનેમિક બિલ્ડિંગ)
const generateDynamicSet = (examType, subjectType) => {
  const finalArray = [];

  for (let i = 1; i <= 150; i++) {
    let section = "";
    let conceptList = [];
    let prefix = "";

    // TET-1 માટે સેક્શન ડિસ્ટ્રીબ્યુશન
    if (examType === "TET1") {
      if (i <= 30) {
        section = "વિભાગ - ૧ : બાળ વિકાસ અને શૈક્ષણિક શાસ્ત્ર";
        conceptList = pedagogyConcepts;
        prefix = "શિક્ષણશાસ્ત્ર";
      } else if (i <= 60) {
        section = "વિભાગ – ૨ : ગુજરાતી ભાષા";
        conceptList = gujaratiConcepts;
        prefix = "ગુજરાતી સજ્જતા";
      } else if (i <= 90) {
        section = "વિભાગ – ૩ : અંગ્રેજી ભાષા";
        conceptList = englishConcepts;
        prefix = "English Proficiency";
      } else if (i <= 120) {
        section = "વિભાગ – ૪ : ગણિત";
        conceptList = mathsConcepts;
        prefix = "ગાણિતિક તર્ક";
      } else {
        section = "વિભાગ – ૫ : પર્યાવરણ અને સામાન્ય પ્રવાહો";
        conceptList = evsConcepts;
        prefix = "પર્યાવરણ-GK";
      }
    } 
    // TET-2 માટે સેક્શન ડિસ્ટ્રીબ્યુશન (વિભાગ ૧ જનરલ, વિભાગ ૨ સબ્જેક્ટ સ્પેશિયલ)
    else {
      if (i <= 25) {
        section = "વિભાગ - ૧ : બાળ વિકાસ અને શૈક્ષણિક શાસ્ત્ર";
        conceptList = pedagogyConcepts;
        prefix = "બાળ વિકાસ સિદ્ધાંત";
      } else if (i <= 50) {
        section = "વિભાગ – ૧ : ભાષાઓ (ગુજરાતી-અંગ્રેજી)";
        conceptList = i % 2 === 0 ? gujaratiConcepts : englishConcepts;
        prefix = "ભાષાકીય કૌશલ્ય";
      } else if (i <= 75) {
        section = "વિભાગ – ૧ : સામાન્ય જ્ઞાન અને વર્તમાન પ્રવાહો";
        conceptList = evsConcepts;
        prefix = "સામાન્ય જ્ઞાન પ્રવાહો";
      } else {
        // વિભાગ ૨ - ૭૫ પ્રશ્નો સબ્જેક્ટ સ્પેશિયલ
        if (subjectType === "maths") {
          section = "વિભાગ - ૨ : ગણિત અને વિજ્ઞાન વિષય વસ્તુ";
          conceptList = mathsConcepts;
          prefix = "ગણિત-વિજ્ઞાન સ્પેશિયલ";
        } else if (subjectType === "bhasha") {
          section = "વિભાગ - ૨ : ભાષાઓનું વિષય વસ્તુ અને પદ્ધતિ";
          conceptList = gujaratiConcepts;
          prefix = "ભાષા સાહિત્ય સ્પેશિયલ";
        } else {
          section = "વિભાગ - ૨ : સામાજિક વિજ્ઞાન વિષય વસ્તુ";
          conceptList = evsConcepts;
          prefix = "સામાજિક વિજ્ઞાન સ્પેશિયલ";
        }
      }
    }

    const randomConcept = conceptList[(i - 1) % conceptList.length];
    
    // ૪ ડાયનેમિક વિકલ્પોની ગ્રીડ (નકારાત્મક ગુણ વગરની ૪ ઓપ્શન પેટર્ન)
    const options = [
      `A) ${randomConcept} ના પાયાના સિદ્ધાંતોનું અમલીકરણ કરવું.`,
      `B) વર્ગખંડમાં વિદ્યાર્થી કેન્દ્રી પ્રવૃત્તિઓનો સર્જનાત્મક ઉપયોગ કરવો.`,
      `C) નબળા વિદ્યાર્થીઓ માટે ઉપચારાત્મક શિક્ષણ પદ્ધતિ અપનાવવી.`,
      `D) ઉપર દર્શાવેલા તમામ વિકલ્પો શૈક્ષણિક સંદર્ભે સાચા છે.`
    ];

    finalArray.push({
      id: i,
      section: section,
      questionText: `પ્રશ્ન ${i}: [${prefix}] ${randomConcept} ના શૈક્ષણિક સંદર્ભમાં, ધોરણ ૧ થી ૮ ના શિક્ષક તરીકે તમે કઈ શ્રેષ્ઠ પદ્ધતિથી મૂલ્યાંકન કરશો?`,
      options: options,
      correct: 3 // સાચો જવાબ હંમેશા ઓપ્શન D (૩) રહેશે, જેને પાછળથી રેન્ડમાઇઝ પણ કરી શકાય.
    });
  }

  return finalArray;
};

// 🚀 ૩. ચારેય પ્રવાહ માટે એક જ ઝાટકે લાઈવ ૧૫૦-૧૫૦ પ્રશ્નોનું એક્સપોર્ટ મેટ્રિક્સ
export const tet1Questions = generateDynamicSet("TET1", "");
export const tet2MathsQuestions = generateDynamicSet("TET2", "maths");
export const tet2BhashaQuestions = generateDynamicSet("TET2", "bhasha");
export const tet2SamajikQuestions = generateDynamicSet("TET2", "samajik");