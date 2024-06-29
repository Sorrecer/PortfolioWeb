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
