require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "public")));

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "Use English. You are a funny priest taking confessions from users. Reply with a funny/comedic manners while still maintaining a priest character. respond with a short sentences",
});

const generationConfig = {
  temperature: 0.5,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  console.log(`Received message: ${message}`);

  try {
    const chatSession = model.startChat({ generationConfig, history: [] });
    const result = await chatSession.sendMessage(message);
    const responseText = await result.response.text();

    console.log("AI response:", responseText);
    res.json({ response: responseText });
  } catch (error) {
    console.error("Error communicating with the AI:", error);
    res.status(500).json({ error: "Failed to communicate with the AI." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
