import React, { useState } from 'react';
import { X, User, Check, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { POPULAR_MAJORS, POPULAR_DREAM_JOBS, MAJOR_DEFAULT_SKILLS } from '../data/mockData';

interface ProfileModalProps {
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  userProfile,
  isOpen,
  onClose,
  onSaveProfile,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(userProfile.name);
  const [university, setUniversity] = useState(userProfile.university);
  const [major, setMajor] = useState(userProfile.major);
  const [semester, setSemester] = useState(userProfile.semester);
  const [dreamJob, setDreamJob] = useState(userProfile.dreamJob);

  // Quick Persona Presets
  const presets = [
    {
      name: 'Bintang Pratama',
      university: 'Universitas Indonesia',
      major: 'Sistem Informasi',
      semester: 6,
      dreamJob: 'Data Analyst & BI Specialist',
      skills: ['SQL', 'Python Dasar', 'Database Relasional', 'Microsoft Excel', 'UML Diagram'],
    },
    {
      name: 'Aulia Rahma',
      university: 'Institut Teknologi Bandung',
      major: 'Teknik Informatika / Ilmu Komputer',
      semester: 7,
      dreamJob: 'Frontend Developer (React/Next.js)',
      skills: ['Struktur Data & Algoritma', 'OOP Java/C++', 'Dasar Jaringan', 'Sistem Operasi', 'Git Dasar'],
    },
    {
      name: 'Dimas Prasetyo',
      university: 'Universitas Telkom',
      major: 'Desain Komunikasi Visual (DKV)',
      semester: 5,
      dreamJob: 'UI/UX & Product Designer',
      skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Teori Warna', 'Tipografi Dasar', 'Branding Design'],
    },
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setName(preset.name);
    setUniversity(preset.university);
    setMajor(preset.major);
    setSemester(preset.semester);
    setDreamJob(preset.dreamJob);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = MAJOR_DEFAULT_SKILLS[major] || userProfile.skills;

    onSaveProfile({
      ...userProfile,
      name,
      university,
      major,
      semester,
      dreamJob,
      skills,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Profil Mahasiswa</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Persona Presets */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Pilih Cepat Persona Mahasiswa (Untuk Demo DevFest):</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className={`p-2 rounded-xl text-left border transition-all text-xs ${
                    name === p.name
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="truncate font-semibold">{p.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{p.major}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Nama Lengkap</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Universitas</label>
              <input
                type="text"
                required
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Jurusan</label>
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {POPULAR_MAJORS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Pekerjaan Impian</label>
            <select
              value={dreamJob}
              onChange={(e) => setDreamJob(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {POPULAR_DREAM_JOBS.map((job) => (
                <option key={job} value={job}>
                  {job}
                </option>
              ))}
            </select>
          </div>

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
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20"
            >
              Simpan Profil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
