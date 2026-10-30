# Gasterus — DevFest 2026 Submission

> **Bridging Academic Skill Gap to Industry Impact**
> Platform terintegrasi berbasis AI yang membantu mahasiswa memangkas kesenjangan antara kurikulum akademik kampus dengan kualifikasi industri nyata melalui _AI Skill Gap Analyzer_, _Micro-Internship Hub_, dan _AI Career Mentor_.

---

## 🚀 Live Demo & Deployment Link

<!-- * **Web Application (Google Cloud Run):**
  [https://gasterus-app-xxxxxx-uc.a.run.app](https://gasterus-app-xxxxxx-uc.a.run.app) -->

- **Web Preview:**
  [https://gasterus-devfest2026-8d15e.web.app/](https://gasterus-devfest2026-8d15e.web.app/)

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS v4, Lucide Icons
- **AI Engine:** Google Gemini API (`@google/genai` SDK — Gemini 1.5 Flash)
- **Cloud Infrastructure:** Google Cloud Run, Google Artifact Registry / Firebase Hosting

---

## 📌 Fitur Utama

1. **AI Skill Gap Analyzer & Dynamic Roadmap Generator:** Menganalisis perbedaan spesifik antara kurikulum kampus pengguna dengan kualifikasi industri _role_ impian, serta menghasilkan skor kesiapan (_Match Percentage_) dan _roadmap_ belajar bertahap.
2. **Micro-Internship Hub:** Platform penghubung mahasiswa untuk melamar proyek lepas skala kecil (_1-3 minggu_) dari UMKM dan Startup mitra.
3. **AI Career Mentor:** Konsultasi karir interaktif berbasis AI untuk mendampingi persiapan portofolio dan strategi karir.
4. **Role-Based Portal:** Dukungan antarmuka khusus untuk 3 peran: **Mahasiswa** (Pelamar & Belajar), **UMKM/Startup** (Perekrut & Kelola Lowongan), dan **Admin** (Monitoring Ekosistem).

---

## 💻 Panduan Running Lokal (Local Setup)

### Prasyarat

- **Node.js**: `v18.x` atau lebih baru
- **npm**: `v9.x` atau lebih baru
- **Gemini API Key**: Dapatkan kunci dari [Google AI Studio](https://aistudio.google.com/)

### Langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone [https://github.com/ChristianoA21/Gasterus---DevFest2026.git](https://github.com/ChristianoA21/Gasterus---DevFest2026.git)
   cd Gasterus---DevFest2026
   ```
