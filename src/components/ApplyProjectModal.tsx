import React, { useState } from 'react';
import { X, Send, Sparkles, Building, Coins, Clock, CheckCircle } from 'lucide-react';
import { MicroInternship, UserProfile } from '../types';

interface ApplyProjectModalProps {
  project: MicroInternship | null;
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (applicationData: {
    projectId: string;
    projectTitle: string;
    company: string;
    stipend: number;
    pitch: string;
    portfolioLink: string;
  }) => void;
}

export const ApplyProjectModal: React.FC<ApplyProjectModalProps> = ({
  project,
  userProfile,
  isOpen,
  onClose,
  onSubmitApplication,
}) => {
  if (!isOpen || !project) return null;

  const [pitch, setPitch] = useState(
    `Halo tim ${project.company}! Saya ${userProfile.name}, mahasiswa ${userProfile.major} semester ${userProfile.semester}. Saya telah mempelajari ${userProfile.skills.slice(0, 3).join(', ')} dan tertarik membantu menyelesaikan proyek ${project.title}. Saya siap mengirimkan deliverable berkualitas dalam tenggat waktu ${project.durationWeeks} minggu.`
  );
  const [portfolioLink, setPortfolioLink] = useState('https://github.com/' + userProfile.name.toLowerCase().replace(/\s+/g, ''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmitApplication({
        projectId: project.id,
        projectTitle: project.title,
        company: project.company,
        stipend: project.stipend,
        pitch,
        portfolioLink,
      });
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <h3 className="text-base font-bold text-white">Lamar Micro-Internship</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Proposal Berhasil Dikirim!</h4>
            <p className="text-xs text-slate-300">
              Proyek ini otomatis masuk ke <strong className="text-indigo-400">Workspace Mahasiswa</strong>-mu. Kamu bisa mulai mengerjakan deliverable dan mengklaim sertifikat.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Project Summary snippet */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-white">{project.title}</div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <Building className="w-3 h-3 text-indigo-400" />
                  <span>{project.company}</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <Coins className="w-3 h-3" />
                  <span>Rp {project.stipend.toLocaleString('id-ID')}</span>
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Clock className="w-3 h-3" />
                  <span>Durasi: {project.durationWeeks} Minggu</span>
                </span>
              </div>
            </div>

            {/* Pitch Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Pesan Singkat & Pitch Kenapa Kamu Cocok</span>
                <span className="text-[10px] text-indigo-400">Tampilkan keahlian relevan</span>
              </label>
              <textarea
                rows={4}
                required
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="Jelaskan secara ringkas bagaimana caramu menyelesaikan tugas ini..."
              />
            </div>

            {/* Portfolio Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Tautan Portofolio / GitHub / Google Drive Sampel Karya
              </label>
              <input
                type="url"
                required
                value={portfolioLink}
                onChange={(e) => setPortfolioLink(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="https://github.com/username atau link figma/drive"
              />
            </div>

            {/* Guarantee note */}
            <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>
                Dengan melamar proyek mikro ini, kamu berkomitmen menyelesaikan deliverables sesuai kesepakatan dan berhak atas stipend serta sertifikat pengalaman industri terverifikasi dari Gasterus.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Mengirim Proposal...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Lamaran Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
