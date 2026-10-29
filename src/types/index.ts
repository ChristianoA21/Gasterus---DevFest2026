export type UserRole = 'mahasiswa' | 'umkm' | 'admin';

export type NavigationTab = 
  | 'analyzer' 
  | 'roadmap' 
  | 'internships' 
  | 'workspace' 
  | 'mentor'
  | 'umkm-dashboard'
  | 'umkm-projects'
  | 'umkm-candidates'
  | 'admin-dashboard'
  | 'admin-moderation'
  | 'admin-certificates'
  | 'admin-logs';

export interface UserAccount {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  avatarUrl: string;
  organizationOrCampus: string;
  roleTitle: string;
  companyType?: 'UMKM' | 'Startup' | 'Agency';
  verifiedStatus?: boolean;
}

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

export interface RoadmapPhase {
  phase: string;
  focus: string;
  skillsToLearn: string[];
  recommendedMicroInternship: string;
  // Optional enriched properties for backward compatibility
  id?: string;
  title?: string;
  description?: string;
  targetSkills?: string[];
  estimatedWeeks?: number;
  miniProjectPrompt?: string;
  recommendedResources?: {
    title: string;
    type: 'course' | 'doc' | 'youtube' | 'project';
    url: string;
    isFree: boolean;
  }[];
}

export interface SkillGapAnalysisResult {
  university: string;
  targetRole: string;
  matchPercentage: number;
  matchScore: number; // Synchronized alias for matchPercentage
  curriculumAnalysis: string;
  missingSkills: string[];
  campusTier?: 'unggul' | 'berkembang';
  summary?: string;
  academicStrongPoints?: string[];
  criticalGaps?: string[];
  industryInsights?: string;
  readinessTier?: 'Siap Kerja Mandiri' | 'Siap Micro-Internship' | 'Butuh Fondasi Portofolio' | 'Tahap Eksplorasi';
  roadmap: RoadmapPhase[];
  suggestedMicroInternshipTags?: string[];
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
  createdBy?: string;
  status?: 'active' | 'in_progress' | 'completed' | 'closed';
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
  // Candidate profile info when reviewed by UMKM or Admin
  applicantName?: string;
  applicantUniversity?: string;
  applicantMajor?: string;
  applicantSemester?: number;
  applicantMatchScore?: number;
  applicantEmail?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: () => void }[];
}

// Admin & Moderation types
export interface CampusModerationItem {
  id: string;
  name: string;
  city: string;
  province: string;
  tier: 'unggul' | 'berkembang';
  accreditation: 'Unggul' | 'A' | 'Baik Sekali' | 'B';
  studentCount: number;
  avgCurriculumGap: number;
  topRequestedRole: string;
  status: 'verified' | 'audit_pending' | 'flagged';
  lastUpdated: string;
}

export interface UmkmVerificationItem {
  id: string;
  companyName: string;
  ownerName: string;
  businessType: 'Kuliner & F&B' | 'Fashion & Kriya' | 'Agrikultur' | 'EduTech & Software' | 'Jasa Kreatif';
  nibNumber: string;
  location: string;
  stipendBalance: number;
  verified: boolean;
  activeProjects: number;
  completedProjects: number;
  rating: number;
  joinedDate: string;
}

export interface CertificateAuditRecord {
  id: string;
  certificateId: string;
  studentName: string;
  university: string;
  companyName: string;
  projectTitle: string;
  issuedDate: string;
  rating: number;
  credentialHash: string;
  status: 'valid' | 'revoked';
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  target: string;
  category: 'AI Analyzer' | 'Micro-Internship' | 'Sertifikat' | 'Autentikasi' | 'Moderasi';
  severity: 'info' | 'success' | 'warning' | 'alert';
}
