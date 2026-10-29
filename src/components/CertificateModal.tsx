import React from 'react';
import { X, Award, CheckCircle2, ShieldCheck, Download, Share2, Sparkles, Building, Calendar } from 'lucide-react';
import { ApplicationSubmission, UserProfile } from '../types';

interface CertificateModalProps {
  application: ApplicationSubmission | null;
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  application,
  userProfile,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !application) return null;

  const certificateCode = application.certificateId || `GAS-2026-${application.id.slice(-6).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Certificate Border Accents */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-indigo-500 to-sky-400" />
        
        {/* Modal Controls */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Kredensial Digital Terverifikasi Gasterus (DevFest 2026)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body (Clean, Printable Presentation) */}
        <div className="p-8 sm:p-10 space-y-6 text-center relative overflow-hidden">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-96 h-96 text-white" />
          </div>

          {/* Header Branding */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certificate of Verified Micro-Internship</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-2">
              GASTERUS INDEPENDENT CREDENTIAL
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              ID Verifikasi: {certificateCode}
            </p>
          </div>

          {/* Recipient Details */}
          <div className="space-y-2 py-4 border-y border-slate-800/80">
            <p className="text-xs text-slate-400 uppercase tracking-widest">
              Sertifikat ini diberikan secara sah kepada:
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-200 to-amber-200">
              {userProfile.name}
            </h3>
            <p className="text-xs text-slate-300">
              Mahasiswa {userProfile.major} • {userProfile.university}
            </p>
          </div>

          {/* Project Details */}
          <div className="space-y-2 max-w-lg mx-auto">
            <p className="text-xs text-slate-400">
              Telah berhasil menyelesaikan proyek industri mini skala riil dengan predikat memuaskan:
            </p>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-sm font-bold text-white mb-1">
                "{application.projectTitle}"
              </div>
              <div className="text-xs text-indigo-300 flex items-center justify-center gap-2">
                <Building className="w-3.5 h-3.5" />
                <span>Klien / Mitra: {application.company}</span>
              </div>
            </div>
          </div>

          {/* Client Endorsement */}
          {application.clientReview && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 text-left max-w-lg mx-auto">
              <div className="flex items-center gap-1 text-amber-400 font-bold mb-1">
                {'★'.repeat(application.rating || 5)}
                <span className="text-[10px] text-slate-400 ml-1">Testimoni Klien</span>
              </div>
              <p className="italic leading-relaxed">
                "{application.clientReview}"
              </p>
            </div>
          )}

          {/* Signatures & Accreditation */}
          <div className="grid grid-cols-2 gap-6 pt-4 max-w-md mx-auto text-center border-t border-slate-800">
            <div>
              <div className="font-script text-indigo-400 text-base font-semibold">
                DevFest 2026 Committee
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Gasterus Academic-Industry Board
              </div>
            </div>
            <div>
              <div className="text-amber-400 font-semibold text-xs">
                {application.company}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Verifikator Klien UMKM / Startup
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Diterbitkan: {application.completedAt || 'Oktober 2026'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
