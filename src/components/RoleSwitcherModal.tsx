import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  Check, 
  X, 
  ArrowRight,
  Sparkles,
  Users,
  Briefcase,
  FileCheck
} from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole?: (role: UserRole) => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
}) => {
  const { currentRole, switchRole, allDemoAccounts } = useAuth();

  if (!isOpen) return null;

  const rolesConfig: {
    role: UserRole;
    title: string;
    badge: string;
    badgeColor: string;
    borderActive: string;
    icon: React.ReactNode;
    account: typeof allDemoAccounts[UserRole];
    features: string[];
    description: string;
  }[] = [
    {
      role: 'mahasiswa',
      title: 'Peran Mahasiswa',
      badge: 'Job Seeker & Learner',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      borderActive: 'border-indigo-500 ring-2 ring-indigo-500/30 bg-slate-900/90',
      icon: <GraduationCap className="w-6 h-6 text-indigo-400" />,
      account: allDemoAccounts.mahasiswa,
      description: 'Akses penuh untuk mahasiswa mengukur kesiapan industri, menyusun roadmap mandiri, dan melamar proyek mikro.',
      features: [
        'AI Skill Gap Analyzer (Kontekstual Kampus)',
        'Roadmap Belajar Terstruktur & Resources Gratis',
        'Micro-Internship Hub (Mode Pelamar / Submit Pitch)',
        'Workspace Mahasiswa & Klaim Sertifikat Digital',
        'AI Career Mentor (Simulasi STAR & Review CV)',
      ],
    },
    {
      role: 'umkm',
      title: 'Peran Mitra UMKM / Startup',
      badge: 'Client / Employer',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      borderActive: 'border-amber-500 ring-2 ring-amber-500/30 bg-slate-900/90',
      icon: <Building2 className="w-6 h-6 text-amber-400" />,
      account: allDemoAccounts.umkm,
      description: 'Dashboard khusus pemilik usaha lokal & startup untuk merekrut talenta mahasiswa berbasis micro-tasks.',
      features: [
        'Dashboard Ringkasan Proyek & Pelamar UMKM',
        'Buat Lowongan Proyek Mikro (Scope, Budget, Deliverables)',
        'Review Pitching & Portofolio Mahasiswa',
        'Review & Validasi Deliverables Proyek',
        'Beri Rating Klien & Terbitkan Sertifikat Resmi',
      ],
    },
    {
      role: 'admin',
      title: 'Peran Super Admin Platform',
      badge: 'Governance & Operations',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      borderActive: 'border-purple-500 ring-2 ring-purple-500/30 bg-slate-900/90',
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      account: allDemoAccounts.admin,
      description: 'Panel operasional DevFest 2026 untuk memantau metrik nasional, moderasi kampus, dan verifikasi sertifikat.',
      features: [
        'Overview Statistik & Analisis Gap Kurikulum Nasional',
        'Moderasi Kampus (Klasifikasi Unggul vs Daerah)',
        'Verifikasi NIB & Kemitraan UMKM Baru',
        'Audit Trail Sertifikat Digital Terverifikasi (QR Ledger)',
        'Real-time Log Aktivitas Sistem & Transaksi',
      ],
    },
  ];

  const handleSelect = (role: UserRole) => {
    switchRole(role);
    if (onSelectRole) onSelectRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Pilih Akun Demo & Peran Pengguna</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  DevFest 2026
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Beralih peran secara instan untuk mengevaluasi fitur Role-Based Access di platform Gasterus.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {rolesConfig.map((item) => {
            const isSelected = currentRole === item.role;
            return (
              <div
                key={item.role}
                onClick={() => handleSelect(item.role)}
                className={`relative rounded-xl border p-5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] ${
                  isSelected
                    ? item.borderActive
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center gap-1 shadow-md shadow-emerald-500/20">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>PERAN AKTIF</span>
                  </div>
                )}

                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/60">
                      {item.icon}
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">
                    {item.title}
                  </h3>

                  {/* Profile Persona Snippet */}
                  <div className="p-3 my-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
                    <img
                      src={item.account.avatarUrl}
                      alt={item.account.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700"
                    />
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-slate-200 truncate">
                        {item.account.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {item.account.organizationOrCampus}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Feature Bullets */}
                  <div className="space-y-1.5 mb-5 border-t border-slate-800/80 pt-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Fitur Khusus:
                    </span>
                    {item.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Switch Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(item.role);
                  }}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isSelected
                      ? 'bg-slate-800 text-slate-200 border border-slate-700 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Sedang Digunakan</span>
                    </>
                  ) : (
                    <>
                      <span>Beralih ke Peran Ini</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>State disimpan otomatis di Local Storage. Anda bisa berganti peran kapan saja melalui tombol di Navbar.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-300 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
