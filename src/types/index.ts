export type NavigationTab = 'analyzer' | 'roadmap' | 'internships' | 'workspace' | 'mentor';

export interface UserProfile {
  name: string;
  university: string;
  major: string;
  semester: number;
  dreamJob: string;
  skills: string[];
  bio?: string;
  avatarUrl?: string;
}

export interface IndustrySkillTarget {
  name: string;
  category: 'core_tech' | 'tools' | 'workflow' | 'soft_skill';
  importance: 'critical' | 'recommended' | 'bonus';
  description: string;
  whyCampusLacks: string;
}

export interface RoadmapMilestone {
  id: string;
  phase: number;
  title: string;
  description: string;
  targetSkills: string[];
  estimatedWeeks: number;
  recommendedResources: {
    title: string;
    type: 'course' | 'doc' | 'youtube' | 'project';
    url: string;
    isFree: boolean;
  }[];
  miniProjectPrompt: string;
  isCompleted?: boolean;
}

export interface SkillGapAnalysisResult {
  matchScore: number;
  summary: string;
  academicStrongPoints: string[];
  criticalGaps: string[];
  industryInsights: string;
  readinessTier: 'Siap Kerja Mandiri' | 'Siap Micro-Internship' | 'Butuh Fondasi Portofolio' | 'Tahap Eksplorasi';
  roadmap: RoadmapMilestone[];
  suggestedMicroInternshipTags: string[];
}

export interface MicroInternship {
  id: string;
  title: string;
  company: string;
  companyType: 'UMKM' | 'Startup' | 'Agency';
  location: string;
  category: 'Tech & AI' | 'UI/UX Design' | 'Data & Analytics' | 'Digital Marketing' | 'Content Writing';
  description: string;
  deliverables: string[];
  stipend: number; // in IDR
  durationWeeks: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  applicantCount: number;
  postedDate: string;
  deadline: string;
  verifiedPartner: boolean;
}

export interface ApplicationSubmission {
  id: string;
  projectId: string;
  projectTitle: string;
  company: string;
  stipend: number;
  status: 'applied' | 'in_progress' | 'submitted' | 'completed';
  pitch: string;
  portfolioLink: string;
  submissionDeliverableUrl?: string;
  submissionNotes?: string;
  appliedAt: string;
  completedAt?: string;
  rating?: number;
  clientReview?: string;
  certificateId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: () => void }[];
}
