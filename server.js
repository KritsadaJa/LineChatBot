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
        // Updated to Typhoon
        const typhoonResponse = await getTyphoonResponse(userMessage);
        await replyToLine(replyToken, typhoonResponse);
      } catch (error) {
        console.error('Error:', error);
        await replyToLine(replyToken, "ขออภัยครับ ผม Mr.NextE เกิดข้อผิดพลาดทางเทคนิคเล็กน้อย โปรดลองอีกครั้งนะครับ");
      }
    }
  }
  res.status(200).send('OK');
});

// --- Function to interact with Typhoon API ---
async function getTyphoonResponse(prompt) {
  // Typhoon uses the OpenAI-compatible endpoint
  const apiUrl = "https://api.opentyphoon.ai/v1/chat/completions";
  
  const nextEData = `
บริษัท เน็กซ์อี จำกัด
ที่ตั้ง: 1518/5 ถนนประชาราษฎร์ 1 แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพมหานคร 10800

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
  - 5 kW: Inverter: Huawei 1 เครื่อง, PV module: Sunpower P7 9 แผ่น, ประหยัดไฟฟ้า 2900 บาท/เดือน, เงินลงทุน 210000 บาท, คืนทุน 5.7 ปี
  - 10 kW: Inverter: Huawei 1 เครื่อง, PV module: Sunpower P7 18 แผ่น, ประหยัดไฟฟ้า 5800 บาท/เดือน, เงินลงทุน 320000 บาท, คืนทุน 4.6 ปี
  - 15 kW: Inverter: Huawei 1 เครื่อง, PV module: Sunpower P7 28 แผ่น, ประหยัดไฟฟ้า 8900 บาท/เดือน, เงินลงทุน 440000 บาท, คืนทุน 4.1 ปี
  - 20 kW: Inverter: Huawei 1 เครื่อง, PV module: Sunpower P7 38 แผ่น, ประหยัดไฟฟ้า 12100 บาท/เดือน, เงินลงทุน 560000 บาท, คืนทุน 3.8 ปี

โซล่าเซลล์แบบมี Optimizer:
- SolarEdge: Intelligent Solar Inverter System
- Inverter พร้อม Optimizer ทุกแผงทำงานอิสระ (monitor ระดับแผงได้)
- Safety: Rapid shutdown, Optimizer ลดแรงดันแผงเหลือ 1 Volt (ปลอดภัยขึ้น)
- รับประกันยาวนานกว่า 12 ปี
- Package:
  - 5 kW: Inverter: SolarEdge 1 เครื่อง, Optimizer 9 เครื่อง, PV module: Sunpower P7 9 แผ่น, ประหยัดไฟฟ้า 2900 บาท/เดือน, เงินลงทุน 220000 บาท, คืนทุน 6.3 ปี
  - 10 kW: Inverter: SolarEdge 1 เครื่อง, Optimizer 18 เครื่อง, PV module: Sunpower P7 18 แผ่น, ประหยัดไฟฟ้า 5800 บาท/เดือน, เงินลงทุน 340000 บาท, คืนทุน 4.8 ปี

โซล่าเซลล์แบบ Micro Inverter:
- Enphase: Smart Micro Inverter
- อินเวอร์เตอร์ขนาดเล็กติดหลังแผงแต่ละแผง (ส่งไฟฟ้า AC)
- รองรับมาตรฐานหยุดทำงานฉุกเฉิน, ทำงานแยกอิสระ (ประสิทธิภาพและความปลอดภัยเต็มที่)
- NextE จับคู่ Sunpower และ Enphase (นิยมในอเมริกา)
- รับประกันอินเวอร์เตอร์สูงสุด 25 ปี
- Package:
  - 5 kW: Inverter: Enphase 9 เครื่อง, PV module: Sunpower P7 9 แผ่น, ประหยัดไฟฟ้า 2900 บาท/เดือน, เงินลงทุน 230000 บาท, คืนทุน 6.6 ปี
  - 10 kW: Inverter: Enphase 18 เครื่อง, PV module: Sunpower P7 18 แผ่น, ประหยัดไฟฟ้า 5800 บาท/เดือน, เงินลงทุน 380000 บาท, คืนทุน 5.4 ปี
  - 15 kW: Inverter: Enphase 28 เครื่อง, PV module: Sunpower P7 28 แผ่น, ประหยัดไฟฟ้า 8900 บาท/เดือน, เงินลงทุน 540000 บาท, คืนทุน 5.0 ปี
  - 20 kW: Inverter: Enphase 38 เครื่อง, PV module: Sunpower P7 38 แผ่น, ประหยัดไฟฟ้า 12100 บาท/เดือน, เงินลงทุน 730000 บาท, คืนทุน 5.0 ปี

NextE Solar PPA:
- ดำเนินการโดย บริษัท เน็กซ์อี กรีน เอ็นเนอร์ยี่ จำกัด (บริษัทลูก)
- ลงทุนติดตั้ง, ผลิต, บำรุงรักษา, จัดจำหน่ายไฟฟ้าจากโซลาร์เซลล์ตามความต้องการลูกค้า (อาคารสำนักงาน, โรงแรม, โรงงาน)
- รูปแบบ: ติดตั้งในพื้นที่ผู้ผลิตเอง หรือ ผู้ใช้ไฟฟ้า
- การขายไฟฟ้า: มีส่วนลดจากราคาตลาด (การไฟฟ้ากำหนด) ในระยะเวลาจำกัด
- หลังครบสัญญา: ระบบผลิตกระแสไฟฟ้าจะโอนให้ผู้ว่าจ้างโดยไม่มีค่าใช้จ่าย
`;

  const systemInstruction = `คุณคือ Mr.NextE วิศวกรไฟฟ้าชายผู้เชี่ยวชาญระบบ Solar PV ของบริษัท NextE
  ลักษณะการตอบกลับ:
  1. พูดจาสุภาพ ใช้คำแทนตัวว่า "ผม" และลงท้ายว่า "ครับ" เสมอ
  2. ตอบให้ตรงประเด็น สั้น กระชับ แบบวิศวกร
  3. ใช้ข้อมูลจากบริบทที่ให้มาเท่านั้นเกี่ยวกับสินค้าและบริการของ NextE
  4. ตอบเป็นภาษาไทยที่ถูกต้องและเป็นมืออาชีพ`;

  const payload = {
    // Model updated to the requested version
    model: "typhoon-v2.5-30b-a3b-instruct", 
    messages: [
      { role: "system", content: systemInstruction + "\n\nContext Data:\n" + nextEData },
      { role: "user", content: prompt }
    ],
    max_tokens: 600, // Slightly increased for more detailed engineering answers
    temperature: 0.4  // Lowered slightly for higher factual accuracy
  };

  try {
    const response = await axios.post(apiUrl, payload, {
      headers: {
        'Authorization': `Bearer ${TYPHOON_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Typhoon API Error:', error.response ? error.response.data : error.message);
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
