import React, { useState } from 'react';
import { 
  FolderKanban, 
  Clock, 
  Building, 
  Coins, 
  CheckCircle2, 
  Send, 
  Award, 
  ExternalLink, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Star,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { ApplicationSubmission, UserProfile, NavigationTab } from '../types';

interface StudentWorkspaceProps {
  applications: ApplicationSubmission[];
  userProfile: UserProfile;
  onUpdateApplicationStatus: (appId: string, updates: Partial<ApplicationSubmission>) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onViewCertificate: (app: ApplicationSubmission) => void;
}

export const StudentWorkspace: React.FC<StudentWorkspaceProps> = ({
  applications,
  userProfile,
  onUpdateApplicationStatus,
  onNavigateTab,
  onViewCertificate,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'submitted' | 'completed'>('all');
  const [submittingAppId, setSubmittingAppId] = useState<string | null>(null);
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');

  const filteredApps = applications.filter((app) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'in_progress') return app.status === 'applied' || app.status === 'in_progress';
    return app.status === activeFilter;
  });

  const handleOpenSubmit = (app: ApplicationSubmission) => {
    setSubmittingAppId(app.id);
    setDeliverableUrl(app.submissionDeliverableUrl || app.portfolioLink || '');
    setSubmissionNotes(app.submissionNotes || 'Tugas telah selesai dikerjakan sesuai spesifikasi dan deliverables.');
  };

  const handleSaveDeliverable = (appId: string) => {
    onUpdateApplicationStatus(appId, {
      status: 'submitted',
      submissionDeliverableUrl: deliverableUrl,
      submissionNotes,
    });
    setSubmittingAppId(null);
  };

  const handleSimulateClientReview = (app: ApplicationSubmission) => {
    onUpdateApplicationStatus(app.id, {
      status: 'completed',
      completedAt: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      rating: 5,
      clientReview: `Hasil kerja ${userProfile.name} luar biasa rapi, komunikasi profesional, dan deliverables sangat membantu operasional bisnis kami! Sangat direkomendasikan untuk industri.`,
      certificateId: `GAS-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Workspace & Portfolio Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ruang Kerja Proyek & Portofolio Terverifikasi
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Kelola tugas mikro yang sedang berjalan, kirimkan hasil kerja untuk di-review klien, dan klaim sertifikat kredensial industri untuk CV & LinkedIn.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('internships')}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all"
        >
          <span>Lamar Proyek Lain di Hub</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Workspace Status Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Semua Proyek ({applications.length})
        </button>
        <button
          onClick={() => setActiveFilter('in_progress')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'in_progress'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Sedang Dikerjakan ({applications.filter((a) => a.status === 'applied' || a.status === 'in_progress').length})
        </button>
        <button
          onClick={() => setActiveFilter('submitted')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'submitted'
              ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Menunggu Review ({applications.filter((a) => a.status === 'submitted').length})
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'completed'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Selesai & Bersertifikat ({applications.filter((a) => a.status === 'completed').length})
        </button>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/30">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            Belum Ada Proyek di Kategori Ini
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
            Lamar salah satu tugas mikro dari UMKM di Micro-Internship Hub untuk mulai membangun portofolio riil pertamamu.
          </p>
          <button
            onClick={() => onNavigateTab('internships')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20"
          >
            Buka Micro-Internship Hub
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const isCompleted = app.status === 'completed';
            const isSubmitted = app.status === 'submitted';
            const isInProgress = app.status === 'applied' || app.status === 'in_progress';
            const isSubmittingThis = submittingAppId === app.id;

            return (
              <div
                key={app.id}
                className={`p-6 rounded-2xl border transition-all duration-300 space-y-4 ${
                  isCompleted
                    ? 'bg-slate-900/80 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                    : isSubmitted
                    ? 'bg-slate-900/80 border-amber-500/30'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {isCompleted ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Selesai & Terverifikasi</span>
                        </span>
                      ) : isSubmitted ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Menunggu Review Klien</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Aktif Berjalan</span>
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400">
                        Dilamar: {app.appliedAt}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {app.projectTitle}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-300 mt-1">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{app.company}</span>
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <Coins className="w-3.5 h-3.5" />
                        <span>Rp {app.stipend.toLocaleString('id-ID')}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Status Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    {isCompleted ? (
                      <button
                        onClick={() => onViewCertificate(app)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                      >
                        <Award className="w-4 h-4 text-amber-300" />
                        <span>Lihat Sertifikat Kredensial</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleOpenSubmit(app)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isSubmitted ? 'Perbarui Deliverables' : 'Kirim Hasil Kerja'}</span>
                        </button>

                        <button
                          onClick={() => handleSimulateClientReview(app)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all"
                          title="Simulasikan persetujuan instan dari klien UMKM untuk evaluasi juri/pengguna"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Simulasi Review Klien ✓</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Completed Review Showcase */}
                {isCompleted && app.clientReview && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1 text-amber-400">
                      {'★'.repeat(app.rating || 5)}
                      <span className="text-[11px] text-slate-300 font-semibold ml-1.5">
                        Testimoni Resmi Klien ({app.company})
                      </span>
                    </div>
                    <p className="text-slate-200 italic leading-relaxed">
                      "{app.clientReview}"
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono pt-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>ID Kredensial: {app.certificateId} • Terverifikasi DevFest 2026</span>
                    </div>
                  </div>
                )}

                {/* Submitting Drawer Form */}
                {isSubmittingThis && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span className="flex items-center gap-1.5 text-indigo-300">
                        <FileCheck2 className="w-4 h-4" />
                        <span>Kirimkan Deliverables Proyek</span>
                      </span>
                      <button
                        onClick={() => setSubmittingAppId(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        Batal
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">
                        Tautan Hasil Kerja (GitHub Repository / Google Drive / Figma Prototype)
                      </label>
                      <input
                        type="url"
                        required
                        value={deliverableUrl}
                        onChange={(e) => setDeliverableUrl(e.target.value)}
                        placeholder="https://github.com/username/project-repo"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">
                        Catatan Singkat untuk Klien UMKM
                      </label>
                      <textarea
                        rows={2}
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                        placeholder="Jelaskan ringkas apa saja yang sudah selesai dibuat..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setSubmittingAppId(null)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                      >
                        Tutup
                      </button>
                      <button
                        onClick={() => handleSaveDeliverable(app.id)}
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
                      >
                        Simpan & Kirim ke Klien
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
