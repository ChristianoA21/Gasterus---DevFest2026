import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Coins, 
  Clock, 
  ShieldCheck, 
  Building, 
  Plus, 
  ArrowRight,
  CheckCircle2,
  Tag,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MicroInternship, UserProfile } from '../types';

interface MicroInternshipHubProps {
  projects: MicroInternship[];
  userProfile: UserProfile;
  onApplyProject: (project: MicroInternship) => void;
  onOpenPostProjectModal: () => void;
  initialTagFilter?: string;
  onClearTagFilter?: () => void;
}

export const MicroInternshipHub: React.FC<MicroInternshipHubProps> = ({
  projects,
  userProfile,
  onApplyProject,
  onOpenPostProjectModal,
  initialTagFilter,
  onClearTagFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialTagFilter || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [maxDuration, setMaxDuration] = useState<number>(4);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const categories = [
    'Semua',
    'Tech & AI',
    'UI/UX Design',
    'Data & Analytics',
    'Digital Marketing',
    'Content Writing',
  ];

  // Filtering
  const filteredProjects = projects.filter((project) => {
    if (selectedCategory !== 'Semua' && project.category !== selectedCategory) {
      return false;
    }
    if (project.durationWeeks > maxDuration) {
      return false;
    }
    if (onlyVerified && !project.verifiedPartner) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = project.title.toLowerCase().includes(q);
      const matchCompany = project.company.toLowerCase().includes(q);
      const matchTags = project.tags.some((t) => t.toLowerCase().includes(q));
      const matchDesc = project.description.toLowerCase().includes(q);
      if (!matchTitle && !matchCompany && !matchTags && !matchDesc) {
        return false;
      }
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Title & Post Project CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Fitur Utama 2: Micro-Internship Marketplace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Proyek Nyata UMKM & Startup: Solusi Paradoks Portofolio
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Selesaikan tugas mikro terfokus 1-3 minggu. Dapatkan stipend wajar, bangun portofolio riil terverifikasi, dan bantu digitalisasi UMKM Indonesia.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPostProjectModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-semibold transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Pasang Tugas Mikro (UMKM)</span>
          </button>
        </div>
      </div>

      {/* Tag filter notification badge if routed from Roadmap */}
      {searchQuery && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Menampilkan hasil terfilter berdasarkan keahlian: <strong>"{searchQuery}"</strong></span>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              if (onClearTagFilter) onClearTagFilter();
            }}
            className="text-xs text-indigo-400 hover:text-indigo-200 underline font-semibold"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        {/* Search Input & Category Pills */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari proyek, tech stack (misal: Looker Studio, React, Figma)..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <label className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Maks. Durasi:</span>
            </label>
            <select
              value={maxDuration}
              onChange={(e) => setMaxDuration(parseInt(e.target.value, 10))}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value={1}>1 Minggu</option>
              <option value={2}>2 Minggu</option>
              <option value={3}>3 Minggu</option>
              <option value={4}>Semua (s/d 4 Minggu)</option>
            </select>
          </div>

          <div className="md:col-span-3 flex items-center justify-start md:justify-end">
            <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-0 accent-indigo-500"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Partner Terverifikasi Saja</span>
              </span>
            </label>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/30">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            Tidak ada proyek yang sesuai filter
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Coba ganti kata kunci pencarian atau reset filter kategori untuk melihat seluruh penawaran micro-internship.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Semua');
              setMaxDuration(4);
              setOnlyVerified(false);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isExpanded = expandedProjectId === project.id;

            return (
              <div
                key={project.id}
                className="flex flex-col justify-between rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all p-5 space-y-4 group"
              >
                <div>
                  {/* Company & Badges */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                          <span>{project.company}</span>
                          {project.verifiedPartner && (
                            <span title="Mitra Terverifikasi">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{project.location}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-400 border border-slate-700">
                      {project.companyType}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 mb-1.5 inline-block">
                      {project.category}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Expanded Deliverables */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 bg-slate-950/40 p-3 rounded-xl animate-fadeIn">
                      <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Deliverables yang Diharapkan:</span>
                      </div>
                      <ul className="space-y-1.5">
                        {project.deliverables.map((d, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <span className="text-emerald-400 mt-0.5">✓</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-950 text-slate-300 border border-slate-800 hover:border-indigo-400 transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Stipend, Duration, and Action Buttons */}
                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">Stipend Proyek</div>
                      <div className="font-extrabold text-emerald-400 text-sm">
                        Rp {project.stipend.toLocaleString('id-ID')}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Durasi Pengerjaan</div>
                      <div className="font-semibold text-slate-200 flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{project.durationWeeks} Minggu</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExpand(project.id)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>{isExpanded ? 'Tutup' : 'Detail'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    <button
                      onClick={() => onApplyProject(project)}
                      className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
                    >
                      <span>Lamar Proyek</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
