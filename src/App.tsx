/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  NavigationTab, 
  UserProfile, 
  SkillGapAnalysisResult, 
  MicroInternship, 
  ApplicationSubmission,
  UserRole
} from './types';
import { 
  INITIAL_USER_PROFILE, 
  INITIAL_MICRO_INTERNSHIPS,
  INITIAL_ANALYSIS_RESULT,
  INITIAL_UMKM_CANDIDATES,
  DEMO_ACCOUNTS
} from './data/mockData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { SkillGapAnalyzer } from './components/SkillGapAnalyzer';
import { RoadmapView } from './components/RoadmapView';
import { MicroInternshipHub } from './components/MicroInternshipHub';
import { StudentWorkspace } from './components/StudentWorkspace';
import { AiCareerMentor } from './components/AiCareerMentor';
import { UmkmDashboard } from './components/UmkmDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { ApplyProjectModal } from './components/ApplyProjectModal';
import { PostProjectModal } from './components/PostProjectModal';
import { CertificateModal } from './components/CertificateModal';
import { ProfileModal } from './components/ProfileModal';

function AppContent() {
  const { currentRole, currentAccount, isRoleSwitchModalOpen, setIsRoleSwitchModalOpen, switchRole } = useAuth();
  
  // Active navigation tab
  const [activeTab, setActiveTab] = useState<NavigationTab>(() => {
    if (currentRole === 'umkm') return 'umkm-dashboard';
    if (currentRole === 'admin') return 'admin-dashboard';
    return 'analyzer';
  });

  // Keep active tab valid when role changes
  useEffect(() => {
    if (currentRole === 'mahasiswa') {
      if (!['analyzer', 'roadmap', 'internships', 'workspace', 'mentor'].includes(activeTab)) {
        setActiveTab('analyzer');
      }
    } else if (currentRole === 'umkm') {
      if (!['umkm-dashboard', 'umkm-projects', 'umkm-candidates'].includes(activeTab)) {
        setActiveTab('umkm-dashboard');
      }
    } else if (currentRole === 'admin') {
      if (!['admin-dashboard', 'admin-moderation', 'admin-certificates', 'admin-logs'].includes(activeTab)) {
        setActiveTab('admin-dashboard');
      }
    }
  }, [currentRole]);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('gasterus_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [analysisResult, setAnalysisResult] = useState<SkillGapAnalysisResult | null>(() => {
    const saved = localStorage.getItem('gasterus_analysis_result');
    return saved ? JSON.parse(saved) : INITIAL_ANALYSIS_RESULT;
  });

  const [completedMilestones, setCompletedMilestones] = useState<string[]>(() => {
    const saved = localStorage.getItem('gasterus_completed_milestones');
    return saved ? JSON.parse(saved) : ['phase-1'];
  });

  const [projects, setProjects] = useState<MicroInternship[]>(() => {
    const saved = localStorage.getItem('gasterus_projects');
    return saved ? JSON.parse(saved) : INITIAL_MICRO_INTERNSHIPS;
  });

  // Seed with rich initial applications for student & UMKM review
  const [applications, setApplications] = useState<ApplicationSubmission[]>(() => {
    const saved = localStorage.getItem('gasterus_applications');
    if (saved) {
      try {
        const parsed: ApplicationSubmission[] = JSON.parse(saved);
        const hasRichCandidates = parsed.some((p) => p.id === 'cand-01');
        if (!hasRichCandidates) {
          return [...INITIAL_UMKM_CANDIDATES, ...parsed];
        }
        return parsed;
      } catch {
        return INITIAL_UMKM_CANDIDATES;
      }
    }
    return INITIAL_UMKM_CANDIDATES;
  });

  const [filterTagInHub, setFilterTagInHub] = useState<string>('');

  // Modals state
  const [applyModalProject, setApplyModalProject] = useState<MicroInternship | null>(null);
  const [isPostProjectModalOpen, setIsPostProjectModalOpen] = useState(false);
  const [certificateModalApp, setCertificateModalApp] = useState<ApplicationSubmission | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('gasterus_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (analysisResult) {
      localStorage.setItem('gasterus_analysis_result', JSON.stringify(analysisResult));
    }
  }, [analysisResult]);

  useEffect(() => {
    localStorage.setItem('gasterus_completed_milestones', JSON.stringify(completedMilestones));
  }, [completedMilestones]);

  useEffect(() => {
    localStorage.setItem('gasterus_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('gasterus_applications', JSON.stringify(applications));
  }, [applications]);

  // Handlers
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleToggleMilestone = (milestoneId: string) => {
    setCompletedMilestones((prev) =>
      prev.includes(milestoneId)
        ? prev.filter((id) => id !== milestoneId)
        : [...prev, milestoneId]
    );
  };

  const handleApplyToProject = (project: MicroInternship) => {
    setApplyModalProject(project);
  };

  const handleSubmitApplication = (appData: {
    projectId: string;
    projectTitle: string;
    company: string;
    stipend: number;
    pitch: string;
    portfolioLink: string;
  }) => {
    const newApp: ApplicationSubmission = {
      id: `app-${Date.now()}`,
      projectId: appData.projectId,
      projectTitle: appData.projectTitle,
      company: appData.company,
      stipend: appData.stipend,
      status: 'applied',
      pitch: appData.pitch,
      portfolioLink: appData.portfolioLink,
      applicantName: userProfile.name,
      applicantUniversity: userProfile.university,
      applicantMajor: userProfile.major,
      applicantSemester: userProfile.semester,
      applicantMatchScore: analysisResult?.matchPercentage || 68,
      appliedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    };

    setApplications((prev) => [newApp, ...prev]);

    // increment project applicant count
    setProjects((prev) =>
      prev.map((p) =>
        p.id === appData.projectId ? { ...p, applicantCount: p.applicantCount + 1 } : p
      )
    );
  };

  const handleAddProject = (newProject: MicroInternship) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleUpdateApplicationStatus = (
    appId: string,
    updates: Partial<ApplicationSubmission>
  ) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, ...updates } : app))
    );
  };

  const handleFilterMicroInternshipsByTag = (tag: string) => {
    setFilterTagInHub(tag);
    setActiveTab('internships');
  };

  const activeAppsCount = applications.filter(
    (a) => a.status === 'applied' || a.status === 'in_progress' || a.status === 'submitted'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar with Role Badge & Quick Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        activeApplicationsCount={activeAppsCount}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenRoleModal={() => setIsRoleSwitchModalOpen(true)}
      />

      {/* Role Indicator Notification Bar */}
      <div className={`py-1.5 px-4 text-xs font-medium border-b flex items-center justify-between transition-colors ${
        currentRole === 'mahasiswa'
          ? 'bg-indigo-950/40 border-indigo-500/20 text-indigo-300'
          : currentRole === 'umkm'
          ? 'bg-amber-950/40 border-amber-500/20 text-amber-300'
          : 'bg-purple-950/40 border-purple-500/20 text-purple-300'
      }`}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold">
              {currentRole === 'mahasiswa' && '🎓 Mode Mahasiswa: '}
              {currentRole === 'umkm' && '🏢 Mode Mitra UMKM: '}
              {currentRole === 'admin' && '🛡️ Mode Super Admin: '}
            </span>
            <span className="hidden sm:inline text-slate-300">
              {currentRole === 'mahasiswa' && 'Analisis gap kampus, roadmap mandiri, dan submit lamaran micro-internship.'}
              {currentRole === 'umkm' && `Kelola lowongan proyek & review proposal pelamar untuk ${currentAccount.organizationOrCampus}.`}
              {currentRole === 'admin' && 'Pusat moderasi kurikulum kampus, verifikasi NIB UMKM, dan audit sertifikat QR.'}
            </span>
          </div>

          <button
            onClick={() => setIsRoleSwitchModalOpen(true)}
            className="text-[11px] font-bold underline underline-offset-2 hover:opacity-80 shrink-0 ml-3"
          >
            Ganti Peran Demo
          </button>
        </div>
      </div>

      {/* Main Content Area based on Active Role */}
      <main className="flex-1 pb-16">
        {/* =========================================
            ROLE 1: MAHASISWA
           ========================================= */}
        {currentRole === 'mahasiswa' && (
          <>
            {/* Banner shown on initial arrival or tab switcher */}
            {activeTab === 'analyzer' && (
              <StatsBanner onQuickNavigate={(tab) => setActiveTab(tab)} />
            )}

            {/* Tab 1: AI Skill Gap Analyzer */}
            {activeTab === 'analyzer' && (
              <SkillGapAnalyzer
                userProfile={userProfile}
                onUpdateProfile={handleUpdateProfile}
                analysisResult={analysisResult}
                setAnalysisResult={setAnalysisResult}
                onNavigateTab={setActiveTab}
                onFilterMicroInternshipsByTag={handleFilterMicroInternshipsByTag}
              />
            )}

            {/* Tab 2: Roadmap Belajar Personal */}
            {activeTab === 'roadmap' && (
              <RoadmapView
                analysisResult={analysisResult}
                userProfile={userProfile}
                onNavigateTab={setActiveTab}
                onFilterMicroInternshipsByTag={handleFilterMicroInternshipsByTag}
                completedMilestones={completedMilestones}
                onToggleMilestone={handleToggleMilestone}
              />
            )}

            {/* Tab 3: Micro-Internship Marketplace (Mode Pelamar) */}
            {activeTab === 'internships' && (
              <MicroInternshipHub
                projects={projects}
                userProfile={userProfile}
                onApplyProject={handleApplyToProject}
                onOpenPostProjectModal={() => setIsPostProjectModalOpen(true)}
                initialTagFilter={filterTagInHub}
                onClearTagFilter={() => setFilterTagInHub('')}
              />
            )}

            {/* Tab 4: Student Workspace & Verified Credentials */}
            {activeTab === 'workspace' && (
              <StudentWorkspace
                applications={applications}
                userProfile={userProfile}
                onUpdateApplicationStatus={handleUpdateApplicationStatus}
                onNavigateTab={setActiveTab}
                onViewCertificate={(app) => setCertificateModalApp(app)}
              />
            )}

            {/* Tab 5: AI Career Mentor Chat */}
            {activeTab === 'mentor' && (
              <AiCareerMentor
                userProfile={userProfile}
                analysisResult={analysisResult}
                applications={applications}
              />
            )}
          </>
        )}

        {/* =========================================
            ROLE 2: UMKM / STARTUP
           ========================================= */}
        {currentRole === 'umkm' && (
          <UmkmDashboard
            currentAccount={currentAccount}
            projects={projects}
            applications={applications}
            onOpenPostProjectModal={() => setIsPostProjectModalOpen(true)}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
            onViewCertificate={(app) => setCertificateModalApp(app)}
          />
        )}

        {/* =========================================
            ROLE 3: ADMIN
           ========================================= */}
        {currentRole === 'admin' && (
          <AdminDashboard
            currentAccount={currentAccount}
            onViewCertificatePreview={(cert) => {
              const matchedApp = applications.find(a => a.certificateId === cert.certificateId);
              if (matchedApp) {
                setCertificateModalApp(matchedApp);
              } else {
                setCertificateModalApp({
                  id: cert.id,
                  projectId: 'proj-admin-preview',
                  projectTitle: cert.projectTitle,
                  company: cert.companyName,
                  stipend: 1500000,
                  status: 'completed',
                  pitch: 'Proyek micro-internship resmi yang telah diverifikasi oleh tim kurikulum Gasterus.',
                  portfolioLink: 'https://github.com/gasterus-verified',
                  appliedAt: cert.issuedDate,
                  completedAt: cert.issuedDate,
                  rating: cert.rating,
                  clientReview: 'Kinerja mahasiswa sangat baik dan hasil deliverables memenuhi standar industri.',
                  certificateId: cert.certificateId,
                  applicantName: cert.studentName,
                  applicantUniversity: cert.university,
                });
              }
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-200">Gasterus</span>
            <span>•</span>
            <span>DevFest 2026 Competition Entry</span>
            <span>•</span>
            <span className="text-indigo-400">Google Gemini 3.8 Flash SDK</span>
            <span>•</span>
            <span className="text-amber-400">Role-Based Access (Mahasiswa • UMKM • Admin)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Solusi 3 Masalah: Krisis PD • Action Plan • Paradoks Portofolio</span>
          </div>
        </div>
      </footer>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleSwitchModalOpen}
        onClose={() => setIsRoleSwitchModalOpen(false)}
        onSelectRole={(role) => {
          if (role === 'mahasiswa') setActiveTab('analyzer');
          else if (role === 'umkm') setActiveTab('umkm-dashboard');
          else setActiveTab('admin-dashboard');
        }}
      />

      {/* Existing Feature Modals */}
      <ApplyProjectModal
        project={applyModalProject}
        userProfile={userProfile}
        isOpen={Boolean(applyModalProject)}
        onClose={() => setApplyModalProject(null)}
        onSubmitApplication={handleSubmitApplication}
      />

      <PostProjectModal
        isOpen={isPostProjectModalOpen}
        onClose={() => setIsPostProjectModalOpen(false)}
        onAddProject={handleAddProject}
      />

      <CertificateModal
        application={certificateModalApp}
        userProfile={userProfile}
        isOpen={Boolean(certificateModalApp)}
        onClose={() => setCertificateModalApp(null)}
      />

      <ProfileModal
        userProfile={userProfile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSaveProfile={(updated) => setUserProfile(updated)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
