# Product Requirements Document (PRD)
**Project Name:** Gasterus
**Event:** DevFest 2026
**Target Platform:** Web Application (Responsive)

## 1. Executive Summary
Gasterus adalah platform *end-to-end* yang menjembatani kesenjangan keterampilan (*Skill Gap*) antara kurikulum akademik kampus dengan kebutuhan industri yang serba cepat. Aplikasi ini memberdayakan mahasiswa melalui analisis kemampuan berbasis AI, pengalaman proyek nyata (*micro-internship*), dan konsultasi karier pintar.

## 2. Problem Statement & Impact
Mahasiswa saat ini menghadapi tiga masalah utama:
1. **Krisis Kepercayaan Diri:** Kualifikasi lowongan kerja tidak sinkron dengan keterampilan dari kampus, memicu kepanikan saat akan lulus.
2. **Kebingungan Action Plan:** Mahasiswa sadar harus belajar mandiri, tetapi tidak tahu harus mulai dari mana dan apa peta jalan (*roadmap*) yang benar.
3. **Paradox Portofolio:** Industri menuntut pengalaman, namun kampus hanya fokus pada tugas teoretis (makalah/laporan), membuat mahasiswa sulit mendapatkan pengalaman kerja pertama.

## 3. Core Features (MVP)
Aplikasi Gasterus difokuskan pada 3 fitur utama:

### A. AI Skill Gap Analyzer & Roadmap Generator
*   **Fungsi:** Pengguna memasukkan data jurusan dan pekerjaan impian (misal: "Sistem Informasi" -> "Data Analyst").
*   **Proses AI:** Sistem menganalisis kualifikasi industri terkini dibandingkan standar kampus.
*   **Output:** Menghasilkan *Roadmap* belajar personal (langkah demi langkah) yang interaktif, menampilkan *skill* spesifik apa yang harus dipelajari di luar kampus.

### B. Micro-Internship Hub
*   **Fungsi:** Marketplace proyek mini yang menghubungkan mahasiswa (sebagai *freelancer* pemula) dengan Startup/UMKM.
*   **Proses:** Startup memposting tugas mikro (misal: pembuatan desain logo, riset kompetitor, penulisan artikel).
*   **Output:** Mahasiswa mengerjakan tugas tersebut untuk membangun portofolio riil, dan UMKM terbantu dengan biaya terjangkau.

### C. AI-Based Mentorship & Career Consulting
*   **Fungsi:** *Chatbot* konsultan karier cerdas.
*   **Proses AI:** Mahasiswa dapat berkonsultasi tentang minat, kelemahan, dan karier. AI akan menjawab secara kontekstual berdasarkan hasil analisis jurusan, portofolio yang terkumpul dari *Micro-Internship*, dan pencapaian akademik pengguna.

## 4. Tech Stack (Recommendation for DevFest)
*   **Frontend:** React.js / Next.js (dengan TypeScript)
*   **Styling:** Tailwind CSS (untuk desain UI yang cepat dan modern)
*   **Backend/API:** Node.js, terintegrasi dengan Orvix API (untuk model DeepSeek LLM)
*   **Database:** Supabase atau Firebase (untuk menyimpan profil pengguna dan data *roadmap*)

## 5. UI/UX Guidelines
*   **Tone & Style:** Modern, profesional, energik, Gen-Z friendly.
*   **Warna Utama:** Biru teknologi (Kepercayaan/Karier) dikombinasikan dengan warna aksen cerah (seperti Oranye/Kuning untuk energi/kreativitas).
*   **Layout:** Dashboard interaktif dengan kartu (*cards*) untuk memecah *roadmap* menjadi tahapan yang tidak mengintimidasi.