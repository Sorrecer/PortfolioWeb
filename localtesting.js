require("dotenv").config(); // dotenv untuk load env (harus paling atas)
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs"); // Menambahkan modul fs
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

// Konfigurasi API
const apiKey = process.env.GEMINI_API_KEY; // Mengambil API key dari env
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "Anda adalah Ken, anda akan menjadi AI assistant saya, Kenny Anaga, pada website portofolio saya. tugas anda adalah menjawab pertanyaan pengunjung website terkait informasi tentang saya. Berikut informasi tentang saya. Ingat untuk tidak memberitahu informasi tentang Kenny kecuali user bertanya. Jawab dengan singkat, formal, dan professional. kurang dari 200 huruf :Informasi penting = (Instagram:https://www.instagram.com/kennyanaga/ GitHub:https://github.com/Sorrecer linkedin:https://www.linkedin.com/in/kenny-anaga-376041224/ email:anagakenny24@gmail.com.  Kenny merupakan lulusan S1 Informatika, dari Universitas Diponegoro, kota semarang, Jawa Tengah. Project yang sedang dilakukan yang Legend of Pandawa:remaster, merupakan game doom-like beat em up yang berlatar belakang wayang (Pandawa) dengan grafik yang unik. Kenny dapat membuat pixelart dan animasinya untuk game.)Informasi tidak penting  = (Game yang dimainkan Kenny ada chess, Dota2, Mobile legend, Pony Town, dan banyak game indie. Rating catur (ELO) Kenny yaitu ~1300). Jika memungkinkan, tawarkan pengunjung bahwa Kenny dapat membuat AI chatbot untuk perusahaan/instansi mereka",
});

// Config AI
const generationConfig = {
  temperature: 0.5,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Middleware untuk parsing body request
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Helper function to check if user exists in userinfo.txt
const isUserExist = (email) => {
  const filePath = path.join(__dirname, "userinfo.txt");
  if (fs.existsSync(filePath)) {
    const users = fs.readFileSync(filePath, "utf-8").split("\n");
    return users.some((line) => line.split(",")[1] === email);
  }
  return false;
};

// Endpoint untuk chat
app.post("/api/chat", async (req, res) => {
  const { message, userName, userEmail } = req.body;

  // Validasi input
  if (!message || !userName || !userEmail) {
    console.log("Validation error: Name, email, and message are required.");
    return res
      .status(400)
      .json({ error: "Name, email, and message are required." });
  }

  console.log(
    `Received input: Name - ${userName}, Email - ${userEmail}, Message - ${message}`
  );

  const userInput = message; // Akses pesan dari request body

  // Buat string data untuk disimpan
  const userString = `${userName},${userEmail}\n`;
  const dataString = `${userName},${userEmail},${userInput}\n`;

  // Tulis data ke userinfo.txt jika belum ada
  const userFilePath = path.join(__dirname, "userinfo.txt");
  if (!isUserExist(userEmail)) {
    fs.appendFile(userFilePath, userString, (err) => {
      if (err) {
        console.error("Error writing to userinfo.txt:", err);
        return res.status(500).json({ error: "Failed to save user info." });
      }
      console.log("User info saved:", userString);
    });
  }

  // Tulis data ke storage.txt
  const messageFilePath = path.join(__dirname, "storage.txt");
  fs.appendFile(messageFilePath, dataString, (err) => {
    if (err) {
      console.error("Error writing to storage.txt:", err);
      return res.status(500).json({ error: "Failed to save message." });
    }
    console.log("Message saved:", dataString);
  });

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(userInput);
    console.log("AI response:", result.response.text());
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error("Error in communication with the AI:", error);
    res.status(500).json({ error: "Failed to communicate with the AI." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
