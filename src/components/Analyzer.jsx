/**
 * Analyzer.jsx
 * Komponen AI Skill Gap Analyzer Gasterus untuk DevFest 2026
 * Menerima input namaKampus, jurusan, dan targetRole lalu memanggil generateSkillRoadmap
 */

import React, { useState } from 'react';
import { generateSkillRoadmap } from '../../geminiService.js';
import { 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  Briefcase, 
  RefreshCw,
  Building2
} from 'lucide-react';

export default function Analyzer({ initialUniversity = 'Universitas Indonesia', initialMajor = 'Sistem Informasi', initialRole = 'Data Analyst & BI Specialist', onRoadmapGenerated }) {
  const [namaKampus, setNamaKampus] = useState(initialUniversity);
  const [jurusan, setJurusan] = useState(initialMajor);
  const [targetRole, setTargetRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Memanggil fungsi generateSkillRoadmap dengan parameter namaKampus, jurusan, targetRole
      const data = await generateSkillRoadmap(namaKampus, jurusan, targetRole);
      setResult(data);
      if (onRoadmapGenerated) {
        onRoadmapGenerated(data);
      }
    } catch (err) {
      console.error('Error generating roadmap:', err);
      setError('Terjadi kendala saat menganalisis. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-amber-400" />
          <span>AI Skill Gap Analyzer Kontekstual Kampus</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Menilai kesiapan industri secara objektif berdasarkan kurikulum kampus Anda (Akreditasi Unggul vs Kampus Daerah).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Input */}
        <form onSubmit={handleAnalyze} className="lg:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <span>Nama Kampus / Universitas (namaKampus)</span>
              <span className="text-[10px] text-amber-400">Kontekstual</span>
            </label>
            <input
              type="text"
              required
              value={namaKampus}
              onChange={(e) => setNamaKampus(e.target.value)}
              placeholder="Contoh: ITB, UI, UGM, BINUS, atau Universitas Daerah..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            {/* Quick Demo Buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
              <button
                type="button"
                onClick={() => setNamaKampus('ITB')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30"
              >
                ITB (Unggul: 60-78%)
              </button>
              <button
                type="button"
                onClick={() => setNamaKampus('Universitas Daerah')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30"
              >
                Kampus Daerah (35-55%)
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">
              Jurusan Kuliah (jurusan)
            </label>
            <input
              type="text"
              required
              value={jurusan}
              onChange={(e) => setJurusan(e.target.value)}
              placeholder="Contoh: Sistem Informasi, Teknik Informatika..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">
              Target Pekerjaan / Role (targetRole)
            </label>
            <input
              type="text"
              required
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Contoh: Data Analyst, Frontend Developer..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>Menganalisis Kurikulum {namaKampus}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Analisis Skill Gap dengan AI</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
              {error}
            </div>
          )}
        </form>

        {/* Display Output Result */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              {/* Match Percentage Display */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Match Percentage Kesiapan Industri
                  </div>
                  <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-sky-300 to-emerald-400">
                    {result.matchPercentage}%
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {result.university} • {result.targetRole}
                  </div>
                </div>

                <div className="w-16 h-16 rounded-full bg-slate-950 border-4 border-indigo-500/40 flex items-center justify-center font-black text-xl text-white">
                  {result.matchPercentage}%
                </div>
              </div>

              {/* Dynamic Curriculum Analysis Text */}
              <div className="space-y-1.5 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Building2 className="w-4 h-4" />
                  <span>Analisis Kurikulum Kampus ({result.university})</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {result.curriculumAnalysis}
                </p>
              </div>

              {/* Missing Skills */}
              {result.missingSkills && result.missingSkills.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Skill yang Belum Ada di Kurikulum Kampus:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs bg-amber-500/10 text-amber-200 border border-amber-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Roadmap Phases */}
              {result.roadmap && result.roadmap.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-indigo-400" />
                    <span>Roadmap Pembelajaran Mandiri:</span>
                  </div>
                  <div className="space-y-2">
                    {result.roadmap.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-indigo-300">
                          <span>{item.phase}</span>
                        </div>
                        <div className="text-slate-200 font-medium">{item.focus}</div>
                        {item.skillsToLearn && (
                          <div className="text-slate-400">
                            <strong>Skills:</strong> {item.skillsToLearn.join(', ')}
                          </div>
                        )}
                        {item.recommendedMicroInternship && (
                          <div className="text-emerald-400 flex items-center gap-1 pt-0.5">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span><strong>Rekomendasi Proyek Mikro:</strong> {item.recommendedMicroInternship}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/40 text-center text-slate-400">
              <GraduationCap className="w-12 h-12 text-slate-600 mb-2" />
              <div className="text-sm font-semibold text-white">Belum Ada Hasil Analisis</div>
              <div className="text-xs max-w-sm mt-1">
                Masukkan nama kampus Anda di formulir sebelah kiri untuk melihat evaluasi kurikulum dan roadmap belajar.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
