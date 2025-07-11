// --- Required Modules ---
const express = require('express');
const axios = require('axios'); // Used for making HTTP requests (to LINE and Gemini)

// --- Initialize Express App ---
const app = express();

// --- Middleware to parse JSON requests ---
app.use(express.json());

// --- Configuration (Environment Variables) ---
// IMPORTANT: Store these in your Glitch project's .env file, NOT directly in this code.
// Go to your Glitch project, click 'Tools' -> 'Environment' to set these.
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// --- Root Endpoint (for health check or simple message) ---
app.get('/', (req, res) => {
  res.status(200).send('LINE Chatbot Webhook is running!');
});

// --- LINE Webhook Endpoint ---
app.post('/webhook', async (req, res) => {
  // Log the incoming request for debugging
  console.log('LINE Webhook Event:', JSON.stringify(req.body, null, 2));

  // Verify the request signature (optional but recommended for security)
  // For simplicity, we're skipping signature verification here, but for production,
  // you should implement it using crypto and LINE_CHANNEL_SECRET.

  // Iterate over each event in the request
  for (const event of req.body.events) {
    // Check if the event is a message and if it's a text message
    if (event.type === 'message' && event.message.type === 'text') {
      const userMessage = event.message.text;
      const replyToken = event.replyToken;

      console.log('User Message:', userMessage);
      console.log('Reply Token:', replyToken);

      try {
        // Get response from Gemini
        const geminiResponse = await getGeminiResponse(userMessage);

        // Reply to LINE user
        await replyToLine(replyToken, geminiResponse);

      } catch (error) {
        console.error('Error processing LINE event:', error);
        // Optionally, send an error message back to LINE
        await replyToLine(replyToken, "I'm sorry, I encountered an internal error. Please try again later.");
      }
    }
  }

  // Always return a 200 OK status to LINE as quickly as possible
  res.status(200).send('OK');
});

// --- Function to interact with Gemini API ---
async function getGeminiResponse(prompt) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  // Data from NextE_Data.txt for Gemini to reference
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

  // Define the persona and instructions for Gemini
  const systemInstruction = `
You are male Electrical Engineer specializing in Solar PV systems for NextE company.
Please provide consultation and answer customer questions about NextE's solar PV systems using the information below.
Response characteristics:
1. Short, to the point.
2. Professional style.
3. Suggest NextE Solar PV solutions based ONLY on the provided data.
4. Always respond in Thai language.

NextE Company and Solar PV Product Information:
${nextEData}
`;

  const chatHistory = [
    { role: "user", parts: [{ text: systemInstruction + "\n\n" + prompt }] }
  ];

  const payload = {
    contents: chatHistory
  };

  try {
    const response = await axios.post(apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Gemini API Response:', JSON.stringify(response.data, null, 2));

    if (response.data.candidates && response.data.candidates.length > 0 &&
        response.data.candidates[0].content && response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts.length > 0) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      console.log("Gemini response structure unexpected or content missing.");
      return "ขออภัยครับ ไม่สามารถรับข้อมูลจากระบบ AI ได้ โปรดลองถามคำถามอีกครั้ง";
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error.response ? error.response.data : error.message);
    return "ขออภัยครับ เกิดข้อผิดพลาดในการประมวลผลคำถามของคุณ โปรดลองอีกครั้งในภายหลัง";
  }
}

// --- Function to reply to LINE ---
async function replyToLine(replyToken, message) {
  const lineReplyUrl = "https://api.line.me/v2/bot/message/reply";

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
  };

  const payload = {
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: message
      }
    ]
  };

  try {
    const response = await axios.post(lineReplyUrl, payload, { headers });
    console.log('LINE Reply Response:', response.data);
  } catch (error) {
    console.error('Error replying to LINE:', error.response ? error.response.data : error.message);
  }
}

// --- Start the server ---
const port = process.env.PORT || 3000; // Glitch automatically sets the PORT environment variable
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
