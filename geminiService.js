/**
 * geminiService.js
 * Service integrasi Google Gemini API (@google/genai) untuk Gasterus
 * DevFest 2026: AI Skill Gap & Micro-Internship Hub
 */

import { GoogleGenAI, Type } from '@google/genai';

// Skema output terstruktur sesuai spesifikasi PRD Gasterus
export const skillRoadmapResponseSchema = {
  type: Type.OBJECT,
  properties: {
    university: {
      type: Type.STRING,
      description: 'Nama kampus atau universitas yang dianalisis',
    },
    targetRole: {
      type: Type.STRING,
      description: 'Pekerjaan atau peran impian yang ditargetkan',
    },
    matchPercentage: {
      type: Type.INTEGER,
      description: 'Persentase kecocokan kurikulum kampus terhadap kebutuhan industri (0-100)',
    },
    curriculumAnalysis: {
      type: Type.STRING,
      description: 'Penjelasan rinci mengapa skor kesiapan kampus X untuk jurusan Y bernilai Z% dibandingkan standar industri saat ini.',
    },
    missingSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Daftar skill industri wajib yang belum diajarkan di kurikulum kampus',
    },
    roadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase: {
            type: Type.STRING,
            description: 'Nama fase roadmap (misal: Bulan 1: Pondasi Dasar)',
          },
          focus: {
            type: Type.STRING,
            description: 'Fokus materi untuk mengejar ketertinggalan kurikulum',
          },
          skillsToLearn: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Daftar skill praktis yang harus dipelajari mandiri',
          },
          recommendedMicroInternship: {
            type: Type.STRING,
            description: 'Jenis proyek mikro yang cocok dicoba di UMKM/Startup',
          },
        },
        required: ['phase', 'focus', 'skillsToLearn', 'recommendedMicroInternship'],
      },
      description: 'Roadmap bertahap langkah demi langkah',
    },
  },
  required: [
    'university',
    'targetRole',
    'matchPercentage',
    'curriculumAnalysis',
    'missingSkills',
    'roadmap',
  ],
};

/**
 * Menghasilkan analisis skill gap dan roadmap personal kontekstual terhadap nama kampus.
 * 
 * Kriteria Kontekstual Kampus:
 * 1. Kampus Ternama / Akreditasi Unggul (ITB, UI, UGM, BINUS, ITS, dll):
 *    - Kurikulum diperbarui, kemitraan industri aktif
 *    - Match Percentage rata-rata 60% - 78%
 *    - Gap berfokus pada soft skills, real-world production experience, niche tools industri
 * 
 * 2. Kampus Lokal / Daerah:
 *    - Kurikulum cenderung teoretis & silabus lama
 *    - Match Percentage rata-rata 35% - 55%
 *    - Gap mencakup framework modern, best practices, version control Git, dan proyek praktis
 * 
 * @param {string} namaKampus - Nama universitas atau institut
 * @param {string} jurusan - Program studi mahasiswa
 * @param {string} targetRole - Pekerjaan impian di industri
 * @returns {Promise<Object>} Data analisis terstruktur
 */
export async function generateSkillRoadmap(namaKampus, jurusan, targetRole) {
  // Jika dieksekusi di browser, panggil secure server proxy endpoint
  if (typeof window !== 'undefined') {
    const response = await fetch('/api/gemini/analyze-gap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        namaKampus: namaKampus || 'Universitas Indonesia',
        jurusan: jurusan || 'Sistem Informasi',
        targetRole: targetRole || 'Data Analyst & BI Specialist',
      }),
    });

    const result = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Gagal memproses roadmap melalui API');
    }
    return result.data;
  }

  // Jika dieksekusi langsung di lingkungan Node.js server
  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const prompt = `Analisis kesenjangan keterampilan (Skill Gap) mahasiswa secara KONTEKSTUAL terhadap kurikulum kampus.
Nama Kampus: ${namaKampus}
Jurusan: ${jurusan}
Target Role: ${targetRole}

ATURAN EVALUASI KONTEKSTUAL KAMPUS:
1. Kampus Ternama / Akreditasi Unggul (contoh: ITB, UI, UGM, BINUS, ITS, Unair, Telkom, Undip, Unpad, dll.):
   - Kurikulum biasanya lebih mutakhir dan ada kemitraan industri.
   - Match Percentage WAJIB di rentang 60% - 78%.
   - Gap fokus pada: soft skills, real-world production experience, scale, atau niche tools industri.
   - curriculumAnalysis harus mengapresiasi reputasi kurikulum ${namaKampus} sekaligus memaparkan tantangan adaptasi produksi riil.

2. Kampus Lokal / Kurang Dikenal / Daerah:
   - Kurikulum cenderung teoretis, berbasis silabus lama, minim integrasi teknologi industri terbaru.
   - Match Percentage WAJIB di rentang 35% - 55%.
   - Gap mencakup: framework modern, best practices, version control (Git), serta proyek praktis nyata.
   - curriculumAnalysis harus memaparkan secara objektif mengapa kurikulum ${namaKampus} tertinggal dari standar industri saat ini dan bagaimana mahasiswa harus mengejar materi.

Kembalikan hasil sesuai responseSchema yang disediakan.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction: 'Kamu adalah konsultan kurikulum industri & tech lead senior Indonesia. Patuhi rentang matchPercentage sesuai kategori kampus.',
      responseMimeType: 'application/json',
      responseSchema: skillRoadmapResponseSchema,
    },
  });

  return JSON.parse(response.text || '{}');
}
