import React, { useState } from 'react';
import { X, Plus, Building2, Coins, Clock, CheckCircle } from 'lucide-react';
import { MicroInternship } from '../types';

interface PostProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (newProject: MicroInternship) => void;
}

export const PostProjectModal: React.FC<PostProjectModalProps> = ({
  isOpen,
  onClose,
  onAddProject,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [companyType, setCompanyType] = useState<'UMKM' | 'Startup' | 'Agency'>('UMKM');
  const [category, setCategory] = useState<MicroInternship['category']>('Tech & AI');
  const [location, setLocation] = useState('Remote (Nasional)');
  const [description, setDescription] = useState('');
  const [deliverablesStr, setDeliverablesStr] = useState('');
  const [stipend, setStipend] = useState(1200000);
  const [durationWeeks, setDurationWeeks] = useState(2);
  const [difficulty, setDifficulty] = useState<MicroInternship['difficulty']>('Beginner');
  const [tagsStr, setTagsStr] = useState('React, Tailwind CSS, API');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const deliverables = deliverablesStr
      .split('\n')
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newProject: MicroInternship = {
      id: `gasterus-proj-${Date.now()}`,
      title,
      company,
      companyType,
      category,
      location,
      description,
      deliverables: deliverables.length > 0 ? deliverables : ['Menyerahkan file hasil kerja terstruktur', 'Dokumentasi ringkas hasil pekerjaan'],
      stipend,
      durationWeeks,
      difficulty,
      tags: tags.length > 0 ? tags : ['Mini Project', category],
      applicantCount: 0,
      postedDate: 'Baru saja',
      deadline: '10 hari lagi',
      verifiedPartner: true,
    };

    onAddProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Pasang Tugas Mikro Baru (UMKM / Startup)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Nama Bisnis / Startup</label>
              <input
                type="text"
                required
                placeholder="Contoh: Kopi Nusantara / Warung Pintar"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Jenis Entitas</label>
              <select
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="UMKM">UMKM Lokal</option>
                <option value="Startup">Startup Teknologi</option>
                <option value="Agency">Creative Agency</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Judul Tugas Mikro</label>
            <input
              type="text"
              required
              placeholder="Contoh: Pembuatan Desain Feed Instagram & Katalog Digital UMKM"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Kategori Bidang</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Tech & AI">Tech & AI</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Data & Analytics">Data & Analytics</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Content Writing">Content Writing</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tingkat Kesulitan</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Beginner">Beginner (Pemula)</option>
                <option value="Intermediate">Intermediate (Menengah)</option>
                <option value="Advanced">Advanced (Mahir)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Deskripsi Tugas</label>
            <textarea
              rows={3}
              required
              placeholder="Jelaskan kebutuhan tugas bisnis Anda secara singkat..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Deliverables (Satu per baris)
            </label>
            <textarea
              rows={2}
              placeholder="1. Desain Figma 5 frame&#10;2. File aset SVG/PNG siap cetak"
              value={deliverablesStr}
              onChange={(e) => setDeliverablesStr(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Stipend Mahasiswa (IDR)</label>
              <input
                type="number"
                min={300000}
                step={50000}
                required
                value={stipend}
                onChange={(e) => setStipend(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Durasi (Minggu)</label>
              <select
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value={1}>1 Minggu (Sprint Cepat)</option>
                <option value={2}>2 Minggu (Standar)</option>
                <option value={3}>3 Minggu</option>
                <option value={4}>4 Minggu (Maksimal)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Tags / Keahlian Dibutuhkan (Pisahkan koma)</label>
            <input
              type="text"
              placeholder="Figma, UI Design, Mobile UX"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publikasikan Tugas ke Hub</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
