import { UserRole, NavigationTab } from '../types';

export function getAuthorizedTabs(role: UserRole): NavigationTab[] {
  switch (role) {
    case 'mahasiswa':
      return ['analyzer', 'roadmap', 'internships', 'workspace', 'mentor'];
    case 'umkm':
      return ['umkm-dashboard', 'umkm-projects', 'umkm-candidates'];
    case 'admin':
      return ['admin-dashboard', 'admin-moderation', 'admin-certificates', 'admin-logs'];
    default:
      return ['analyzer'];
  }
}

export function canSubmitApplication(role: UserRole): boolean {
  return role === 'mahasiswa';
}

export function canReviewCandidates(role: UserRole): boolean {
  return role === 'umkm' || role === 'admin';
}

export function canPostMicroInternship(role: UserRole): boolean {
  return role === 'umkm' || role === 'admin';
}

export function canModerateCampuses(role: UserRole): boolean {
  return role === 'admin';
}

export function getRoleBadgeLabel(role: UserRole): string {
  switch (role) {
    case 'mahasiswa':
      return 'Mahasiswa (Talenta & Pelamar)';
    case 'umkm':
      return 'Mitra UMKM / Startup (Pemberi Kerja)';
    case 'admin':
      return 'Super Administrator (Pengawas Platform)';
  }
}
