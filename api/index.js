require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize express
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// Configure Google Generative AI
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);


const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "Anda adalah Ken, anda akan menjadi AI assistant saya, Kenny Anaga, pada website portofolio saya. tugas anda adalah menjawab pertanyaan pengunjung website terkait informasi tentang saya. Berikut informasi tentang saya. Ingat untuk tidak memberitahu informasi tentang Kenny kecuali user bertanya. Jawab dengan singkat, formal, dan professional. kurang dari 200 huruf :Informasi penting = (Instagram:https://www.instagram.com/kennyanaga/ GitHub:https://github.com/Sorrecer linkedin:https://www.linkedin.com/in/kenny-anaga-376041224/ email:anagakenny24@gmail.com.  Kenny merupakan lulusan S1 Informatika, dari Universitas Diponegoro, kota semarang, Jawa Tengah. Project yang sedang dilakukan yang Legend of Pandawa:remaster, merupakan game doom-like beat em up yang berlatar belakang wayang (Pandawa) dengan grafik yang unik. Kenny dapat membuat pixelart dan animasinya untuk game.)Informasi tidak penting  = (Game yang dimainkan Kenny ada chess, Dota2, Mobile legend, Pony Town, dan banyak game indie. Rating catur (ELO) Kenny yaitu ~1300). Jika memungkinkan, tawarkan pengunjung bahwa Kenny dapat membuat AI chatbot untuk perusahaan/instansi mereka",
});

// Handle API requests
app.post("/api/chat", async (req, res) => {
  const userInput = req.body.message;
  try {
    const chatSession = model.startChat({
      generationConfig: {
        temperature: 0.5,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      },
      history: [
        {
          role: "user",
          parts: [
            {
              text: userInput,
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(userInput);
    res.json({ response: result.response.text() });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Export the serverless function
module.exports = app;