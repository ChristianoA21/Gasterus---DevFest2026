import React, { useState } from 'react';
import { 
  UserAccount, 
  CampusModerationItem, 
  UmkmVerificationItem, 
  CertificateAuditRecord, 
  SystemAuditLog,
  ApplicationSubmission
} from '../types';
import { 
  MOCK_CAMPUSES, 
  MOCK_UMKM_PARTNERS, 
  MOCK_CERTIFICATES, 
  MOCK_SYSTEM_LOGS 
} from '../data/mockData';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  GraduationCap, 
  Award, 
  TrendingUp, 
  Activity, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Check, 
  X, 
  ExternalLink,
  RefreshCw,
  FileText,
  BarChart3,
  Layers,
  Sparkles,
  Lock,
  ArrowUpRight
} from 'lucide-react';

interface AdminDashboardProps {
  currentAccount: UserAccount;
  onViewCertificatePreview?: (cert: CertificateAuditRecord) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentAccount,
  onViewCertificatePreview,
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'moderation' | 'certificates' | 'logs'>('metrics');
  
  // Moderation state
  const [campuses, setCampuses] = useState<CampusModerationItem[]>(MOCK_CAMPUSES);
  const [umkmPartners, setUmkmPartners] = useState<UmkmVerificationItem[]>(MOCK_UMKM_PARTNERS);
  const [certificates, setCertificates] = useState<CertificateAuditRecord[]>(MOCK_CERTIFICATES);
  const [systemLogs, setSystemLogs] = useState<SystemAuditLog[]>(MOCK_SYSTEM_LOGS);

  const [campusSearch, setCampusSearch] = useState('');
  const [umkmSearch, setUmkmSearch] = useState('');
  const [certSearch, setCertSearch] = useState('');
  const [logFilterCategory, setLogFilterCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleVerifyCampus = (id: string) => {
    setCampuses((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'verified' ? 'audit_pending' : 'verified' }
          : c
      )
    );
    showToast('Status akreditasi kurikulum kampus berhasil diperbarui!');
  };

  const handleToggleUmkmVerification = (id: string) => {
    setUmkmPartners((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, verified: !u.verified }
          : u
      )
    );
    showToast('Status verifikasi legalitas NIB UMKM berhasil diperbarui!');
  };

  const handleRevokeCertificate = (id: string) => {
    setCertificates((prev) =>
      prev.map((cert) =>
        cert.id === id
          ? { ...cert, status: cert.status === 'valid' ? 'revoked' : 'valid' }
          : cert
      )
    );
    showToast('Integritas sertifikat berhasil diubah!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-purple-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center ring-2 ring-purple-500/50 shadow-lg text-white">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Dashboard Super Admin
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  <Lock className="w-3 h-3" />
                  DevFest 2026 Governance
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2">
                <span>Administrator: <strong className="text-white">{currentAccount.name}</strong></span>
                <span>•</span>
                <span className="text-purple-300 font-medium">{currentAccount.organizationOrCampus}</span>
              </p>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Pusat pengawasan ekosistem: moderasi kurikulum kampus, kepatuhan mitra UMKM, audit ledger sertifikat, dan log aktivitas sistem.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-purple-500/30 text-xs text-purple-300 font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Sistem Operasional Aktif</span>
            </div>
          </div>
        </div>

        {/* Global Platform KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Mahasiswa Terdaftar</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              1.428
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">+18% bulan ini</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Kampus Terdata</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
              84 Kampus
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">34 Provinsi</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mitra UMKM / Startup</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-cyan-400 mt-1">
              68 Mitra
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">NIB Terverifikasi</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Proyek Mikro Selesai</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
              312 Proyek
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Sertifikat terbit</div>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
              <span>Total Stipend Tersalurkan</span>
            </div>
            <div className="text-base sm:text-lg font-black text-white mt-1">
              Rp 374.400.000
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">100% Escrow Sukses</div>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'metrics'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Overview Metrik & Kesiapan Kampus</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'moderation'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Moderasi Kampus & UMKM</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'certificates'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Transaksi & Ledger Sertifikat ({certificates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'logs'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Log Aktivitas Sistem</span>
        </button>
      </div>

      {/* TAB 1: METRICS & READINESS GAP COMPARISON */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          {/* Comparative Gap Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-400" />
                    <span>Disparitas Kesiapan Kerja: Kampus Unggul vs Daerah</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Rata-rata persentase kesiapan kurikulum terhadap standar industri teknologi 2026.
                  </p>
                </div>
              </div>

              {/* Progress bars comparison */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-indigo-300">
                      Kampus Akreditasi Unggul (ITB, UI, UGM, BINUS)
                    </span>
                    <strong className="text-indigo-400">68.4% Rata-rata Kesiapan</strong>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full" style={{ width: '68.4%' }} />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Fokus gap: Soft skills, real production environments, dan niche tools.
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-amber-300">
                      Kampus Daerah / Silabus Teoretis (Maluku, Sulteng, NTT, dll)
                    </span>
                    <strong className="text-amber-400">46.2% Rata-rata Kesiapan</strong>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" style={{ width: '46.2%' }} />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Fokus gap: Framework modern, Git workflow, praktik deployment, dan studi kasus riil.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-slate-300 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Insight Kebijakan DevFest 2026:</strong> Mahasiswa dari kampus daerah yang menyelesaikan minimal <strong>2 proyek micro-internship</strong> mengalami kenaikan kesiapan portofolio sebesar <strong>+38%</strong>, berhasil menutup kesenjangan kurikulum akademik.
                </p>
              </div>
            </div>

            {/* Category Demand breakdown */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>Distribusi Kebutuhan Proyek Mikro UMKM Terverifikasi</span>
              </h3>
              <p className="text-xs text-slate-400">
                Porsi proyek yang diposting oleh 68 mitra UMKM & Startup di platform.
              </p>

              <div className="space-y-3 pt-1">
                {[
                  { label: 'Data & Analytics (Dashboard POS, Excel, Looker Studio)', pct: 36, color: 'bg-indigo-500' },
                  { label: 'Tech & AI (React, Python Script, Otomasi Web)', pct: 28, color: 'bg-cyan-500' },
                  { label: 'UI/UX Design (Redesign Mobile App, Figma)', pct: 18, color: 'bg-amber-500' },
                  { label: 'Digital Marketing & SEO Lokal', pct: 12, color: 'bg-emerald-500' },
                  { label: 'Content Writing & TikTok Copywriting', pct: 6, color: 'bg-rose-500' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>{item.label}</span>
                      <strong className="text-white">{item.pct}%</strong>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MODERATION (CAMPUS & UMKM) */}
      {activeTab === 'moderation' && (
        <div className="space-y-8">
          {/* Section 1: Campus Directory Moderation */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                  <span>Database Kurikulum Kampus & Klasifikasi Kesiapan</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Basis data yang digunakan AI Skill Gap Analyzer untuk menentukan kesiapan dasar secara kontekstual.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={campusSearch}
                  onChange={(e) => setCampusSearch(e.target.value)}
                  placeholder="Cari kampus atau kota..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Nama Kampus</th>
                    <th className="py-3 px-4">Lokasi</th>
                    <th className="py-3 px-4">Klasifikasi Tier</th>
                    <th className="py-3 px-4">Akreditasi</th>
                    <th className="py-3 px-4">Rata-rata Gap</th>
                    <th className="py-3 px-4">Status Audit</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {campuses
                    .filter((c) =>
                      c.name.toLowerCase().includes(campusSearch.toLowerCase()) ||
                      c.city.toLowerCase().includes(campusSearch.toLowerCase())
                    )
                    .map((campus) => (
                      <tr key={campus.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-bold text-white">
                          {campus.name}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {campus.city}, {campus.province}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            campus.tier === 'unggul'
                              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {campus.tier === 'unggul' ? 'Akreditasi Unggul (60-78%)' : 'Kampus Daerah (35-55%)'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-200">
                          {campus.accreditation}
                        </td>
                        <td className="py-3 px-4 text-rose-400 font-bold">
                          {campus.avgCurriculumGap}% gap
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            campus.status === 'verified'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {campus.status === 'verified' ? 'Terverifikasi' : 'Perlu Audit Silabus'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleVerifyCampus(campus.id)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium"
                          >
                            {campus.status === 'verified' ? 'Audit Ulang' : 'Setujui Silabus'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: UMKM Partners Verification */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <span>Verifikasi Legalitas & Kemitraan UMKM</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Memastikan seluruh UMKM penyedia lowongan memiliki NIB valid dan dana stipend escrow terjamin.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={umkmSearch}
                  onChange={(e) => setUmkmSearch(e.target.value)}
                  placeholder="Cari UMKM atau pemilik..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Nama UMKM</th>
                    <th className="py-3 px-4">Owner / PIC</th>
                    <th className="py-3 px-4">Bidang Usaha</th>
                    <th className="py-3 px-4">Nomor NIB</th>
                    <th className="py-3 px-4">Saldo Escrow</th>
                    <th className="py-3 px-4">Status Mitra</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {umkmPartners
                    .filter((u) =>
                      u.companyName.toLowerCase().includes(umkmSearch.toLowerCase()) ||
                      u.ownerName.toLowerCase().includes(umkmSearch.toLowerCase())
                    )
                    .map((partner) => (
                      <tr key={partner.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-bold text-white">
                          {partner.companyName}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {partner.ownerName}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {partner.businessType}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          {partner.nibNumber}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-400">
                          Rp {partner.stipendBalance.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            partner.verified
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {partner.verified ? 'Terverifikasi' : 'Tertunda'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleToggleUmkmVerification(partner.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                              partner.verified
                                ? 'bg-slate-800 hover:bg-slate-700 text-amber-400'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            {partner.verified ? 'Tangguhkan' : 'Verifikasi NIB'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CERTIFICATES & TRANSACTION LEDGER */}
      {activeTab === 'certificates' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Audit Trail Sertifikat Digital Terverifikasi (DevFest 2026 QR Ledger)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Setiap sertifikat memiliki hash kriptografis SHA-256 yang menjamin keaslian pengerjaan proyek mikro.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={certSearch}
                onChange={(e) => setCertSearch(e.target.value)}
                placeholder="Cari ID Sertifikat atau Mahasiswa..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="py-3 px-4">ID Sertifikat</th>
                  <th className="py-3 px-4">Mahasiswa & Kampus</th>
                  <th className="py-3 px-4">Mitra UMKM / Startup</th>
                  <th className="py-3 px-4">Proyek Mikro Selesai</th>
                  <th className="py-3 px-4">Tanggal Terbit</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Status Hash</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {certificates
                  .filter((cert) =>
                    cert.certificateId.toLowerCase().includes(certSearch.toLowerCase()) ||
                    cert.studentName.toLowerCase().includes(certSearch.toLowerCase()) ||
                    cert.companyName.toLowerCase().includes(certSearch.toLowerCase())
                  )
                  .map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {cert.certificateId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{cert.studentName}</div>
                        <div className="text-[10px] text-slate-400">{cert.university}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-200">
                        {cert.companyName}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate">
                        {cert.projectTitle}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {cert.issuedDate}
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-400">
                        ⭐ {cert.rating}/5
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cert.status === 'valid'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {cert.status === 'valid' ? 'Valid & On-Chain' : 'Dicabut'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleRevokeCertificate(cert.id)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                        >
                          {cert.status === 'valid' ? 'Cabut' : 'Pulihkan'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: REAL-TIME SYSTEM ACTIVITY LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <span>Log Aktivitas Sistem & Transaksi Real-Time</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit trail lengkap dari seluruh aktivitas 3 peran: Mahasiswa, Mitra UMKM, dan Admin.
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-slate-400 shrink-0">Kategori:</span>
              {['all', 'AI Analyzer', 'Micro-Internship', 'Sertifikat', 'Moderasi'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setLogFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    logFilterCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'Semua' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            {systemLogs
              .filter((log) => logFilterCategory === 'all' || log.category === logFilterCategory)
              .map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      log.severity === 'success' ? 'bg-emerald-400' :
                      log.severity === 'warning' ? 'bg-amber-400' :
                      log.severity === 'alert' ? 'bg-rose-400' : 'bg-indigo-400'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white">{log.actor}</strong>
                        <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                          log.role === 'mahasiswa' ? 'bg-indigo-500/20 text-indigo-400' :
                          log.role === 'umkm' ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {log.role.toUpperCase()}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-300 font-medium">{log.action}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Target: <span className="text-slate-200">{log.target}</span> ({log.category})
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 shrink-0">
                    {log.timestamp}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
