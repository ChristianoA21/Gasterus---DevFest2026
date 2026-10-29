import React from 'react';
import { Target, Users, TrendingUp, ShieldCheck, ArrowRight, Zap, Code2, HandCoins, Briefcase } from 'lucide-react';
import { NavigationTab } from '../types';

interface StatsBannerProps {
  onQuickNavigate: (tab: NavigationTab) => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ onQuickNavigate }) => {
  return (
    <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-indigo-950/30 via-slate-950 to-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      {/* Background glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>DevFest 2026 Submission: Bridging Graduate Skill Gap</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Ubah Teori Kampus Jadi{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-amber-300">
              Portofolio & Pengalaman Industri Nyata
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Kesenjangan kurikulum akademik dengan standar industri membuat 78% mahasiswa cemas saat lulus.
            Gasterus hadir dengan analisis AI cerdas, proyek nyata dari UMKM/Startup, dan pendampingan mentor karir personal.
          </p>

          {/* Quick Pillar Jump Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              onClick={() => onQuickNavigate('analyzer')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40"
            >
              <Target className="w-4 h-4 text-amber-300" />
              <span>Analisis Skill Gap-ku Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onQuickNavigate('internships')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs sm:text-sm font-semibold transition-all"
            >
              <HandCoins className="w-4 h-4 text-emerald-400" />
              <span>Jelajahi Micro-Internships (UMKM)</span>
            </button>
            <button
              onClick={() => onQuickNavigate('mentor')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs sm:text-sm font-semibold transition-all"
            >
              <Code2 className="w-4 h-4 text-sky-400" />
              <span>Konsultasi AI Mentor</span>
            </button>
          </div>
        </div>

        {/* 4 Impact Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/30 transition-all text-center">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">1.840+</div>
            <div className="text-[11px] text-slate-400">Mahasiswa Terbantu</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/30 transition-all text-center">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">420+</div>
            <div className="text-[11px] text-slate-400">Proyek Mikro UMKM</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/30 transition-all text-center">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">93.8%</div>
            <div className="text-[11px] text-slate-400">Kenaikan Kesiapan Kerja</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-sky-500/30 transition-all text-center">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">Rp 2.1 M+</div>
            <div className="text-[11px] text-slate-400">Stipend Tersalurkan</div>
          </div>
        </div>
      </div>
    </div>
  );
};
