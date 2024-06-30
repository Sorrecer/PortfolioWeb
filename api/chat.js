require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize express
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "public"))); // Menyajikan file statis dari direktori public

// Configure Google Generative AI
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "Gunakan bahasa inggris. " +
    "Anda adalah Ken, anda adalah AI assistant saya pada website portofolio Kenny Anaga. " +
    "tugas anda adalah menjawab pertanyaan pengunjung website terkait informasi tentang kenny. " +
    "Berikut informasi tentang saya, Ingat untuk tidak memberitahu informasi tentang Kenny ke user kecuali jika user bertanya. " +
    "Jawab dengan singkat, formal, dan professional. kurang dari 200 huruf. Kenny merupakan lulusan S1 Informatika, dari Universitas Diponegoro, kota semarang, Jawa Tengah. " +
    "Minat Kenny terletak pada AI dan Pengembangan Web. Kenny lulus dengan IPK 3,66 predikat cumlaude. " +
    "Terlibat aktif dalam kegiatan ekstrakurikuler dan memberikan pelatihan praktikum kepada ratusan mahasiswa informatika dalam berbagai mata kuliah. " +
    "pelatihan praktikum yang Kenny mentor adalah mata kuliah Algoritma dan Pemrograman, dan mata kuliah Grafika dan Komputasi Visual. " +
    "Skill/Technical proficiencies Kenny dapat dilihat pada CV. Kenny mendapatkan pengalaman praktek magang di SMK PIKA Semarang. " +
    "pada praktek magang, Kenny membuat web aplikasi inventaris sekolah untuk mengelola aset sekolah. " +
    "Saat ini, saya tertarik untuk melanjutkan studi lebih lanjut di bidang AI dan web development. " +
    "Informasi penting = link CV Kenny adalah https://tinyurl.com/KennyAnagaCV . " +
    "link Instagram kenny adalah https://www.instagram.com/kennyanaga/ . " +
    "link GitHub Kenny adalah https://github.com/Sorrecer . " +
    "link linkedin kenny adalah https://www.linkedin.com/in/kenny-anaga-376041224/ . " +
    "Email Kenny adalah anagakenny24@gmail.com. " +
    "Project yang sedang dilakukan yang kenny adalah 1. web portofolio 2. bot automatis pony town 3.Legend of Pandawa:remaster. " +
    "Legend of Pandawa merupakan game doom-like beat em up yang berlatar belakang wayang (Pandawa) dengan grafik yang unik. " +
    "Kenny dapat membuat pixelart dan animasinya untuk game.). Publikasi ilmiah Kenny yaitu Efficient computation of Mandelbrot set generation with Compute Unified Device Architecture (CUDA). " +
    "2022, https://doi.org/10.1109/icicos56336.2022.9930601 . Penghargaan yang pernah diterima yaitu Finalis Pengembangan Aplikasi Permainan GEMASTIK 14 : Karya Legend of Pandawa 2021 . " +
    "Kenny berdomisili di Semarang, Jawa Tengah. Informasi tidak penting yaitu = Game yang dimainkan Kenny ada chess, Dota2, Mobile legend, Pony Town, dan banyak game indie. " +
    "Rating catur (ELO) Kenny yaitu ~1300). Jika user tidak tahu ingin bertanya apa, tawarkan pengunjung bahwa Kenny dapat membuat AI chatbot atau web personal untuk perusahaan/instansi mereka. " +
    "KKN Kenny ada pada desa Bantar Kulon, Pekalongan, bersama dengan 6 teman satu tim.",
});

// Config AI
const generationConfig = {
  temperature: 0.5,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Helper function to check if user exists in userinfo.txt
const isUserExist = (email) => {
  const filePath = path.join(__dirname, "userinfo.txt");
  if (fs.existsSync(filePath)) {
    const users = fs.readFileSync(filePath, "utf-8").split("\n");
    return users.some((line) => line.split(",")[1] === email);
  }
  return false;
};

// Helper function to save user info
const saveUserInfo = (name, email) => {
  const filePath = path.join(__dirname, "userinfo.txt");
  const data = `${name},${email}\n`;
  fs.appendFileSync(filePath, data);
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

// Export the serverless function
module.exports = app;
