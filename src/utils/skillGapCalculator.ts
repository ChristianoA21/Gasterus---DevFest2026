/**
 * Skill Gap & Readiness Calculation Logic for Gasterus
 */

import { SkillGapAnalysisResult } from '../types';

export const TOP_TIER_KEYWORDS = [
  'itb',
  'institut teknologi bandung',
  'ui',
  'universitas indonesia',
  'ugm',
  'universitas gadjah mada',
  'binus',
  'bina nusantara',
  'its',
  'institut teknologi sepuluh nopember',
  'telkom',
  'telkom university',
  'unair',
  'universitas airlangga',
  'undip',
  'universitas diponegoro',
  'unpad',
  'universitas padjadjaran',
  'ipb',
  'ipb university',
  'ub',
  'universitas brawijaya',
  'uii',
  'universitas islam indonesia',
  'prasetiya mulya',
  'unpar',
  'universitas katolik parahyangan',
];

export function classifyCampusTier(namaKampus: string): 'unggul' | 'berkembang' {
  if (!namaKampus) return 'berkembang';
  const clean = namaKampus.toLowerCase().trim();
  const isTop = TOP_TIER_KEYWORDS.some((keyword) => {
    // Exact word or boundary match
    const regex = new RegExp(`(^|\\s|[^a-z0-9])${keyword}($|\\s|[^a-z0-9])`, 'i');
    return regex.test(clean) || clean.includes(keyword);
  });
  return isTop ? 'unggul' : 'berkembang';
}

export function generateContextualGapAnalysis(
  namaKampus: string,
  jurusan: string,
  targetRole: string
): SkillGapAnalysisResult {
  const tier = classifyCampusTier(namaKampus);
  const isUnggul = tier === 'unggul';

  // Role categorization
  const isData = targetRole.toLowerCase().includes('data') || targetRole.toLowerCase().includes('analyst') || targetRole.toLowerCase().includes('bi');
  const isDesign = targetRole.toLowerCase().includes('design') || targetRole.toLowerCase().includes('ui') || targetRole.toLowerCase().includes('ux');
  const isFrontend = targetRole.toLowerCase().includes('frontend') || targetRole.toLowerCase().includes('web') || targetRole.toLowerCase().includes('react');
  const isFullstack = targetRole.toLowerCase().includes('fullstack') || targetRole.toLowerCase().includes('engineer');

  let matchPercentage: number;
  let curriculumAnalysis: string;
  let missingSkills: string[];
  let academicStrongPoints: string[];

  if (isUnggul) {
    // Range 60% - 78% for Top Tier
    matchPercentage = 68;
    if (isData) matchPercentage = 71;
    else if (isFrontend || isFullstack) matchPercentage = 66;
    else if (isDesign) matchPercentage = 64;

    missingSkills = isData
      ? [
          'Production-grade Data Pipelines & Orchestration (Airflow/dbt)',
          'Business Stakeholder Pitching & Strategic ROI Translation',
          'Cloud Data Warehousing di Skala Besar (BigQuery / Snowflake)',
          'Niche Analytics & Real-time Streaming Metrics',
        ]
      : isDesign
      ? [
          'Enterprise Design Token Architecture di Skala Multi-Platform',
          'Cross-Functional Stakeholder Alignment & Design QA',
          'Advanced Prototyping dengan Variables & Real-Data Feeds',
          'Konversi Metrik Bisnis (A/B Testing & Micro-interactions)',
        ]
      : [
          'Production Monitoring & Observability (Sentry / OpenTelemetry)',
          'Micro-frontends & Large-scale State Management Architecture',
          'Automated E2E Testing Pipeline (Playwright / Cypress di CI/CD)',
          'High-traffic Performance Profiling & Core Web Vitals Optimization',
        ];

    academicStrongPoints = [
      'Fondasi Teoretis & Algoritma Komputasi yang Sangat Solid',
      'Kurikulum Terakreditasi Unggul dengan Pembaruan Silabus Berkala',
      'Eksposur Tugas Berkelompok dan Studi Kasus Berskala Moderat',
    ];

    curriculumAnalysis = `Kurikulum ${jurusan} di ${namaKampus} memiliki reputasi akademik kuat dengan silabus terbarukan dan kemitraan industri aktif, sehingga kesiapan dasarmu mencapai ${matchPercentage}%. Kesenjangan utama bukan pada logika dasar, melainkan pada pengalaman produksi skala industri nyata (real-world production experience), soft skills negosiasi stakeholder, dan penguasaan perkakas niche modern.`;
  } else {
    // Range 35% - 55% for Local / Regional Campus
    matchPercentage = 44;
    if (isData) matchPercentage = 42;
    else if (isFrontend || isFullstack) matchPercentage = 47;
    else if (isDesign) matchPercentage = 40;

    missingSkills = isData
      ? [
          'Modern Business Intelligence Tooling (Looker Studio / Tableau)',
          'Data Wrangling & Cleaning Riil dengan Python (Pandas/SQL Window Functions)',
          'Version Control & Kolaborasi Repositori Git',
          'Portofolio Pemecahan Kasus Bisnis Nyata untuk UMKM/Startup',
        ]
      : isDesign
      ? [
          'Design System Modern berbasis Auto-Layout & Komponen Figma',
          'User Research Praktis & Usability Testing Pengguna Nyata',
          'Spesifikasi Hand-off Desain ke Tim Developer',
          'Studi Kasus Portofolio Komprehensif (Bukan Sekadar Screenshot Dribbble)',
        ]
      : [
          'Modern Frontend Framework (React 19 / Next.js / TypeScript)',
          'Styling Modern Berbasis Utilitas (Tailwind CSS)',
          'Konsumsi RESTful API Asinkron & Error Handling Riil',
          'Workflow Kolaborasi Git (Branching, Pull Request, CI/CD)',
        ];

    academicStrongPoints = [
      'Pemahaman Konseptual Teori Akademik Dasar',
      'Logika Pemrograman / Desain Fundamental',
      'Kepatuhan Standar Kurikulum Nasional Dikti',
    ];

    curriculumAnalysis = `Kurikulum ${jurusan} di ${namaKampus} cenderung berfokus pada teori konvensional dan silabus klasik yang minim adopsi teknologi industri terkini, sehingga skor kesiapan kerja berada di angka ${matchPercentage}%. Terdapat ketertinggalan signifikan pada penggunaan framework modern, workflow Git industri, serta minimnya tugas portofolio praktis yang dapat langsung dipamerkan ke rekruter.`;
  }

  const roadmap = isData
    ? [
        {
          phase: 'Bulan 1: Pondasi Praktis & Data Wrangling Industri',
          focus: isUnggul
            ? 'Transisi dari data akademis bersih ke penanganan dataset bisnis riil yang tidak rapi'
            : 'Mengejar ketertinggalan materi kampus pada perkakas modern (SQL lanjutan & Pandas)',
          skillsToLearn: ['SQL Window Functions', 'Pandas Cleaning', 'Data Transformation'],
          recommendedMicroInternship: 'Pembersihan data transaksi penjualan 6 bulan untuk UMKM kedai kopi lokal',
          id: 'phase-1',
          title: 'Fase 1: Pondasi Praktis & Data Wrangling',
          description: isUnggul
            ? 'Transisi dari data akademis bersih ke penanganan dataset bisnis riil yang tidak rapi'
            : 'Mengejar ketertinggalan materi kampus pada perkakas modern (SQL lanjutan & Pandas)',
          targetSkills: ['SQL Window Functions', 'Pandas Cleaning', 'Data Transformation'],
          estimatedWeeks: 3,
          miniProjectPrompt: 'Unduh dataset transaksi e-commerce publik dan lakukan pembersihan data kotor menggunakan Pandas/SQL.',
        },
        {
          phase: 'Bulan 2: Visualisasi Interaktif & Dashboarding Bisnis',
          focus: 'Membangun visual dashboard interaktif yang dapat dioperasikan langsung oleh manajer non-teknis',
          skillsToLearn: ['Looker Studio / Tableau', 'KPI Dashboarding', 'Storytelling Data'],
          recommendedMicroInternship: 'Pembuatan dashboard analitik omzet dan jam sibuk pelanggan di Google Looker Studio',
          id: 'phase-2',
          title: 'Fase 2: Visualisasi Interaktif & Dashboarding Bisnis',
          description: 'Membangun visual dashboard interaktif yang dapat dioperasikan langsung oleh manajer non-teknis',
          targetSkills: ['Looker Studio / Tableau', 'KPI Dashboarding', 'Storytelling Data'],
          estimatedWeeks: 3,
          miniProjectPrompt: 'Rancang dashboard 3 halaman dengan filter tanggal dan cabang untuk bisnis UMKM ritel.',
        },
        {
          phase: 'Bulan 3: Personal Branding & Wawancara STAR',
          focus: 'Mengemas proyek micro-internship ke dalam studi kasus GitHub/LinkedIn dan latihan wawancara',
          skillsToLearn: ['STAR Method Interview', 'Portfolio Case Studies', 'Business Impact Pitching'],
          recommendedMicroInternship: 'Publikasi studi kasus komprehensif dari hasil proyek UMKM ke LinkedIn/GitHub',
          id: 'phase-3',
          title: 'Fase 3: Personal Branding & Wawancara STAR',
          description: 'Mengemas proyek micro-internship ke dalam studi kasus GitHub/LinkedIn dan latihan wawancara',
          targetSkills: ['STAR Method Interview', 'Portfolio Case Studies', 'Business Impact Pitching'],
          estimatedWeeks: 2,
          miniProjectPrompt: 'Tulis ringkasan studi kasus 300 kata tentang dampak efisiensi bisnis yang berhasil kamu berikan.',
        },
      ]
    : [
        {
          phase: 'Bulan 1: Pondasi & Modern Tooling Industri',
          focus: isUnggul
            ? 'Akselerasi ke production-ready framework dan automated testing'
            : 'Mengejar ketertinggalan kurikulum kampus pada framework modern dan workflow Git',
          skillsToLearn: isDesign
            ? ['Figma Auto-Layout', 'Design System Tokens', 'Responsive UI']
            : ['React 19 & TypeScript', 'Tailwind CSS', 'Git & GitHub'],
          recommendedMicroInternship: isDesign
            ? 'Redesign wireframe halaman katalog produk untuk mobile web UMKM'
            : 'Pembuatan komponen UI widget dashboard interaktif untuk startup lokal',
          id: 'phase-1',
          title: 'Fase 1: Pondasi & Modern Tooling',
          description: isUnggul
            ? 'Akselerasi ke production-ready framework dan automated testing'
            : 'Mengejar ketertinggalan kurikulum kampus pada framework modern dan workflow Git',
          targetSkills: isDesign
            ? ['Figma Auto-Layout', 'Design System Tokens', 'Responsive UI']
            : ['React 19 & TypeScript', 'Tailwind CSS', 'Git & GitHub'],
          estimatedWeeks: 3,
          miniProjectPrompt: 'Bangun komponen modular responsif dan publikasikan ke repositori publik.',
        },
        {
          phase: 'Bulan 2: Proyek Mikro Nyata & Integrasi Sistem',
          focus: 'Menyelesaikan deliverables riil untuk UMKM/Startup di Gasterus Hub',
          skillsToLearn: isDesign
            ? ['User Testing', 'Hand-off Dev Specs', 'Prototyping']
            : ['REST API Integration', 'State Management', 'Error Handling'],
          recommendedMicroInternship: isDesign
            ? 'Clickable prototype aplikasi pemesanan kuliner lokal siap uji'
            : 'Integrasi sistem form pemesanan dan otomasi spreadsheet untuk UMKM',
          id: 'phase-2',
          title: 'Fase 2: Proyek Mikro Nyata & Integrasi Sistem',
          description: 'Menyelesaikan deliverables riil untuk UMKM/Startup di Gasterus Hub',
          targetSkills: isDesign
            ? ['User Testing', 'Hand-off Dev Specs', 'Prototyping']
            : ['REST API Integration', 'State Management', 'Error Handling'],
          estimatedWeeks: 3,
          miniProjectPrompt: 'Ambil dan selesaikan satu tugas mikro di Gasterus Hub, lalu klaim sertifikat terverifikasi.',
        },
        {
          phase: 'Bulan 3: Personal Branding & Wawancara Kompetensi',
          focus: 'Menampilkan bukti kredensial terverifikasi ke CV dan simulasi interview bersama AI Mentor',
          skillsToLearn: ['STAR Method Pitching', 'CV Optimization', 'Live Technical Interview'],
          recommendedMicroInternship: 'Publikasi kredensial digital terverifikasi Gasterus ke profil LinkedIn',
          id: 'phase-3',
          title: 'Fase 3: Personal Branding & Wawancara Kompetensi',
          description: 'Menampilkan bukti kredensial terverifikasi ke CV dan simulasi interview bersama AI Mentor',
          targetSkills: ['STAR Method Pitching', 'CV Optimization', 'Live Technical Interview'],
          estimatedWeeks: 2,
          miniProjectPrompt: 'Gunakan AI Mentor Gasterus untuk melakukan simulasi wawancara teknis 3 pertanyaan.',
        },
      ];

  const readinessTier =
    matchPercentage >= 65
      ? 'Siap Micro-Internship'
      : matchPercentage >= 40
      ? 'Butuh Fondasi Portofolio'
      : 'Tahap Eksplorasi';

  return {
    university: namaKampus,
    targetRole,
    matchPercentage,
    matchScore: matchPercentage,
    curriculumAnalysis,
    missingSkills,
    campusTier: tier,
    summary: curriculumAnalysis,
    academicStrongPoints,
    criticalGaps: missingSkills,
    industryInsights: isUnggul
      ? `Sebagai mahasiswa ${namaKampus}, ekspektasi rekruter sangat tinggi. Tambahan proyek mikro terverifikasi akan memvalidasi bahwa kamu bukan hanya unggul secara akademis, tapi siap kerja sejak hari pertama.`
      : `Rekruter tahun 2026 tidak lagi terpaku pada nama almamater jika kamu memiliki portofolio proyek riil terverifikasi. Selesaikan tugas mikro di Gasterus untuk membuktikan kemampuan eksekusimu.`,
    readinessTier,
    roadmap,
    suggestedMicroInternshipTags: isData
      ? ['SQL', 'Looker Studio', 'Data Cleaning', 'Business Analytics']
      : isDesign
      ? ['Figma', 'UI/UX Design', 'Design System', 'User Research']
      : ['React', 'Tailwind CSS', 'TypeScript', 'Git'],
  };
}

export function filterMicroInternships<T extends { tags: string[]; category: string; stipend: number; durationWeeks: number }>(
  items: T[],
  filters: {
    search?: string;
    category?: string;
    maxDurationWeeks?: number;
    minStipend?: number;
  }
): T[] {
  return items.filter((item) => {
    if (filters.category && filters.category !== 'Semua' && item.category !== filters.category) {
      return false;
    }
    if (filters.maxDurationWeeks && item.durationWeeks > filters.maxDurationWeeks) {
      return false;
    }
    if (filters.minStipend && item.stipend < filters.minStipend) {
      return false;
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchTag && !matchCat) {
        return false;
      }
    }
    return true;
  });
}
