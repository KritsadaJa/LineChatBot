// --- Required Modules ---
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// --- Configuration ---
// Make sure to add TYPHOON_API_KEY to your .env file
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
const TYPHOON_API_KEY = process.env.TYPHOON_API_KEY;
const APP_URL = process.env.APP_URL; // e.g., https://your-app.onrender.com

// นำเข้า SDK ของ Gemini เข้ามาใช้งาน
const { GoogleGenAI } = require('@google/genai');

// เปลี่ยนตัวแปร Key (อย่าลืมไปเปลี่ยนใน .env หรือ Environment Variables ด้วยนะครับ)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// สร้าง Instance ของ AI Client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// --- Root Endpoint ---
app.get('/', (req, res) => {
  res.status(200).send('Mr.NextE (Typhoon Edition) is Online!');
});

// --- LINE Webhook Endpoint ---
app.post('/webhook', async (req, res) => {
  for (const event of req.body.events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userMessage = event.message.text;
      const replyToken = event.replyToken;

      try {
        // Updated to Gemini
        const geminiResponse = await getGeminiResponse(userMessage);
        await replyToLine(replyToken, geminiResponse);
      } catch (error) {
        console.error('Error:', error);
        await replyToLine(replyToken, "ขออภัยครับ ผม Mr.NextE เกิดข้อผิดพลาดทางเทคนิคเล็กน้อย โปรดลองอีกครั้งนะครับ");
      }
    }
  }
  res.status(200).send('OK');
});

// --- Function to interact with Gemini API ---
async function getGeminiResponse(prompt) {
  
  // --- คำนวณวันที่ปัจจุบันแบบไทย ---
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', locale: 'th-TH' };
  const currentDateThai = now.toLocaleDateString('th-TH', options);
  const currentYearThai = now.getFullYear() + 543; // แปลง ค.ศ. เป็น พ.ศ.
  
  const nextEData = `
บริษัท เน็กซ์อี จำกัด
ที่ตั้ง: 1518/5 ถนนประชาราษฎร์ 1 แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพมหานคร 10800
วันที่จดทะเบียนบริษัท: 5 มิถุนายน พ.ศ. 2562
ทุนจดทะเบียน: 5,000,000 บาท

ความมุ่งหวังของเรา: มุ่งหวังให้ทุกคนเข้าถึงพลังงานสะอาดได้อย่างคุ้มค่าและเต็มประสิทธิภาพ โดยยึดหลัก Consumer to Prosumer
ความเชี่ยวชาญ: ผู้เชี่ยวชาญการติดตั้งระบบ Solar PV, Solar rooftop ทั้ง on-grid และ hybrid system มาตรฐาน ISO9001:2015
ธุรกิจ: ติดตั้งระบบโซล่าเซลล์ภาคครัวเรือน ธุรกิจ อุตสาหกรรม, ขายไฟฟ้าให้ภาคเอกชนขนาดเล็ก, พัฒนาเทคโนโลยีใหม่ด้านพลังงาน

นโยบายคุณภาพ ISO9001:2015: มุ่งมั่นออกแบบและติดตั้งระบบพลังงานแสงอาทิตย์ที่มีคุณภาพสูงสุด เพื่อตอบสนองความพึงพอใจลูกค้า ลดข้อร้องเรียน

แผงโซล่าเซลล์:
- Sunpower P7 (SPR-P7-550-COM-M-BF)
- Tier1 เทคโนโลยีจากอเมริกา (USA) แบบ N-type TOPCON Shingled Cell (ลด hotspot)
- รับประกันแผ่นและประสิทธิภาพ 30 ปี (30/30Y)
- ประสิทธิภาพสูง: ผลิตไฟได้สองด้าน (Bifacial technology), มี bypass diode 3 ตำแหน่ง (เพิ่มไฟฟ้าแม้มีเงาบัง)
- กำลังไฟฟ้าสูงสุด 550 Wp (660W เมื่อ Bifacial ทำงานที่ 20%), ประสิทธิภาพ 22.5%

โซล่าเซลล์แบบ String Inverter:
- Huawei Inverter: Smart Energy Technology
- ประสิทธิภาพสูงถึง 98.3 % (Advanced Digital Control Algorithm)
- ความปลอดภัยสูงสุดด้วยระบบ AI Powered Arc Fault Circuit Interrupter (หยุดทำงานภายใน 2 วินาที)
- รองรับแบตเตอรี่และระบบ hybrid (ทำงานร่วมกับ Huawei Luna และ Backup Box)
- รับประกันอินเวอร์เตอร์ 10 ปี
- Package:
  - 5 kW: 1-Phase: Inverter: Huawei 1 เครื่อง, PV module: Sunpower P7 9 แผ่น, ประหยัดไฟฟ้า 2900 บาท/เดือน, เงินลงทุน 149000 บาท, คืนทุน 4.3 ปี
  - 5 kW: 3-Phase: Inverter: Huawei 1 เครื่อง, PV module: Sunpower P7 9 แผ่น, ประหยัดไฟฟ้า 2900 บาท/เดือน, เงินลงทุน 159000 บาท, คืนทุน 4.6 ปี
  - 10 kW: 3-Phase: Inverter: Huawei 1 เครื่อง, PV module: Sunpower P7 18 แผ่น, ประหยัดไฟฟ้า 5800 บาท/เดือน, เงินลงทุน 249000 บาท, คืนทุน 3.6 ปี
  - 15 kW: 3-Phase: Inverter: Huawei 1 เครื่อง, PV module: Sunpower P7 28 แผ่น, ประหยัดไฟฟ้า 8700 บาท/เดือน, เงินลงทุน 339000 บาท, คืนทุน 3.2 ปี
  - 20 kW: 3-Phase: Inverter: Huawei 1 เครื่อง, PV module: Sunpower P7 38 แผ่น, ประหยัดไฟฟ้า 11600 บาท/เดือน, เงินลงทุน 429000 บาท, คืนทุน 3.0 ปี
  - 5 kW: 1-Phase: Inverter: Huawei 1 เครื่อง, PV module: Jinko 8 แผ่น, ประหยัดไฟฟ้า 2900 บาท/เดือน, เงินลงทุน 13900 บาท, คืนทุน 4.0 ปี
  - 5 kW: 1-Phase: Inverter: Huawei 1 เครื่อง, PV module: Jinko 8 แผ่น, ประหยัดไฟฟ้า 2900 บาท/เดือน, เงินลงทุน 13900 บาท, คืนทุน 4.3 ปี
  - 10 kW: 1-Phase: Inverter: Huawei 1 เครื่อง, PV module: Jinko 16 แผ่น, ประหยัดไฟฟ้า 5800 บาท/เดือน, เงินลงทุน 320000 บาท, คืนทุน 3.4 ปี
  - 15 kW: 1-Phase: Inverter: Huawei 1 เครื่อง, PV module: Jinko 24 แผ่น, ประหยัดไฟฟ้า 8700 บาท/เดือน, เงินลงทุน 440000 บาท, คืนทุน 3.2 ปี
  - 20 kW: 1-Phase: Inverter: Huawei 1 เครื่อง, PV module: Jinko 32 แผ่น, ประหยัดไฟฟ้า 11600 บาท/เดือน, เงินลงทุน 560000 บาท, คืนทุน 2.9 ปี

โซล่าเซลล์แบบ Micro Inverter:
- Enphase: Smart Micro Inverter
- อินเวอร์เตอร์ขนาดเล็กติดหลังแผงแต่ละแผง (ส่งไฟฟ้า AC)
- รองรับมาตรฐานหยุดทำงานฉุกเฉิน, ทำงานแยกอิสระ (ประสิทธิภาพและความปลอดภัยเต็มที่)
- NextE จับคู่ Sunpower และ Enphase (นิยมในอเมริกา)
- รับประกันอินเวอร์เตอร์สูงสุด 25 ปี
- Package:
  - 5 kW: 1-Phase: Inverter: Enphase 9 เครื่อง, PV module: Sunpower P7 9 แผ่น, ประหยัดไฟฟ้า 2900 บาท/เดือน, เงินลงทุน 199000 บาท, คืนทุน 5.7 ปี
  - 5 kW: 3-Phase: Inverter: Enphase 9 เครื่อง, PV module: Sunpower P7 9 แผ่น, ประหยัดไฟฟ้า 2900 บาท/เดือน, เงินลงทุน 209000 บาท, คืนทุน 6.0 ปี
  - 10 kW: 3-Phase: Inverter: Enphase 18 เครื่อง, PV module: Sunpower P7 18 แผ่น, ประหยัดไฟฟ้า 5800 บาท/เดือน, เงินลงทุน 309000 บาท, คืนทุน 4.4 ปี
  - 15 kW: 3-Phase: Inverter: Enphase 28 เครื่อง, PV module: Sunpower P7 28 แผ่น, ประหยัดไฟฟ้า 8700 บาท/เดือน, เงินลงทุน 455000 บาท, คืนทุน 4.4 ปี
  - 20 kW: 3-Phase: Inverter: Enphase 38 เครื่อง, PV module: Sunpower P7 38 แผ่น, ประหยัดไฟฟ้า 11600 บาท/เดือน, เงินลงทุน 599000 บาท, คืนทุน 4.3 ปี
  - 5 kW: 1-Phase: Inverter: Enphase 8 เครื่อง, PV module: Jinko 8 แผ่น, ประหยัดไฟฟ้า 2900 บาท/เดือน, เงินลงทุน 189000 บาท, คืนทุน 5.4 ปี
  - 5 kW: 3-Phase: Inverter: Enphase 8 เครื่อง, PV module: Jinko 8 แผ่น, ประหยัดไฟฟ้า 2900 บาท/เดือน, เงินลงทุน 199000 บาท, คืนทุน 5.7 ปี
  - 10 kW: 3-Phase: Inverter: Enphase 16 เครื่อง, PV module: Jinko 16 แผ่น, ประหยัดไฟฟ้า 5800 บาท/เดือน, เงินลงทุน 299000 บาท, คืนทุน 4.3 ปี
  - 15 kW: 3-Phase: Inverter: Enphase 24 เครื่อง, PV module: Jinko 24 แผ่น, ประหยัดไฟฟ้า 8700 บาท/เดือน, เงินลงทุน 439000 บาท, คืนทุน 4.2 ปี
  - 20 kW: 3-Phase: Inverter: Enphase 32 เครื่อง, PV module: Jinko 32 แผ่น, ประหยัดไฟฟ้า 11600 บาท/เดือน, เงินลงทุน 579000 บาท, คืนทุน 4.2 ปี

ปัจจุบันไม่อนุญาตให้ขายไฟเข้าระบบหรือ Net Metering

มาตรการลดหย่อนภาษีโซลาร์รูฟท็อป (2569-2571)
- วงเงินลดหย่อน: สูงสุด 200,000 บาท  
- ระยะเวลา: 3 มีนาคม 2569 - 31 ธันวาคม 2571  
- ประเภท: ลดหย่อนตามจริง (ไม่เกิน 200,000 บาท)
- ต้องเป็นระบบ **On-grid**
- ขนาดไม่เกิน **10 kWp** ต่อหลัง
- ติดตั้งและจดทะเบียนภายในระยะเวลาที่กำหนด
- ต้องใช้ **ใบกำกับภาษีอิเล็กทรอนิกส์ (e-Tax Invoice)** เท่านั้น
- ชื่อผู้ซื้อ, ชื่อเจ้าของมิเตอร์ และผู้ยื่นภาษี **ต้องเป็นบุคคลเดียวกัน**
- **บุคคลธรรมดา** เท่านั้น
- นิติบุคคลไม่สามารถใช้สิทธินี้ได้ (ใช้สิทธิค่าเสื่อมราคาแทน)

NextE Solar PPA:
- ดำเนินการโดย บริษัท เน็กซ์อี กรีน เอ็นเนอร์ยี่ จำกัด (บริษัทลูก)
- ลงทุนติดตั้ง, ผลิต, บำรุงรักษา, จัดจำหน่ายไฟฟ้าจากโซลาร์เซลล์ตามความต้องการลูกค้า (อาคารสำนักงาน, โรงแรม, โรงงาน)
- รูปแบบ: ติดตั้งในพื้นที่ผู้ผลิตเอง หรือ ผู้ใช้ไฟฟ้า
- การขายไฟฟ้า: มีส่วนลดจากราคาตลาด (การไฟฟ้ากำหนด) ในระยะเวลาจำกัด
- หลังครบสัญญา: ระบบผลิตกระแสไฟฟ้าจะโอนให้ผู้ว่าจ้างโดยไม่มีค่าใช้จ่าย
`;

  const systemInstruction = `คุณคือ Mr.NextE วิศวกรไฟฟ้าชายผู้เชี่ยวชาญระบบ Solar PV ของบริษัท NextE
  ข้อมูลเวลาปัจจุบัน: วันนี้คือวันที่ ${currentDateThai}
  ลักษณะการตอบกลับ:
  1. พูดจาสุภาพ ใช้คำแทนตัวว่า "ผม" และลงท้ายว่า "ครับ" เสมอ
  2. ตอบให้ตรงประเด็น สั้น กระชับ แบบวิศวกร
  3. ใช้ข้อมูลจากบริบทที่ให้มาเท่านั้นเกี่ยวกับสินค้าและบริการของ NextE
  4. ตอบเป็นภาษาไทยที่ถูกต้องและเป็นมืออาชีพ;

  Context Data:
  ${nextEData}`;

  try {
    // เรียกใช้งานผ่าน SDK ของ Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite', // เปลี่ยนชื่อโมเดลเป็นรุ่น 3.1 Flash Lite
      contents: prompt, // ข้อความที่ผู้ใช้พิมพ์ส่งมา
      config: {
        systemInstruction: systemInstruction, // แยกคำสั่งระบบและบริบทออกมาต่างหาก
        temperature: 0.4,
        maxOutputTokens: 6000, // 6000 เพื่อให้เพียงพอต่อการตอบกลับไลน์
        thinkingLevel: 'minimal'
      }
    });

    // ดึงข้อความผลลัพธ์กลับไปส่งให้ LINE
    return response.text;
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

// --- Function to reply to LINE ---
async function replyToLine(replyToken, message) {
  const lineReplyUrl = "https://api.line.me/v2/bot/message/reply";
  await axios.post(lineReplyUrl, {
    replyToken: replyToken,
    messages: [{ type: "text", text: message }]
  }, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
    }
  });
}

// --- Start the server ---
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  
  // --- Wake-up Signal (Self-Ping) ---
  if (APP_URL) {
    console.log("Self-pinging active to prevent sleep.");
    setInterval(() => {
      axios.get(APP_URL).catch((err) => console.log("Self-ping failed:", err.message));
    }, 10 * 60 * 1000); // Pings every 10 minutes
  }
});
