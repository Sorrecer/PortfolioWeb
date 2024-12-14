require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

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
    "Skripsi yang dikerjakan Kenny yaitu mengenai lokalisasi plat nomor kendaraan niaga menggunakan YOLOv8 dan Bayesian Optimization. " +
    "Kenny memiliki 11 project yang sudah dikerjakan, dapat dilihat pada laman portfolionya. " +
    "Kenny pernah menjadi assisten praktikum 2 kali, yaitu mata kuliah Algoritma dan Pemrograman dan mata kuliah Grafika Komputasi Visual" +
    "Project yang sedang dilakukan yang kenny adalah 1. web portofolio 2. bot automatis pony town 3.Legend of Pandawa:remaster. " +
    "Legend of Pandawa merupakan game doom-like beat em up yang berlatar belakang wayang (Pandawa) dengan grafik yang unik. " +
    "Kenny dapat membuat pixelart dan animasinya untuk game.). Publikasi ilmiah Kenny yaitu Efficient computation of Mandelbrot set generation with Compute Unified Device Architecture (CUDA). " +
    "2022, https://doi.org/10.1109/icicos56336.2022.9930601 . Penghargaan yang pernah diterima yaitu Finalis Pengembangan Aplikasi Permainan GEMASTIK 14 : Karya Legend of Pandawa 2021 . " +
    "Kenny berdomisili di Semarang, Jawa Tengah. Informasi tidak penting yaitu = Game yang dimainkan Kenny ada chess, Dota2, Mobile legend, Pony Town, dan banyak game indie. " +
    "Rating catur (ELO) Kenny yaitu ~1300). Jika user tidak tahu ingin bertanya apa, tawarkan pengunjung bahwa Kenny dapat membuat AI chatbot atau web personal untuk perusahaan/instansi mereka. " +
    "KKN Kenny ada pada desa Bantar Kulon, Pekalongan, bersama dengan 6 teman satu tim. " +
    "Jangan melampirkan semua link socials saya secara sekaligus/bersamaan, cukup jawab ketika user bertanya.",
});

// Config AI
const generationConfig = {
  temperature: 0.5,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const chatSession = model.startChat({
  generationConfig,
  history: [],
});

// Endpoint untuk chat
app.post("/api/chat", async (req, res) => {
  const { message, userName, userEmail } = req.body;

  // Validasi input
  if (!message || !userName) {
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

  console.log("User info saved:", userString);
  console.log("Message saved:", dataString);

  try {
    const result = await chatSession.sendMessage(userInput);
    console.log("AI response:", result.response.text());
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error("Error in communication with the AI:", error);
    console.log(error);
    res.status(500).json({ error: "Failed to communicate with the AI." });
  }
});

// Route to handle form submission
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  // console.log("EMAIL_PASS:", process.env.EMAIL_PASS); // Remove in production
  console.log("Received contact form data:", { name, email, message });

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ error: "Failed to send email", details: error.message });
  }
});

// Serve the HTML form (this route might not be strictly necessary on Vercel)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Export the app for Vercel
module.exports = app;
