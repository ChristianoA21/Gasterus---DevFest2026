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
  ChevronRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  Users,
  Activity,
  BarChart3,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { NavigationTab, UserProfile, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  userProfile: UserProfile;
  activeApplicationsCount: number;
  onOpenProfile: () => void;
  onOpenRoleModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  activeApplicationsCount,
  onOpenProfile,
  onOpenRoleModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentRole, currentAccount, switchRole } = useAuth();

  // Navigation Items defined per Role
  const getNavItems = () => {
    if (currentRole === 'umkm') {
      return [
        {
          id: 'umkm-dashboard' as NavigationTab,
          label: 'Ringkasan UMKM',
          icon: <Building2 className="w-4 h-4" />,
        },
        {
          id: 'umkm-projects' as NavigationTab,
          label: 'Kelola Lowongan',
          icon: <Briefcase className="w-4 h-4" />,
        },
        {
          id: 'umkm-candidates' as NavigationTab,
          label: 'Review Pelamar',
          icon: <Users className="w-4 h-4" />,
          badge: 5,
        },
      ];
    }

    if (currentRole === 'admin') {
      return [
        {
          id: 'admin-dashboard' as NavigationTab,
          label: 'Overview Metrik',
          icon: <BarChart3 className="w-4 h-4" />,
        },
        {
          id: 'admin-moderation' as NavigationTab,
          label: 'Moderasi Kampus & UMKM',
          icon: <ShieldCheck className="w-4 h-4" />,
        },
        {
          id: 'admin-certificates' as NavigationTab,
          label: 'Audit Sertifikat',
          icon: <Award className="w-4 h-4" />,
        },
        {
          id: 'admin-logs' as NavigationTab,
          label: 'Log Aktivitas',
          icon: <Activity className="w-4 h-4" />,
        },
      ];
    }

    // Default: Role Mahasiswa
    return [
      {
        id: 'analyzer' as NavigationTab,
        label: 'AI Skill Gap',
        icon: <Sparkles className="w-4 h-4" />,
      },
      {
        id: 'roadmap' as NavigationTab,
        label: 'Roadmap Belajar',
        icon: <MapPin className="w-4 h-4" />,
      },
      {
        id: 'internships' as NavigationTab,
        label: 'Micro-Internship Hub',
        icon: <Briefcase className="w-4 h-4" />,
      },
      {
        id: 'workspace' as NavigationTab,
        label: 'Workspace Saya',
        icon: <FolderKanban className="w-4 h-4" />,
        badge: activeApplicationsCount > 0 ? activeApplicationsCount : undefined,
      },
      {
        id: 'mentor' as NavigationTab,
        label: 'AI Career Mentor',
        icon: <Bot className="w-4 h-4" />,
      },
    ];
  };

  const navItems = getNavItems();

  const handleRoleQuickSwitch = (role: UserRole) => {
    switchRole(role);
    if (role === 'mahasiswa') {
      setActiveTab('analyzer');
    } else if (role === 'umkm') {
      setActiveTab('umkm-dashboard');
    } else if (role === 'admin') {
      setActiveTab('admin-dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (currentRole === 'mahasiswa') setActiveTab('analyzer');
                else if (currentRole === 'umkm') setActiveTab('umkm-dashboard');
                else setActiveTab('admin-dashboard');
              }}
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
                <p className="text-[11px] text-slate-400 hidden xl:block">
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
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? currentRole === 'umkm'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                        : currentRole === 'admin'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/10'
                        : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <span className={isActive ? (currentRole === 'umkm' ? 'text-amber-400' : currentRole === 'admin' ? 'text-purple-400' : 'text-indigo-400') : 'text-slate-400'}>
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

          {/* Role Switcher Pill Bar & User Avatar */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick 1-Click Role Switcher Pills */}
            <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-xl shadow-inner">
              <button
                type="button"
                onClick={() => handleRoleQuickSwitch('mahasiswa')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  currentRole === 'mahasiswa'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title="Beralih ke peran Mahasiswa"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Mahasiswa</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSwitch('umkm')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  currentRole === 'umkm'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title="Beralih ke peran Mitra UMKM"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>UMKM</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSwitch('admin')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  currentRole === 'admin'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title="Beralih ke peran Admin Platform"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Profile Trigger */}
            <button
              onClick={onOpenRoleModal}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/70 transition-all text-left"
              title="Klik untuk memilih profil demo atau melihat detail peran"
            >
              <img
                src={currentAccount.avatarUrl}
                alt={currentAccount.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
              />
              <div className="text-left leading-tight">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                  <span className="truncate max-w-[100px]">{currentAccount.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[100px]">
                  {currentRole === 'mahasiswa' ? 'Mahasiswa' : currentRole === 'umkm' ? 'Mitra UMKM' : 'Super Admin'}
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
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-4 space-y-3">
          {/* Mobile Role Switcher */}
          <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
              Peran Aktif:
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => {
                  handleRoleQuickSwitch('mahasiswa');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center ${
                  currentRole === 'mahasiswa' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-950'
                }`}
              >
                🎓 Mahasiswa
              </button>
              <button
                onClick={() => {
                  handleRoleQuickSwitch('umkm');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center ${
                  currentRole === 'umkm' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 bg-slate-950'
                }`}
              >
                🏢 UMKM
              </button>
              <button
                onClick={() => {
                  handleRoleQuickSwitch('admin');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center ${
                  currentRole === 'admin' ? 'bg-purple-600 text-white' : 'text-slate-400 bg-slate-950'
                }`}
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          <div className="space-y-1">
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
                      ? currentRole === 'umkm'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : currentRole === 'admin'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
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
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                onOpenRoleModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 text-xs text-slate-300 hover:bg-slate-800"
            >
              <div className="flex items-center gap-2">
                <img
                  src={currentAccount.avatarUrl}
                  alt={currentAccount.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>{currentAccount.name} ({currentAccount.roleTitle})</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
