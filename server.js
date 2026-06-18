// --- Required Modules ---
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// --- Configuration ---
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const APP_URL = process.env.APP_URL; // e.g., https://your-app.onrender.com

// นำเข้า SDK ของ Gemini เข้ามาใช้งาน
const { GoogleGenAI } = require('@google/genai');

// สร้าง Instance ของ AI Client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// --- Load Markdown Knowledge Base Globally ---
let nextEData = '';
const knowledgeFolder = path.join(__dirname, 'knowledge_base'); // โฟลเดอร์เก็บไฟล์ .md

try {
  if (fs.existsSync(knowledgeFolder)) {
    const files = fs.readdirSync(knowledgeFolder);
    files.forEach(file => {
      if (path.extname(file) === '.md') {
        const filePath = path.join(knowledgeFolder, file);
        const content = fs.readFileSync(filePath, 'utf8');
        nextEData += `\n--- START OF FILE: ${file} ---\n`;
        nextEData += content;
        nextEData += `\n--- END OF FILE: ${file} ---\n`;
      }
    });
    console.log(`Successfully loaded knowledge base files from ${knowledgeFolder}`);
  } else {
    console.warn(`Warning: Knowledge folder not found at ${knowledgeFolder}. Please create it.`);
  }
} catch (error) {
  console.error('Failed to load knowledge base files:', error);
}

// --- Root Endpoint ---
app.get('/', (req, res) => {
  res.status(200).send('Mr.NextE (Gemini Knowledge Edition) is Online!');
});

// --- LINE Webhook Endpoint ---
app.post('/webhook', async (req, res) => {
  // บังคับตอบกลับ LINE ทันที เพื่อป้องกัน Webhook Timeout บน Render
  res.status(200).send('OK');

  // ประมวลผลแบบ Background เพื่อไม่ให้บล็อกการทำงานของ Webhook
  for (const event of req.body.events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userMessage = event.message.text;
      const replyToken = event.replyToken;

      try {
        const geminiResponse = await getGeminiResponse(userMessage);
        await replyToLine(replyToken, geminiResponse);
      } catch (error) {
        console.error('Error handling message:', error);
        // กรณี Error จะข้ามไป เพื่อไม่ให้แอปพลิเคชันค้าง
      }
    }
  }
});

// --- Function to interact with Gemini API ---
async function getGeminiResponse(prompt) {
  
  // --- คำนวณวันที่ปัจจุบันแบบไทย ---
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', locale: 'th-TH' };
  const currentDateThai = now.toLocaleDateString('th-TH', options);
  
  const systemInstruction = `คุณคือ Mr.NextE ผู้ช่วย AI ที่มีความเชี่ยวชาญระบบ Solar PV และ BESS ของบริษัท NextE
  ข้อมูลเวลาปัจจุบัน: วันนี้คือวันที่ ${currentDateThai}
  ลักษณะการตอบกลับ:
  1. พูดจาสุภาพ ใช้คำแทนตัวว่า "ผม" และลงท้ายว่า "ครับ" เสมอ
  2. ตอบให้ตรงประเด็น สั้น กระชับ แต่อธิบายรายละเอียดเชิงเทคนิคตามความเป็นจริงแบบวิศวกรมืออาชีพ
  3. ใช้ข้อมูลดิบและตารางราคาจากไฟล์เอกสารประกอบ (Context Data) ที่แนบมาให้เท่านั้นในการตอบคำถาม
  4. หากไม่มีข้อมูลในเอกสารประกอบ ให้ตอบอย่างสุภาพว่า "ขออภัยครับ ผมไม่มีข้อมูลส่วนนี้ครับ"
  5. ตอบเป็นภาษาไทยที่ถูกต้อง กระชับ และเป็นมืออาชีพ
  6. ถ้ามีการนัดหมายต่างๆ ให้รอ confirm กับพนักงานของ NextE ก่อนทุกครั้ง

  Context Data (โครงสร้างระบบและคู่มือแพ็กเกจของ NextE):
  ${nextEData}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite', // แนะนำใช้โมเดลที่ตอบได้ไวเพื่อความเร็วในการตอบ
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, // ปรับลดลงมาที่ 0.3 เพื่อความแม่นยำของข้อมูลและราคาในตาราง
        maxOutputTokens: 1000, 
        thinkingLevel: 'minimal' // คงโครงสร้างสั้น กระชับ ไม่คิดฟุ้งซ่าน
      }
    });

    return response.text;
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    return "ขออภัยครับ ผม Mr.NextE เกิดข้อผิดพลาดทางเทคนิคเล็กน้อย โปรดลองอีกครั้งนะครับ";
  }
}

// --- Function to reply to LINE ---
async function replyToLine(replyToken, message) {
  const lineReplyUrl = "https://api.line.me/v2/bot/message/reply";
  try {
    await axios.post(lineReplyUrl, {
      replyToken: replyToken,
      messages: [{ type: "text", text: message }]
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
      }
    });
  } catch (error) {
    console.error('LINE Reply API Error:', error.response ? error.response.data : error.message);
  }
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
