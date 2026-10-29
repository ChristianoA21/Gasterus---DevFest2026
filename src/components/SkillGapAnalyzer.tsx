import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Flame, 
  Clock, 
  Briefcase, 
  HelpCircle,
  Plus,
  X,
  RefreshCw,
  Compass,
  GraduationCap,
  Building2,
  TrendingUp,
  Target
} from 'lucide-react';
import { 
  SkillGapAnalysisResult, 
  UserProfile, 
  NavigationTab 
} from '../types';
import { 
  POPULAR_MAJORS, 
  POPULAR_DREAM_JOBS, 
  MAJOR_DEFAULT_SKILLS 
} from '../data/mockData';
import { generateSkillRoadmap } from '../services/geminiService';

interface SkillGapAnalyzerProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  analysisResult: SkillGapAnalysisResult | null;
  setAnalysisResult: (result: SkillGapAnalysisResult) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onFilterMicroInternshipsByTag?: (tag: string) => void;
}

export const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({
  userProfile,
  onUpdateProfile,
  analysisResult,
  setAnalysisResult,
  onNavigateTab,
  onFilterMicroInternshipsByTag,
}) => {
  const [namaKampus, setNamaKampus] = useState(userProfile.university || 'Universitas Indonesia');
  const [major, setMajor] = useState(userProfile.major || 'Sistem Informasi');
  const [semester, setSemester] = useState(userProfile.semester || 6);
  const [dreamJob, setDreamJob] = useState(userProfile.dreamJob || 'Data Analyst & BI Specialist');
  const [skills, setSkills] = useState<string[]>(userProfile.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [studyHours, setStudyHours] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Quick switch skills when major changes
  const handleMajorChange = (newMajor: string) => {
    setMajor(newMajor);
    const suggested = MAJOR_DEFAULT_SKILLS[newMajor];
    if (suggested) {
      setSkills(suggested);
    }
  };

  const addSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Run contextual skill gap analysis
  const runAnalysis = async () => {
    setIsLoading(true);
    setApiError(null);

    // Save profile updates
    onUpdateProfile({
      university: namaKampus,
      major,
      semester,
      dreamJob,
      skills,
    });

    try {
      // Call generateSkillRoadmap with namaKampus, major, dreamJob
      const result = await generateSkillRoadmap(namaKampus, major, dreamJob);
      setAnalysisResult(result);
    } catch (err: any) {
      console.error('Error analyzing skill gap:', err);
      setApiError('Gagal memproses analisis AI. Menggunakan model cadangan.');
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-set demo campus buttons to easily compare Unggul vs Lokal
  const setDemoCampus = (campusName: string) => {
    setNamaKampus(campusName);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fitur Utama 1: Contextual AI Skill Gap Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Analisis Kesenjangan Kurikulum Kampus vs Kualifikasi Industri
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Sistem secara cerdas menyesuaikan evaluasi berdasarkan reputasi kurikulum kampusmu (akreditasi unggul vs kampus daerah) untuk menghasilkan roadmap dan persentase kesiapan yang realistis.
          </p>
        </div>

        {analysisResult && (
          <button
            onClick={() => onNavigateTab('roadmap')}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Compass className="w-4 h-4 text-amber-300" />
            <span>Buka Roadmap Interaktif</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Input Configuration & Profile Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Parameter Akademik & Karier</span>
            </h3>
            <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              Input Data
            </span>
          </div>

          {/* Nama Kampus / Universitas (Prominent) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Nama Kampus / Universitas</span>
              </label>
              <span className="text-[10px] text-amber-400 font-semibold">Kontekstual AI</span>
            </div>
            <input
              type="text"
              required
              value={namaKampus}
              onChange={(e) => setNamaKampus(e.target.value)}
              placeholder="Contoh: ITB, UI, UGM, BINUS, atau Universitas Daerah..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner font-medium"
            />
            {/* Quick Campus Comparison Presets */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-slate-400">Coba bandingkan konteks kurikulum:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setDemoCampus('ITB')}
                  className={`px-2 py-0.5 rounded text-[10px] transition-colors border ${
                    namaKampus.toLowerCase().includes('itb')
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800/80 text-indigo-300 border-indigo-500/30 hover:bg-slate-700'
                  }`}
                >
                  ITB (Unggul: 60-78%)
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCampus('Universitas Indonesia')}
                  className={`px-2 py-0.5 rounded text-[10px] transition-colors border ${
                    namaKampus.toLowerCase().includes('indonesia')
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800/80 text-indigo-300 border-indigo-500/30 hover:bg-slate-700'
                  }`}
                >
                  UI (Unggul: 60-78%)
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCampus('BINUS University')}
                  className={`px-2 py-0.5 rounded text-[10px] transition-colors border ${
                    namaKampus.toLowerCase().includes('binus')
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800/80 text-indigo-300 border-indigo-500/30 hover:bg-slate-700'
                  }`}
                >
                  BINUS (Unggul)
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCampus('Universitas Daerah')}
                  className={`px-2 py-0.5 rounded text-[10px] transition-colors border ${
                    namaKampus.toLowerCase().includes('daerah')
                      ? 'bg-amber-600 text-white border-amber-500'
                      : 'bg-slate-800/80 text-amber-300 border-amber-500/30 hover:bg-slate-700'
                  }`}
                >
                  Kampus Daerah (35-55%)
                </button>
              </div>
            </div>
          </div>

          {/* Major Select & Semester */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Jurusan Kuliah</label>
              <select
                value={major}
                onChange={(e) => handleMajorChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {POPULAR_MAJORS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                  <option key={s} value={s}>
                    Smt {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dream Job */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Target Pekerjaan (Target Role)</span>
              <span className="text-[10px] text-amber-400">Role Incaran</span>
            </label>
            <select
              value={dreamJob}
              onChange={(e) => setDreamJob(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {POPULAR_DREAM_JOBS.map((job) => (
                <option key={job} value={job}>
                  {job}
                </option>
              ))}
            </select>
          </div>

          {/* Current Skills list */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Skill yang Sudah Diajarkan di Kampus</span>
              <span className="text-[10px] text-slate-400">{skills.length} skill terpilih</span>
            </label>
            <div className="flex flex-wrap gap-1.5 min-h-[50px] p-2 bg-slate-950/70 border border-slate-800 rounded-xl">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-200 border border-slate-700"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-red-400 transition-colors"
                    aria-label={`Hapus ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add custom skill */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Tambah skill baru (misal: Docker, Git)..."
                className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>
          </div>

          {/* Study hours slider */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Alokasi Belajar Mandiri:</span>
              </span>
              <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {studyHours} jam / minggu
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={30}
              step={2}
              value={studyHours}
              onChange={(e) => setStudyHours(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={runAnalysis}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-amber-600 hover:from-indigo-500 hover:via-blue-500 hover:to-amber-500 shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>Menganalisis Kurikulum {namaKampus}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Analisis Skill Gap {namaKampus} Sekarang</span>
              </>
            )}
          </button>

          {apiError && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}
        </div>

        {/* Results Visualizer Section */}
        <div className="lg:col-span-7 space-y-6">
          {analysisResult ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Score & Tier Card with matchPercentage */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-5">
                    {/* Circular Score Badge with matchPercentage */}
                    <div className="relative w-24 h-24 rounded-full bg-slate-950 flex items-center justify-center border-4 border-indigo-500/30 shadow-inner">
                      <div className="text-center">
                        <span className="text-2xl font-black text-white">
                          {analysisResult.matchPercentage ?? analysisResult.matchScore}%
                        </span>
                        <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                          Match Rate
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-400">
                        Status Kesiapan Industri Berdasarkan Kampus
                      </div>
                      <div className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-sky-300 to-emerald-400 mt-0.5">
                        {analysisResult.readinessTier || 'Siap Micro-Internship'}
                      </div>
                      <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-amber-300 flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>{analysisResult.university || namaKampus}</span>
                        </span>
                        <span className="text-slate-500">•</span>
                        <span>{major}</span>
                        <span className="text-slate-500">→</span>
                        <span className="text-indigo-400 font-semibold">{analysisResult.targetRole || dreamJob}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateTab('roadmap')}
                    className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    <span>Langkah Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Highlighted Curriculum Analysis Callout (Mandatory per PRD) */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>Analisis Kurikulum Kampus: {analysisResult.university || namaKampus}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    {analysisResult.curriculumAnalysis || analysisResult.summary}
                  </p>
                </div>
              </div>

              {/* Missing Skills Section */}
              {((analysisResult.missingSkills && analysisResult.missingSkills.length > 0) ||
                (analysisResult.criticalGaps && analysisResult.criticalGaps.length > 0)) && (
                <div className="p-5 rounded-xl bg-slate-900/80 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Kekurangan / Missing Skills di Luar Kurikulum Kampus</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Wajib dipelajari mandiri
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    Skill industri yang belum terintegrasi di silabus {analysisResult.university || namaKampus}:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(analysisResult.missingSkills || analysisResult.criticalGaps || []).map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-200 border border-amber-500/30"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Phased Roadmap Overview in Analyzer */}
              {analysisResult.roadmap && analysisResult.roadmap.length > 0 && (
                <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Target className="w-4 h-4 text-sky-400" />
                      <span>Rekomendasi Proyek Mikro Berdasarkan Kebutuhan Kurikulum:</span>
                    </h4>
                    <button
                      onClick={() => onNavigateTab('roadmap')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <span>Lihat Detail Fase</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {analysisResult.roadmap.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 hover:border-indigo-500/30 transition-all"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {item.phase}
                          </span>
                          {item.recommendedMicroInternship && (
                            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              <span className="truncate max-w-[280px]">Tugas: {item.recommendedMicroInternship}</span>
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-semibold text-slate-200">
                          {item.focus}
                        </div>

                        {item.skillsToLearn && item.skillsToLearn.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {item.skillsToLearn.map((s, si) => (
                              <span
                                key={si}
                                className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty placeholder prompt */
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/30 text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Analisis Kesiapan Kerja Berdasarkan Kampusmu
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed mb-6">
                Masukkan nama kampusmu (misal: <strong className="text-indigo-300">ITB, UI, UGM, BINUS</strong> atau kampus daerah lainnya) untuk mengevaluasi gap kurikulum terhadap target role impianmu.
              </p>
              <button
                onClick={runAnalysis}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Mulai Analisis Kontekstual Sekarang</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
