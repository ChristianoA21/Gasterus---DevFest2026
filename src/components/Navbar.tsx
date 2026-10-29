import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Briefcase, 
  FolderKanban, 
  Bot, 
  User, 
  Menu, 
  X, 
  Award,
  ChevronRight
} from 'lucide-react';
import { NavigationTab, UserProfile } from '../types';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  userProfile: UserProfile;
  activeApplicationsCount: number;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  activeApplicationsCount,
  onOpenProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'analyzer',
      label: 'AI Skill Gap',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'roadmap',
      label: 'Roadmap Belajar',
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: 'internships',
      label: 'Micro-Internship Hub',
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: 'workspace',
      label: 'Workspace & Portofolio',
      icon: <FolderKanban className="w-4 h-4" />,
      badge: activeApplicationsCount > 0 ? activeApplicationsCount : undefined,
    },
    {
      id: 'mentor',
      label: 'AI Career Mentor',
      icon: <Bot className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('analyzer')}
              className="flex items-center gap-2.5 text-left group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-indigo-400 via-sky-300 to-amber-300 text-lg">
                    G
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                    Gasterus
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    DevFest 2026
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Bridging Academic Gap to Industry Impact
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile Quick Trigger */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/70 transition-all text-left"
              title="Klik untuk mengubah profil mahasiswa"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-amber-500 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-xs font-bold text-amber-300">
                  {userProfile.name.charAt(0)}
                </div>
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                  {userProfile.name}
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {userProfile.major}
                </div>
              </div>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800 mt-2">
            <button
              onClick={() => {
                onOpenProfile();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-900 text-xs text-slate-300 hover:bg-slate-800"
            >
              <User className="w-4 h-4 text-indigo-400" />
              <span>Profil: {userProfile.name} ({userProfile.major})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
