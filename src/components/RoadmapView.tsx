import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  Briefcase, 
  Sparkles, 
  Share2, 
  Compass, 
  ArrowRight,
  ExternalLink,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SkillGapAnalysisResult, UserProfile, NavigationTab } from '../types';

interface RoadmapViewProps {
  analysisResult: SkillGapAnalysisResult | null;
  userProfile: UserProfile;
  onNavigateTab: (tab: NavigationTab) => void;
  onFilterMicroInternshipsByTag?: (tag: string) => void;
  completedMilestones: string[];
  onToggleMilestone: (milestoneId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  analysisResult,
  userProfile,
  onNavigateTab,
  onFilterMicroInternshipsByTag,
  completedMilestones,
  onToggleMilestone,
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({
    'phase-1': true,
    'phase-2': true,
    'phase-3': true,
  });

  const toggleExpand = (id: string) => {
    setExpandedMilestones((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const milestones = analysisResult?.roadmap || [];
  const completedCount = milestones.filter((m) => completedMilestones.includes(m.id)).length;
  const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  const copyRoadmap = () => {
    if (!analysisResult) return;
    const text = `🎯 Roadmap Karier Gasterus untuk ${userProfile.name}
Target: ${userProfile.dreamJob} (${userProfile.major})
Match Rate: ${analysisResult.matchScore}%

Langkah Belajar:
${milestones
  .map(
    (m, i) =>
      `${i + 1}. ${m.title} (~${m.estimatedWeeks} minggu)\n   Skills: ${m.targetSkills.join(', ')}\n   Proyek: ${m.miniProjectPrompt}`
  )
  .join('\n\n')}

Dibuat via Gasterus (DevFest 2026)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!analysisResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Roadmap Belum Dihasilkan</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Kamu belum melakukan analisis kesenjangan kurikulum. Lakukan analisis terlebih dahulu untuk mendapatkan Roadmap langkah demi langkah personalmu.
        </p>
        <button
          onClick={() => onNavigateTab('analyzer')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Buka AI Skill Gap Analyzer</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Progress */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Personalized Career Roadmap</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Roadmap Akselerasi: Menuju {userProfile.dreamJob}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Jembatan terstruktur untuk menutup celah dari perkuliahan {userProfile.major} ke standar kualifikasi industri.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={copyRoadmap}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>{copied ? 'Tersalin ke Clipboard!' : 'Bagikan Roadmap'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('internships')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-300" />
              <span>Cari Micro-Internship</span>
            </button>
          </div>
        </div>

        {/* Interactive Progress Meter */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Progres Selesai: {completedCount} dari {milestones.length} Fase</span>
            </span>
            <span className="font-bold text-amber-400">{progressPercent}% Rampung</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step by Step Timeline List */}
      <div className="space-y-6">
        {milestones.map((milestone, idx) => {
          const isDone = completedMilestones.includes(milestone.id);
          const isExpanded = expandedMilestones[milestone.id] !== false;

          return (
            <div
              key={milestone.id || idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isDone
                  ? 'bg-slate-900/60 border-emerald-500/30 shadow-emerald-500/5'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-xl'
              }`}
            >
              {/* Header */}
              <div className="p-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => onToggleMilestone(milestone.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                    title={isDone ? 'Tandai belum selesai' : 'Tandai fase selesai'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-600 hover:text-indigo-400" />
                    )}
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        FASE {milestone.phase || idx + 1}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>Estimasi: {milestone.estimatedWeeks} Minggu</span>
                      </span>
                      {isDone && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Selesai Dikuasai
                        </span>
                      )}
                    </div>
                    <h3 className={`text-base sm:text-lg font-bold ${isDone ? 'text-emerald-200 line-through' : 'text-white'}`}>
                      {milestone.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleExpand(milestone.id)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  aria-label="Toggle detail"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expandable Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 space-y-4 bg-slate-950/40">
                  {/* Target Skills */}
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Fokus Keterampilan yang Ditargetkan:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {milestone.targetSkills.map((s, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-indigo-300 border border-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hands-on Mini Project Prompt */}
                  <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tantangan Proyek Nyata (Portofolio Enabler):</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {milestone.miniProjectPrompt}
                    </p>
                  </div>

                  {/* Recommended Resources */}
                  {milestone.recommendedResources && milestone.recommendedResources.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Bahan Ajar & Dokumentasi Rekomendasi:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {milestone.recommendedResources.map((res, i) => (
                          <a
                            key={i}
                            href={res.url.startsWith('#') ? undefined : res.url}
                            onClick={() => {
                              if (res.url === '#internships') onNavigateTab('internships');
                              if (res.url === '#mentor') onNavigateTab('mentor');
                            }}
                            target={res.url.startsWith('#') ? undefined : '_blank'}
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all text-xs text-slate-300 group"
                          >
                            <span className="flex items-center gap-2 truncate">
                              <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span className="truncate group-hover:text-white">{res.title}</span>
                            </span>
                            <span className="flex items-center gap-1.5 shrink-0 ml-2">
                              {res.isFree && (
                                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded">
                                  Free
                                </span>
                              )}
                              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-300" />
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action row */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => onToggleMilestone(milestone.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                        isDone
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-600/30'
                      }`}
                    >
                      {isDone ? 'Batalkan Status Selesai' : 'Tandai Fase Ini Selesai ✓'}
                    </button>

                    <button
                      onClick={() => {
                        if (milestone.targetSkills[0] && onFilterMicroInternshipsByTag) {
                          onFilterMicroInternshipsByTag(milestone.targetSkills[0]);
                        }
                        onNavigateTab('internships');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      <span>Cari Proyek Terkait</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
