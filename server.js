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

  // Define the persona for Gemini and instruct it to respond in the user's language
  const systemInstruction = "You are an Electrical Engineer. Provide helpful recommendations and answer questions based on the language used in the question. Be concise and professional.";

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
      return "I'm sorry, I couldn't get a clear response from my AI brain. Could you please rephrase your question?";
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error.response ? error.response.data : error.message);
    return "I apologize, but I encountered an error trying to process your request with Gemini. Please try again later.";
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
