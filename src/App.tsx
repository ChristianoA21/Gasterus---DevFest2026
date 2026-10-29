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
  ApplicationSubmission 
} from './types';
import { 
  INITIAL_USER_PROFILE, 
  INITIAL_MICRO_INTERNSHIPS,
  INITIAL_ANALYSIS_RESULT 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { SkillGapAnalyzer } from './components/SkillGapAnalyzer';
import { RoadmapView } from './components/RoadmapView';
import { MicroInternshipHub } from './components/MicroInternshipHub';
import { StudentWorkspace } from './components/StudentWorkspace';
import { AiCareerMentor } from './components/AiCareerMentor';
import { ApplyProjectModal } from './components/ApplyProjectModal';
import { PostProjectModal } from './components/PostProjectModal';
import { CertificateModal } from './components/CertificateModal';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('analyzer');
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

  // Seed with 1 completed micro-internship for rich initial showcase
  const [applications, setApplications] = useState<ApplicationSubmission[]>(() => {
    const saved = localStorage.getItem('gasterus_applications');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'app-seed-01',
        projectId: 'gasterus-proj-01',
        projectTitle: 'Dashboard Analisis Penjualan & Perilaku Pelanggan',
        company: 'Kopi Kenangan Senja (UMKM)',
        stipend: 1200000,
        status: 'completed',
        pitch: 'Halo tim Kopi Kenangan Senja, saya menguasai SQL dan Looker Studio untuk merapikan dataset penjualan kedai.',
        portfolioLink: 'https://github.com/bintangpratama/pos-sales-analytics',
        submissionDeliverableUrl: 'https://lookerstudio.google.com/reporting/demo-sales-pos',
        submissionNotes: 'Dashboard 3 halaman telah selesai: Analisis Menu Terlaris, Peak Hours, dan Rekomendasi Bundling Promo.',
        appliedAt: '12 Oktober 2026',
        completedAt: '24 Oktober 2026',
        rating: 5,
        clientReview: 'Dashboard yang dibuat Bintang sangat mudah dipahami oleh barista dan manajer kami. Omzet kami naik 18% setelah menerapkan bundling menu!',
        certificateId: 'GAS-2026-KP089',
      },
    ];
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
      status: 'in_progress',
      pitch: appData.pitch,
      portfolioLink: appData.portfolioLink,
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
    (a) => a.status === 'applied' || a.status === 'in_progress'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        activeApplicationsCount={activeAppsCount}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
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

        {/* Tab 3: Micro-Internship Marketplace */}
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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-200">Gasterus</span>
            <span>•</span>
            <span>DevFest 2026 Competition Entry</span>
            <span>•</span>
            <span className="text-indigo-400">Powered by Google Gemini 3.8 Flash SDK</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Solusi 3 Masalah Mahasiswa: Krisis PD • Action Plan • Paradoks Portofolio</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
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
