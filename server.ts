import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { generateContextualGapAnalysis } from './src/utils/skillGapCalculator.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google Gemini SDK
const rawApiKey = process.env.GEMINI_API_KEY || '';
const hasValidApiKey = Boolean(
  rawApiKey && 
  rawApiKey !== 'MY_GEMINI_API_KEY' && 
  rawApiKey.trim().length > 15 &&
  !rawApiKey.includes('MY_')
);

const ai = new GoogleGenAI({
  apiKey: rawApiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function withTimeout<T>(promise: Promise<T>, ms: number = 6000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

// Endpoint: AI Skill Gap Analyzer & Roadmap Generator
app.post('/api/gemini/analyze-gap', async (req: Request, res: Response) => {
  const { major, university, semester, dreamJob, currentSkills, studyHoursPerWeek, namaKampus, jurusan, targetRole } = req.body;

  const actualUniversity = (namaKampus || university || 'Universitas Indonesia').trim();
  const actualMajor = (jurusan || major || 'Sistem Informasi').trim();
  const actualTargetRole = (targetRole || dreamJob || 'Data Analyst & BI Specialist').trim();

  try {
    if (!hasValidApiKey) {
      throw new Error('GEMINI_API_KEY is not configured with active key, using smart fallback.');
    }

    const prompt = `Kamu adalah AI Skill Gap Analyzer & Senior Career Strategist untuk platform "Gasterus" (DevFest 2026).
Tugasmu adalah menganalisis kesenjangan keterampilan (Skill Gap) secara KONTEKSTUAL terhadap nama kampus tempat mahasiswa berkuliah dibandingkan kebutuhan industri kerja nyata 2026.

Parameter Mahasiswa:
- Nama Kampus: ${actualUniversity}
- Jurusan: ${actualMajor}
- Target Pekerjaan (Target Role): ${actualTargetRole}
- Semester: ${semester || 6}
- Keterampilan Saat Ini: ${(currentSkills || []).join(', ') || 'Standar perkuliahan'}

ATURAN WAJIB EVALUASI KONTEKSTUAL KAMPUS:
1. Kampus Ternama / Akreditasi Unggul (contoh: ITB, UI, UGM, BINUS, ITS, Unair, Telkom University, Undip, Unpad, IPB, UB, UII, dll.):
   - Kurikulum biasanya lebih diperbarui dan memiliki kemitraan industri aktif.
   - Match Percentage kesiapan kerja rata-rata WAJIB berada di kisaran 60% - 78%.
   - Kekurangan/Gap lebih berfokus pada soft skills, real-world production experience, scale, atau niche tools industri terkini.
   - curriculumAnalysis harus mengapresiasi reputasi kurikulum ${actualUniversity} sekaligus memaparkan tantangan adaptasi produksi riil.

2. Kampus Lokal / Kurang Dikenal / Daerah:
   - Kurikulum cenderung teoretis, berbasis silabus lama, atau minim integrasi teknologi industri terbaru.
   - Match Percentage kesiapan kerja rata-rata WAJIB berada di kisaran 35% - 55%.
   - Kekurangan/Gap mencakup kerangka kerja (framework) modern, best practices, version control (Git), serta proyek praktis nyata.
   - curriculumAnalysis harus memaparkan secara objektif mengapa kurikulum ${actualUniversity} tertinggal dari standar industri 2026 dan bagaimana mahasiswa harus mengejar materi.

Format output HARUS mengikuti responseSchema JSON yang telah ditentukan.`;

    const skillRoadmapResponseSchema = {
      type: Type.OBJECT,
      properties: {
        university: { type: Type.STRING },
        targetRole: { type: Type.STRING },
        matchPercentage: { type: Type.INTEGER },
        curriculumAnalysis: { type: Type.STRING },
        missingSkills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        roadmap: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              phase: { type: Type.STRING },
              focus: { type: Type.STRING },
              skillsToLearn: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendedMicroInternship: { type: Type.STRING },
            },
            required: ['phase', 'focus', 'skillsToLearn', 'recommendedMicroInternship'],
          },
        },
      },
      required: ['university', 'targetRole', 'matchPercentage', 'curriculumAnalysis', 'missingSkills', 'roadmap'],
    };
    // Try primary model gemini-3.8-flash, with automatic fallback to gemini-3.1-flash-lite on quota limits
    let responseText = '';
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'Kamu adalah konsultan kurikulum & tech recruiter senior Indonesia. Jawab secara objektif, mendalam, dan patuhi rentang match percentage sesuai kategori kampus.',
            responseMimeType: 'application/json',
            responseSchema: skillRoadmapResponseSchema,
          },
        }),
        8000
      );
      responseText = response.text || '';
    } catch (primaryErr: any) {
      // If 429 quota exceeded on 3.8-flash, try 3.1-flash-lite
      const isQuota = primaryErr?.status === 429 || String(primaryErr?.message || '').includes('429') || String(primaryErr?.message || '').includes('quota');
      if (isQuota) {
        try {
          const responseLite = await withTimeout(
            ai.models.generateContent({
              model: 'gemini-3.1-flash-lite',
              contents: prompt,
              config: {
                systemInstruction: 'Kamu adalah konsultan kurikulum & tech recruiter senior Indonesia. Jawab secara objektif, mendalam, dan patuhi rentang match percentage sesuai kategori kampus.',
                responseMimeType: 'application/json',
                responseSchema: skillRoadmapResponseSchema,
              },
            }),
            6000
          );
          responseText = responseLite.text || '';
        } catch {
          // Proceed to smart engine fallback
        }
      }
    }

    if (!responseText) {
      throw new Error('LocalEngineFallback');
    }

    const parsedData = JSON.parse(responseText);

    // Normalize and enrich for UI compatibility
    const enrichedData = enrichRoadmapData(parsedData, actualUniversity, actualMajor, actualTargetRole);

    return res.json({ success: true, data: enrichedData, source: 'gemini-live' });
  } catch (_error: any) {
    // Graceful fallback without noisy logs on quota limits
    const fallbackResult = generateContextualGapAnalysis(
      actualUniversity,
      actualMajor,
      actualTargetRole
    );

    return res.json({
      success: true,
      data: fallbackResult,
      source: 'contextual-campus-engine',
      note: `Analisis kontekstual kampus ${actualUniversity} disajikan oleh Engine Gasterus.`,
    });
  }
});

// Endpoint: AI Career Mentorship Chat
app.post('/api/gemini/mentor-chat', async (req: Request, res: Response) => {
  const { messages, userProfile, currentAnalysis, userProjects } = req.body;

  try {
    if (!hasValidApiKey) {
      throw new Error('GEMINI_API_KEY is not configured with active key');
    }

    const systemInstruction = `Kamu adalah "Mentor Gasterus", AI Career Mentor & Career Consultant resmi di platform Gasterus untuk DevFest 2026.
Gaya komunikasimu:
- Berbahasa Indonesia santun, energik, profesional, ramah Gen-Z, suportif, dan anti-basa-basi.
- Kamu memahami secara mendalam keluh kesah mahasiswa: krisis percaya diri sebelum wisuda, paradoks portofolio (butuh pengalaman tapi belum punya portofolio), dan bingung action plan.
- Kontekstual: Selalu hubungkan jawabanmu dengan profil mahasiswa saat ini:
  * Mahasiswa: ${userProfile?.name || 'Mahasiswa'}
  * Kampus: ${userProfile?.university || 'Kampus Indonesia'}
  * Jurusan: ${userProfile?.major || 'Sistem Informasi'} (Semester ${userProfile?.semester || 6})
  * Target Karier: ${userProfile?.dreamJob || 'Data Analyst'}
  * Skill Saat Ini: ${(userProfile?.skills || []).join(', ')}
  * Gap Kritis yang Terdeteksi: ${(currentAnalysis?.criticalGaps || ['Praktik industri riil', 'Framework modern']).join(', ')}
  * Proyek Micro-Internship yang Selesai/Aktif: ${(userProjects || []).map((p: any) => `${p.projectTitle} (${p.status})`).join(', ') || 'Belum ada proyek riil'}

Berikan saran taktis, tips interview, strategi pitching micro-internship ke UMKM/Startup, atau teknik akselerasi roadmap belajar.
Jika relevan, sertakan 2 rekomendasi langkah aksi cepat berpoin.`;

    // Format chat history
    const conversationContents = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    let replyText = '';
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: conversationContents,
          config: {
            systemInstruction,
          },
        }),
        8000
      );
      replyText = response.text || '';
    } catch (primaryErr: any) {
      const isQuota = primaryErr?.status === 429 || String(primaryErr?.message || '').includes('429') || String(primaryErr?.message || '').includes('quota');
      if (isQuota) {
        try {
          const responseLite = await withTimeout(
            ai.models.generateContent({
              model: 'gemini-3.1-flash-lite',
              contents: conversationContents,
              config: {
                systemInstruction,
              },
            }),
            6000
          );
          replyText = responseLite.text || '';
        } catch {
          // Proceed to smart mentor fallback
        }
      }
    }

    if (!replyText) {
      throw new Error('LocalMentorFallback');
    }

    return res.json({
      success: true,
      reply: replyText,
      source: 'gemini-live',
    });
  } catch (_error: any) {
    // Graceful fallback without noisy logs on quota limits
    const userLast = (messages && messages[messages.length - 1]?.text) || '';
    const fallbackReply = generateFallbackMentorReply(userLast, userProfile, currentAnalysis);

    return res.json({
      success: true,
      reply: fallbackReply,
      source: 'smart-mentor-engine',
    });
  }
});

function enrichRoadmapData(
  parsedData: any,
  actualUniversity: string,
  actualMajor: string,
  actualTargetRole: string
) {
  const matchPercentage = typeof parsedData.matchPercentage === 'number' ? parsedData.matchPercentage : 50;
  const missingSkills = Array.isArray(parsedData.missingSkills) ? parsedData.missingSkills : ['Git', 'Modern Frameworks', 'Production Experience'];
  const rawRoadmap = Array.isArray(parsedData.roadmap) ? parsedData.roadmap : [];

  const enrichedRoadmap = rawRoadmap.map((item: any, idx: number) => {
    const skills = Array.isArray(item.skillsToLearn) ? item.skillsToLearn : (Array.isArray(item.targetSkills) ? item.targetSkills : []);
    return {
      phase: item.phase || `Fase ${idx + 1}`,
      focus: item.focus || item.description || 'Peningkatan kompetensi praktis',
      skillsToLearn: skills,
      recommendedMicroInternship: item.recommendedMicroInternship || item.miniProjectPrompt || 'Proyek mikro UMKM',
      id: item.id || `phase-${idx + 1}`,
      title: item.title || item.phase || `Fase ${idx + 1}`,
      description: item.description || item.focus || 'Peningkatan kompetensi praktis',
      targetSkills: skills,
      estimatedWeeks: item.estimatedWeeks || (idx === 2 ? 1 : 2),
      miniProjectPrompt: item.miniProjectPrompt || item.recommendedMicroInternship || 'Selesaikan proyek riil portofolio',
    };
  });

  return {
    university: parsedData.university || actualUniversity,
    targetRole: parsedData.targetRole || actualTargetRole,
    matchPercentage,
    matchScore: matchPercentage,
    curriculumAnalysis: parsedData.curriculumAnalysis || `Analisis kesiapan ${actualMajor} di ${actualUniversity} untuk peran ${actualTargetRole}.`,
    summary: parsedData.curriculumAnalysis || `Analisis kesiapan ${actualMajor} di ${actualUniversity}.`,
    missingSkills,
    criticalGaps: missingSkills,
    academicStrongPoints: [
      `Fondasi Teori Akademik ${actualMajor}`,
      `Studi Kasus & Mata Kuliah Inti ${actualUniversity}`,
      'Kemampuan Analisis Konseptual',
    ],
    readinessTier: matchPercentage >= 65 ? 'Siap Micro-Internship' : matchPercentage >= 40 ? 'Butuh Fondasi Portofolio' : 'Tahap Eksplorasi',
    industryInsights: `Kebutuhan industri untuk peran ${actualTargetRole} menuntut bukti portofolio nyata dan jam terbang teknis di luar silabus kampus.`,
    roadmap: enrichedRoadmap,
    suggestedMicroInternshipTags: missingSkills.slice(0, 4),
  };
}

// Deterministic generator functions for zero-failure resilience
function generateDeterministicGapAnalysis(
  major: string,
  dreamJob: string,
  currentSkills: string[],
  studyHours: number
) {
  const isData = dreamJob.toLowerCase().includes('data') || dreamJob.toLowerCase().includes('analyst');
  const isFrontend = dreamJob.toLowerCase().includes('frontend') || dreamJob.toLowerCase().includes('web') || dreamJob.toLowerCase().includes('react');
  const isDesign = dreamJob.toLowerCase().includes('design') || dreamJob.toLowerCase().includes('ui/ux');

  let criticalGaps = [
    'Pembersihan Data Riil (Data Wrangling dengan Pandas/SQL Window Functions)',
    'Business Dashboarding Interaktif (Tableau / Looker Studio)',
    'Penerjemahan Insight Data ke Rekomendasi Bisnis Nyata',
    'Version Control & Kolaborasi Git di Lingkungan Tim Industri',
  ];
  let strongPoints = ['Pemahaman Dasar Basis Data Relasional', 'Logika Berpikir Terstruktur', 'Konsep Aliran Proses Bisnis'];
  let tags = ['SQL', 'Looker Studio', 'Data Cleaning', 'Business Analytics', 'Python'];

  if (isFrontend) {
    criticalGaps = [
      'Modern Component Architecture (React Hooks, State Management & Tailwind CSS)',
      'Konsumsi RESTful API & Error Handling Asynchronous di Browser',
      'Optimasi Performa Web & Core Web Vitals',
      'Workflow Git & Deployment Pipeline (Vercel/CI/CD)',
    ];
    strongPoints = ['Dasar Logika Algoritma', 'Pemrograman Berorientasi Objek (OOP)', 'Struktur HTML & CSS Dasar'];
    tags = ['React', 'Tailwind CSS', 'TypeScript', 'Git', 'API Integration'];
  } else if (isDesign) {
    criticalGaps = [
      'Design System Berbasis Token & Komponen Auto-Layout Figma',
      'Uji Kegunaan (Usability Testing) dengan Pengguna Nyata',
      'Kolaborasi Hand-off ke Engineer / Developer',
      'Desain Berorientasi Metrik Bisnis & Konversi',
    ];
    strongPoints = ['Teori Komposisi & Warna Dasar', 'Kreativitas Konseptual', 'Presentasi Desain'];
    tags = ['Figma', 'UI/UX Design', 'Design System', 'User Research', 'Mobile UX'];
  }

  const matchScore = Math.min(85, Math.max(38, Math.round((currentSkills.length / (currentSkills.length + criticalGaps.length)) * 100)));

  return {
    matchScore,
    readinessTier: matchScore >= 60 ? 'Siap Micro-Internship' : 'Butuh Fondasi Portofolio',
    summary: `Di jurusan ${major}, materi kampus umumnya menekankan aspek teoretis dan fundamental akademis. Sementara industri untuk peran ${dreamJob} menuntut kepiawaian perkakas modern, portofolio nyata, dan penyelesaian masalah bisnis riil.`,
    academicStrongPoints: strongPoints,
    criticalGaps: criticalGaps,
    industryInsights: `Pasar industri tahun 2026 memprioritaskan bukti nyata hasil karya (proof of execution). Rekruter lebih melirik mahasiswa yang pernah menyelesaikan micro-project untuk UMKM daripada sekadar nilai IPK tinggi tanpa portofolio publik.`,
    suggestedMicroInternshipTags: tags,
    roadmap: [
      {
        id: 'phase-1',
        phase: 1,
        title: 'Fase 1: Penajaman Fundamental Praktis & Tooling Industri',
        description: 'Tutup celah antara teori kampus dan sintaks modern yang dipakai di industri startup/korporasi.',
        targetSkills: [criticalGaps[0] || 'Modern Tooling', criticalGaps[1] || 'Real-World Workflow'],
        estimatedWeeks: Math.max(2, Math.round(20 / studyHours)),
        recommendedResources: [
          {
            title: 'Dokumentasi Resmi & Hands-on Playground Bebas Biaya',
            type: 'doc',
            url: 'https://developer.mozilla.org',
            isFree: true,
          },
          {
            title: 'FreeCodeCamp / Harvard CS50 Applied Practical Track',
            type: 'course',
            url: 'https://freecodecamp.org',
            isFree: true,
          },
        ],
        miniProjectPrompt: 'Buat proyek mini mandiri dengan dataset/masalah riil (misal: analisis data transaksi UMKM terdekat atau redesign halaman checkout toko lokal).',
      },
      {
        id: 'phase-2',
        phase: 2,
        title: 'Fase 2: Eksekusi Micro-Internship Pertama & Portofolio Riil',
        description: 'Ambil proyek mini berskala 1-2 minggu dari UMKM/Startup di Gasterus Hub untuk memecahkan problem nyata.',
        targetSkills: ['Client Communication', 'Deliverable Packaging', 'Feedback Iteration'],
        estimatedWeeks: Math.max(2, Math.round(25 / studyHours)),
        recommendedResources: [
          {
            title: 'Gasterus Micro-Internship Marketplace',
            type: 'project',
            url: '#internships',
            isFree: true,
          },
        ],
        miniProjectPrompt: 'Kirim proposal ke salah satu proyek UMKM terverifikasi di Gasterus, selesaikan tugas, dan dapatkan sertifikat terverifikasi serta testimoni klien.',
      },
      {
        id: 'phase-3',
        phase: 3,
        title: 'Fase 3: Personal Branding & Simulasi Wawancara Kerja',
        description: 'Kemas hasil micro-internship ke dalam GitHub / Behance / LinkedIn dengan narasi dampak bisnis terukur.',
        targetSkills: ['Storytelling Portofolio', 'STAR Method Interview', 'Pitching Keterampilan'],
        estimatedWeeks: Math.max(1, Math.round(15 / studyHours)),
        recommendedResources: [
          {
            title: 'Konsultasi & Simulasi Interview AI Mentor Gasterus',
            type: 'project',
            url: '#mentor',
            isFree: true,
          },
        ],
        miniProjectPrompt: 'Tulis studi kasus singkat 300 kata tentang bagaimana proyek micro-internship-mu membantu meningkatkan efisiensi atau omzet klien.',
      },
    ],
  };
}

function generateFallbackMentorReply(userPrompt: string, profile: any, analysis: any): string {
  const q = (userPrompt || '').toLowerCase();
  const name = profile?.name || 'Kawan Mahasiswa';
  const campus = profile?.university || 'Kampus Anda';
  const major = profile?.major || 'Sistem Informasi';
  const targetRole = profile?.dreamJob || 'Data Analyst';
  const gaps = (analysis?.missingSkills || analysis?.criticalGaps || ['Perkakas Modern', 'Version Control Git']).join(', ');

  // 1. Interview Simulation
  if (q.includes('interview') || q.includes('wawancara') || q.includes('simulasi')) {
    return `Halo ${name}! Senang sekali kamu mempersiapkan diri untuk wawancara teknis posisi **${targetRole}**.

Berikut adalah pertanyaan simulasi pertama yang paling sering diajukan rekruter:

🎯 **Pertanyaan Teknis #1:**
*"Di perkuliahan ${major} di ${campus}, kamu tentu sudah mempelajari teori fundamental. Bisakah kamu menceritakan satu tantangan teknis nyata yang pernah kamu hadapi saat menangani data/proyek yang kotor atau tidak terstruktur, dan bagaimana kamu menyelesaikannya?"*

💡 **Tips Cara Menjawab dengan Metode STAR (Situation, Task, Action, Result):**
1. **Situation:** Jelaskan konteks tugas/proyek mini yang pernah kamu buat (misal: proyek micro-internship UMKM atau dataset transaksi publik).
2. **Task:** Ceritakan problem spesifik (misal: data transaksi banyak duplikat dan missing values).
3. **Action:** Sebutkan tool konkret yang kamu gunakan (misal: *"Saya menulis script pembersihan dengan Pandas dan menerapkan SQL Window Functions"*).
4. **Result:** Tunjukkan dampak terukur (misal: *"Waktu rekapitulasi data terpangkas 70% dan laporan siap divisualisasikan di dashboard"*).

Coba ketik draf jawabanmu di sini, saya akan bantu mereview dan memperbaikinya!`;
  }

  // 2. Proposal / Pitching to UMKM
  if (q.includes('proposal') || q.includes('pitch') || q.includes('lamar') || q.includes('umkm')) {
    return `Strategi pitching yang tepat adalah kunci memenangkan proyek di **Micro-Internship Hub**, ${name}!

Berikut kerangka **Proposal 3 Paragraf** yang terbukti efektif meluluhkan pemilik UMKM/Startup:

📝 **Contoh Template Pitch:**
> *"Halo tim [Nama Usaha/UMKM]! Saya ${name}, mahasiswa ${major} ${campus}. Saya melihat Anda membutuhkan bantuan untuk [sebutkan judul tugas].*
>
> *Saya memahami tantangan operasional bisnis UMKM: Anda butuh hasil yang rapi, cepat, dan mudah dipahami tanpa jargon rumit. Saya sudah menguasai [sebutkan 2 skill relevan] dan siap menyelesaikan [deliverables spesifik] dalam waktu [durasi proyek] minggu.*
>
> *Anda bisa melihat sampel kualitas pekerjaan saya melalui portofolio/link berikut: [link GitHub/Drive]. Saya siap berdiskusi singkat untuk memulai!"*

🔥 **Tips Tambahan:**
Pemilik UMKM tidak butuh teori skripsi—mereka butuh kepastian bahwa masalah bisnis mereka beres tepat waktu. Fokuslah pada manfaat nyata bagi mereka!`;
  }

  // 3. Weekly Study Priorities & Action Plan
  if (q.includes('prioritas') || q.includes('minggu') || q.includes('belajar') || q.includes('action')) {
    return `Berdasarkan hasil analisis kurikulum **${major} (${campus})**, berikut prioritas belajar 7 hari ke depan untuk posisi **${targetRole}**:

📅 **Rencana Aksi 7 Hari:**
1. **Hari 1-3 (Fokus Tooling Kritis):**
   Pelajari dan praktikkan langsung: **${gaps}**. Jangan hanya membaca dokumentasi, buat 1 skrip atau visualisasi mini.
2. **Hari 4-5 (Eksplorasi Proyek Mikro):**
   Buka tab **Micro-Internship Hub** di Gasterus, pilih 1 tugas mini dari UMKM lokal yang sesuai dengan skill yang baru kamu pelajari, lalu kirimkan proposal.
3. **Hari 6-7 (Kemas Portofolio):**
   Unggah kode/desain ke GitHub atau Notion dengan file \`README.md\` yang menjelaskan masalah bisnis yang diselesaikan.

Dengan konsistensi 10-12 jam seminggu, kamu akan menutup skill gap ini jauh sebelum wisuda!`;
  }

  // 4. Resume & Portfolio Paradox
  if (q.includes('resume') || q.includes('cv') || q.includes('portofolio') || q.includes('paradoks')) {
    return `Bagus sekali kamu menanyakan ini, ${name}! Paradoks portofolio ("butuh pengalaman untuk dapat kerja, tapi butuh kerja untuk dapat pengalaman") adalah masalah nomor satu mahasiswa.

**Cara Memecahkannya di Gasterus:**
1. **Ubah Tugas Kuliah Biasa Menjadi Studi Kasus Bisnis:**
   Jangan tulis: *"Tugas Mata Kuliah Basis Data"*.
   Tulis: *"Optimasi Skema Basis Data Transaksi untuk Kasus Ritel Menggunakan PostgreSQL & Query Indexing"*.
2. **Kerjakan Proyek Skala Mikro untuk UMKM:**
   Satu proyek nyata berbayar dari UMKM (meskipun hanya berdurasi 1-2 minggu) bernilai 10x lebih tinggi di mata rekruter dibanding makalah teori kampus.
3. **Sertakan Kredensial Terverifikasi:**
   Sertifikat digital terverifikasi dari Gasterus memuat testimoni bintang 5 dari pemilik usaha dan ID verifikasi resmi DevFest 2026.

Ambil satu proyek di **Micro-Internship Hub** hari ini untuk mulai membangun rekam jejakmu!`;
  }

  // 5. General Contextual Mentorship Response
  return `Halo ${name}! Sebagai mentormu di platform Gasterus, saya mengamati profilmu sebagai mahasiswa **${major}** di **${campus}** dengan target menjadi **${targetRole}**.

Dari data kesiapan kerjamu, kamu memiliki modal akademis yang baik, namun perlu memperkuat portofolio pada area: **${gaps}**.

Kamu bisa mendiskusikan topik apapun denganku:
- *"Bantu saya simulasi wawancara teknis untuk ${targetRole}"*
- *"Bagaimana cara menulis proposal yang disukai UMKM?"*
- *"Skill apa yang harus saya pelajari 7 hari ke depan?"*
- *"Bagaimana cara membuat CV saya lolos screening HRD?"*

Topik apa yang ingin kita bedah pertama kali?`;
}

// Dev and Prod setup
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gasterus server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
