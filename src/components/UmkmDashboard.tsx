import React, { useState } from 'react';
import { 
  MicroInternship, 
  ApplicationSubmission, 
  UserAccount 
} from '../types';
import { 
  Building2, 
  PlusCircle, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  ExternalLink, 
  Award, 
  Star, 
  AlertCircle, 
  FileText, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Eye,
  Check,
  X,
  Send,
  Layers
} from 'lucide-react';

interface UmkmDashboardProps {
  currentAccount: UserAccount;
  projects: MicroInternship[];
  applications: ApplicationSubmission[];
  onOpenPostProjectModal: () => void;
  onUpdateApplicationStatus: (appId: string, updates: Partial<ApplicationSubmission>) => void;
  onViewCertificate?: (app: ApplicationSubmission) => void;
}

export const UmkmDashboard: React.FC<UmkmDashboardProps> = ({
  currentAccount,
  projects,
  applications,
  onOpenPostProjectModal,
  onUpdateApplicationStatus,
  onViewCertificate,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'projects' | 'candidates'>('overview');
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Deliverable Review Modal State
  const [reviewingApp, setReviewingApp] = useState<ApplicationSubmission | null>(null);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filter projects created by or affiliated with this UMKM
  const umkmProjects = projects.filter((p) => 
    p.company.toLowerCase().includes(currentAccount.organizationOrCampus.toLowerCase()) ||
    currentAccount.organizationOrCampus.toLowerCase().includes(p.company.toLowerCase()) ||
    p.company.toLowerCase().includes('kopi kenangan')
  );

  // Fallback to all projects if none strictly matched company name
  const effectiveProjects = umkmProjects.length > 0 ? umkmProjects : projects.slice(0, 3);

  // All applications matching these projects or mock candidates
  const umkmApplications = applications.filter((app) => 
    effectiveProjects.some((p) => p.id === app.projectId || p.title === app.projectTitle) ||
    app.company.toLowerCase().includes('kopi kenangan')
  );

  // KPIs
  const totalApplicants = umkmApplications.length;
  const inProgressApps = umkmApplications.filter((a) => a.status === 'in_progress').length;
  const submittedApps = umkmApplications.filter((a) => a.status === 'submitted').length;
  const completedApps = umkmApplications.filter((a) => a.status === 'completed').length;
  const totalStipendDisbursed = umkmApplications
    .filter((a) => a.status === 'completed')
    .reduce((acc, curr) => acc + curr.stipend, 0);

  // Filtered applications for Candidates Tab
  const filteredApplications = umkmApplications.filter((app) => {
    const matchesSearch = 
      (app.applicantName || 'Bintang Pratama').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.applicantUniversity || 'Universitas Indonesia').toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.pitch.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatusFilter === 'all' || app.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleAcceptCandidate = (app: ApplicationSubmission) => {
    onUpdateApplicationStatus(app.id, {
      status: 'in_progress',
    });
    showToast(`Pelamar ${app.applicantName || 'Mahasiswa'} diterima untuk memulai proyek!`);
  };

  const handleOpenReviewModal = (app: ApplicationSubmission) => {
    setReviewingApp(app);
    setRatingInput(app.rating || 5);
    setFeedbackInput(app.clientReview || 'Hasil kerja sangat memuaskan, rapi, dan sesuai brief bisnis kami.');
  };

  const handleApproveDeliverableAndCertify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingApp) return;

    const certId = reviewingApp.certificateId || `GAS-2026-KP${Math.floor(100 + Math.random() * 900)}`;

    onUpdateApplicationStatus(reviewingApp.id, {
      status: 'completed',
      completedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      rating: ratingInput,
      clientReview: feedbackInput,
      certificateId: certId,
    });

    showToast(`Deliverable disetujui! Sertifikat digital ${certId} resmi diterbitkan untuk mahasiswa.`);
    setReviewingApp(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentAccount.avatarUrl}
              alt={currentAccount.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500/50 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {currentAccount.organizationOrCampus}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Mitra Terverifikasi
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2">
                <span>Penanggung Jawab: <strong className="text-white">{currentAccount.name}</strong></span>
                <span>•</span>
                <span className="text-amber-300 font-medium">{currentAccount.roleTitle}</span>
              </p>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Solusi rekrutmen talenta muda Indonesia berbasis proyek nyata (Micro-Internship) tanpa birokrasi magang konvensional.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenPostProjectModal}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>+ Buat Lowongan Proyek Mikro</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>Lowongan Aktif</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              {effectiveProjects.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Proyek siap dilamar</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Total Pelamar Masuk</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
              {totalApplicants}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Mahasiswa mendaftar</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sedang Dikerjakan</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-cyan-400 mt-1">
              {inProgressApps}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Pengerjaan aktif</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Proyek Selesai</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
              {completedApps}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Sertifikat diterbitkan</div>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
              <span>Dana Stipend Disalurkan</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-white mt-1">
              Rp {totalStipendDisbursed.toLocaleString('id-ID')}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">100% Escrow Aman</div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeSubTab === 'overview'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Ringkasan & Panduan UMKM</span>
        </button>

        <button
          onClick={() => setActiveSubTab('projects')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeSubTab === 'projects'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Kelola Lowongan Proyek ({effectiveProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('candidates')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeSubTab === 'candidates'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Review Kandidat Pelamar ({totalApplicants})</span>
          {submittedApps > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black">
              {submittedApps} Review Siap
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: OVERVIEW & GUIDELINES */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Action Guide & Pending Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Alur Kerja Micro-Internship di Gasterus untuk UMKM</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                      1
                    </div>
                    <div className="text-xs font-bold text-white">Posting Kebutuhan Nyata</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Jelaskan problem spesifik bisnis Anda (contoh: pembuatan dashboard penjualan, redesign kemasan, perbaikan SEO).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">
                      2
                    </div>
                    <div className="text-xs font-bold text-white">Pilih Kandidat via Pitch</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Review proposal dan portofolio kandidat. Terima pelamar yang paling sesuai dengan durasi 1–3 minggu.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                      3
                    </div>
                    <div className="text-xs font-bold text-white">Validasi & Rilis Sertifikat</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Periksa link deliverables mahasiswa, berikan rating bintang, dan terbitkan sertifikat digital resmi DevFest 2026.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pending Action Alerts */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Aksi Prioritas yang Perlu Perhatian Anda</span>
                  </h3>
                  <button
                    onClick={() => setActiveSubTab('candidates')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                  >
                    <span>Lihat Semua Kandidat</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {umkmApplications.filter(a => a.status === 'applied' || a.status === 'submitted').map((app) => (
                    <div
                      key={app.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {app.applicantName || 'Bintang Pratama'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            • {app.applicantUniversity || 'Universitas Indonesia'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            app.status === 'submitted'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {app.status === 'submitted' ? 'Deliverable Siap Direview' : 'Menunggu Persetujuan'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300">
                          Proyek: <strong>{app.projectTitle}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {app.status === 'applied' ? (
                          <button
                            onClick={() => handleAcceptCandidate(app)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Terima Lamaran</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenReviewModal(app)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Review & Sertifikasi</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {umkmApplications.filter(a => a.status === 'applied' || a.status === 'submitted').length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400">
                      Tidak ada permohonan tertunda saat ini. Semua pelamar telah diproses.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Quick UMKM Profile card */}
            <div className="space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Informasi Profil Bisnis
                    </h4>
                    <div className="text-xs text-slate-400">Terdaftar di Ekosistem Gasterus</div>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs border-t border-slate-800 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nama Bisnis:</span>
                    <span className="text-white font-medium">{currentAccount.organizationOrCampus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PIC / Owner:</span>
                    <span className="text-white font-medium">{currentAccount.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email Kontak:</span>
                    <span className="text-white font-medium">{currentAccount.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sektor Industri:</span>
                    <span className="text-amber-400 font-medium">Kuliner & Ritel F&B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Legalitas & NIB:</span>
                    <span className="text-emerald-400 font-medium">9120003498124 (Terverifikasi)</span>
                  </div>
                </div>

                <button
                  onClick={onOpenPostProjectModal}
                  className="w-full mt-2 py-2 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  <span>Pasang Lowongan Baru</span>
                </button>
              </div>

              {/* Tips for UMKM */}
              <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Tips Sukses Proyek Mikro</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Bagi scope pekerjaan menjadi 3 deliverables konkret (contoh: 1. Pembersihan data kotor, 2. Pembuatan skema visual, 3. Penyerahan dashboard final). Hal ini membantu mahasiswa fokus dan menyelesaikan tugas tepat waktu dalam 2–3 minggu.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE PROJECTS */}
      {activeSubTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                <span>Lowongan Proyek Mikro Anda</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelola dan pantau perkembangan pelamar pada setiap lowongan yang telah Anda buka.
              </p>
            </div>
            <button
              onClick={onOpenPostProjectModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Lowongan Proyek</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {effectiveProjects.map((project) => {
              const projectApplicants = umkmApplications.filter(
                (a) => a.projectId === project.id || a.projectTitle === project.title
              );

              return (
                <div
                  key={project.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400 border border-indigo-500/20">
                        {project.category}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Aktif Menerima Pelamar
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-2">
                      {project.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="space-y-1.5 border-t border-slate-800/80 pt-2.5 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">Stipend:</span>
                        <strong className="text-amber-400">Rp {project.stipend.toLocaleString('id-ID')}</strong>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">Durasi:</span>
                        <span>{project.durationWeeks} Minggu</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">Pelamar Terdaftar:</span>
                        <span className="font-bold text-white">{project.applicantCount || projectApplicants.length} mahasiswa</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setActiveSubTab('candidates');
                        setSearchQuery(project.title);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>Review Pelamar ({projectApplicants.length})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: REVIEW CANDIDATES & DELIVERABLES */}
      {activeSubTab === 'candidates' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kandidat berdasarkan nama, kampus (UI, ITB, dll), proyek, atau skill..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Status:</span>
              </span>
              {[
                { key: 'all', label: 'Semua' },
                { key: 'applied', label: 'Perlu Review' },
                { key: 'in_progress', label: 'Aktif Dikerjakan' },
                { key: 'submitted', label: 'Deliverable Siap' },
                { key: 'completed', label: 'Selesai' },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedStatusFilter(filter.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedStatusFilter === filter.key
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center border-l border-slate-800 pl-3 ml-2 gap-1">
                <button
                  onClick={() => setViewMode('detailed')}
                  className={`p-1.5 rounded-lg text-xs ${
                    viewMode === 'detailed'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tampilan Detail"
                >
                  Kartu Detail
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`p-1.5 rounded-lg text-xs ${
                    viewMode === 'compact'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tampilan Ringkas (Tabel)"
                >
                  Tabel Ringkas
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Mode */}
          {viewMode === 'detailed' ? (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 hover:border-slate-700 transition-all shadow-md"
                >
                  {/* Top Candidate Row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-base shadow">
                        {(app.applicantName || 'B')[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-white">
                            {app.applicantName || 'Bintang Pratama'}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            app.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : app.status === 'submitted'
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                              : app.status === 'in_progress'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          }`}>
                            {app.status === 'completed' && 'Selesai & Tersertifikasi'}
                            {app.status === 'submitted' && 'Deliverable Siap Diuji'}
                            {app.status === 'in_progress' && 'Sedang Dikerjakan'}
                            {app.status === 'applied' && 'Menunggu Review Pitch'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                          <span>{app.applicantUniversity || 'Universitas Indonesia'}</span>
                          <span>•</span>
                          <span>{app.applicantMajor || 'Sistem Informasi'} (Sem {app.applicantSemester || 6})</span>
                          {app.applicantMatchScore && (
                            <>
                              <span>•</span>
                              <span className="text-indigo-400 font-semibold">
                                AI Match: {app.applicantMatchScore}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-[11px] text-slate-400">Target Lowongan:</div>
                      <div className="text-xs font-bold text-white max-w-xs truncate">
                        {app.projectTitle}
                      </div>
                      <div className="text-[11px] text-amber-400 font-semibold mt-0.5">
                        Stipend: Rp {app.stipend.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>

                  {/* Pitch & Proposal Box */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        <span>Proposal & Pitch Singkat Mahasiswa:</span>
                      </span>
                      <span className="text-[10px]">Diajukan: {app.appliedAt}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{app.pitch}"
                    </p>
                    {app.portfolioLink && (
                      <div className="pt-2 flex items-center gap-2 text-xs">
                        <span className="text-slate-400 text-[11px]">Portofolio / GitHub:</span>
                        <a
                          href={app.portfolioLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium underline underline-offset-2"
                        >
                          <span>{app.portfolioLink}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Submission Deliverable Preview (If submitted or completed) */}
                  {(app.status === 'submitted' || app.status === 'completed') && (
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                          <FileText className="w-4 h-4" />
                          <span>Hasil Pengerjaan Mahasiswa (Deliverables):</span>
                        </div>
                        {app.completedAt && (
                          <span className="text-[10px] text-slate-400">
                            Diselesaikan: {app.completedAt}
                          </span>
                        )}
                      </div>
                      {app.submissionNotes && (
                        <p className="text-xs text-slate-300">
                          <strong>Catatan Mahasiswa:</strong> {app.submissionNotes}
                        </p>
                      )}
                      {app.submissionDeliverableUrl && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-400">Link Deliverable:</span>
                          <a
                            href={app.submissionDeliverableUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>{app.submissionDeliverableUrl}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                      {app.clientReview && (
                        <div className="pt-2 border-t border-emerald-500/20 text-xs text-slate-300 flex items-start gap-2">
                          <div className="flex text-amber-400 shrink-0">
                            {[...Array(app.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                          </div>
                          <span>"{app.clientReview}"</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    {app.status === 'applied' && (
                      <button
                        onClick={() => handleAcceptCandidate(app)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow"
                      >
                        <Check className="w-4 h-4" />
                        <span>Terima Mahasiswa & Mulai Pengerjaan</span>
                      </button>
                    )}

                    {app.status === 'in_progress' && (
                      <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Mahasiswa sedang mengerjakan tugas (Menunggu penyerahan deliverables)</span>
                      </div>
                    )}

                    {app.status === 'submitted' && (
                      <button
                        onClick={() => handleOpenReviewModal(app)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow"
                      >
                        <Award className="w-4 h-4" />
                        <span>Review Deliverable & Terbitkan Sertifikat</span>
                      </button>
                    )}

                    {app.status === 'completed' && onViewCertificate && (
                      <button
                        onClick={() => onViewCertificate(app)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Lihat Sertifikat Digital ({app.certificateId})</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredApplications.length === 0 && (
                <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl text-xs text-slate-400">
                  Tidak ada pelamar yang cocok dengan kriteria filter Anda.
                </div>
              )}
            </div>
          ) : (
            /* Compact Mode (Table View) */
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Kandidat</th>
                      <th className="py-3 px-4">Kampus & Jurusan</th>
                      <th className="py-3 px-4">Lowongan Proyek</th>
                      <th className="py-3 px-4">AI Match</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-bold text-white">
                          {app.applicantName || 'Bintang Pratama'}
                        </td>
                        <td className="py-3 px-4">
                          {app.applicantUniversity || 'UI'} - {app.applicantMajor || 'Sistem Informasi'}
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate">
                          {app.projectTitle}
                        </td>
                        <td className="py-3 px-4 font-semibold text-indigo-400">
                          {app.applicantMatchScore ? `${app.applicantMatchScore}%` : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            app.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : app.status === 'submitted'
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : app.status === 'in_progress'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-indigo-500/20 text-indigo-400'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {app.status === 'applied' && (
                            <button
                              onClick={() => handleAcceptCandidate(app)}
                              className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold"
                            >
                              Terima
                            </button>
                          )}
                          {app.status === 'submitted' && (
                            <button
                              onClick={() => handleOpenReviewModal(app)}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold"
                            >
                              Review & Rilis
                            </button>
                          )}
                          {app.status === 'completed' && onViewCertificate && (
                            <button
                              onClick={() => onViewCertificate(app)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px]"
                            >
                              Sertifikat
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Deliverable Review & Certification Modal */}
      {reviewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Review Deliverables & Terbitkan Sertifikat
                  </h3>
                  <div className="text-xs text-slate-400">
                    Kandidat: {reviewingApp.applicantName || 'Bintang Pratama'} ({reviewingApp.applicantUniversity || 'UI'})
                  </div>
                </div>
              </div>
              <button
                onClick={() => setReviewingApp(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Deliverable details */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="text-slate-400">Tautan Hasil Kerja / Deliverables:</div>
              <a
                href={reviewingApp.submissionDeliverableUrl || 'https://lookerstudio.google.com'}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1.5 font-bold"
              >
                <span>{reviewingApp.submissionDeliverableUrl || 'https://lookerstudio.google.com/reporting/demo-sales-pos'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              {reviewingApp.submissionNotes && (
                <p className="text-slate-300 pt-1">
                  <strong>Catatan:</strong> {reviewingApp.submissionNotes}
                </p>
              )}
            </div>

            <form onSubmit={handleApproveDeliverableAndCertify} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Beri Rating Klien untuk Mahasiswa (1 - 5 Bintang):
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingInput(star)}
                      className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= ratingInput
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-400 ml-2">
                    {ratingInput} / 5 Bintang
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Ulasan & Testimoni Bisnis (Tercetak di Sertifikat Resmi):
                </label>
                <textarea
                  required
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Contoh: Dashboard yang dibuat sangat rapi dan memudahkan kasir kami menganalisis jam sibuk..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Dengan menekan tombol di bawah, stipend Rp {reviewingApp.stipend.toLocaleString('id-ID')} akan diteruskan ke mahasiswa dan sertifikat terverifikasi DevFest 2026 langsung diterbitkan.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewingApp(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Award className="w-4 h-4" />
                  <span>Setujui & Terbitkan Sertifikat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
