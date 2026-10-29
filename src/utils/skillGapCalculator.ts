/**
 * Skill Gap & Readiness Calculation Logic for Gasterus
 */

export interface SkillItem {
  id: string;
  name: string;
  category: 'academic' | 'industry_tool' | 'soft_skill' | 'best_practice';
  importance: 'critical' | 'recommended' | 'bonus';
  learnedInCampus: boolean;
  industryDemandRate: number; // 1 - 100
}

export interface ReadinessEvaluation {
  matchScore: number; // 0 - 100
  readinessTier: 'Siap Kerja Mandiri' | 'Siap Micro-Internship' | 'Butuh Fondasi Portofolio' | 'Tahap Eksplorasi';
  readinessColor: string;
  campusAcquiredCount: number;
  industryGapCount: number;
  missingCriticalSkills: string[];
  missingToolSkills: string[];
  estimatedWeeks: number;
}

export function calculateReadiness(
  userSkills: string[],
  industryTargetSkills: { name: string; importance: 'critical' | 'recommended' | 'bonus'; category: string }[],
  studyHoursPerWeek: number = 10
): ReadinessEvaluation {
  if (!industryTargetSkills || industryTargetSkills.length === 0) {
    return {
      matchScore: 0,
      readinessTier: 'Tahap Eksplorasi',
      readinessColor: 'text-amber-400',
      campusAcquiredCount: 0,
      industryGapCount: 0,
      missingCriticalSkills: [],
      missingToolSkills: [],
      estimatedWeeks: 12,
    };
  }

  const normalizedUserSkills = new Set(
    userSkills.map((s) => s.trim().toLowerCase())
  );

  let totalWeight = 0;
  let earnedWeight = 0;
  const missingCritical: string[] = [];
  const missingTools: string[] = [];
  let acquiredCount = 0;

  for (const skill of industryTargetSkills) {
    const weight = skill.importance === 'critical' ? 3 : skill.importance === 'recommended' ? 2 : 1;
    totalWeight += weight;

    const hasSkill = Array.from(normalizedUserSkills).some(
      (userSkill) =>
        userSkill === skill.name.toLowerCase() ||
        userSkill.includes(skill.name.toLowerCase()) ||
        skill.name.toLowerCase().includes(userSkill)
    );

    if (hasSkill) {
      earnedWeight += weight;
      acquiredCount++;
    } else {
      if (skill.importance === 'critical') {
        missingCritical.push(skill.name);
      } else {
        missingTools.push(skill.name);
      }
    }
  }

  const matchScore = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

  let readinessTier: ReadinessEvaluation['readinessTier'] = 'Tahap Eksplorasi';
  let readinessColor = 'text-amber-400';

  if (matchScore >= 80) {
    readinessTier = 'Siap Kerja Mandiri';
    readinessColor = 'text-emerald-400';
  } else if (matchScore >= 60) {
    readinessTier = 'Siap Micro-Internship';
    readinessColor = 'text-sky-400';
  } else if (matchScore >= 40) {
    readinessTier = 'Butuh Fondasi Portofolio';
    readinessColor = 'text-indigo-400';
  } else {
    readinessTier = 'Tahap Eksplorasi';
    readinessColor = 'text-amber-400';
  }

  const totalMissing = missingCritical.length + missingTools.length;
  // Assumption: each skill takes ~15 hours of focused project practice to bridge
  const totalHoursNeeded = totalMissing * 15;
  const safeStudyHours = Math.max(studyHoursPerWeek, 2);
  const estimatedWeeks = Math.max(1, Math.ceil(totalHoursNeeded / safeStudyHours));

  return {
    matchScore,
    readinessTier,
    readinessColor,
    campusAcquiredCount: acquiredCount,
    industryGapCount: totalMissing,
    missingCriticalSkills: missingCritical,
    missingToolSkills: missingTools,
    estimatedWeeks,
  };
}

export function filterMicroInternships<T extends { tags: string[]; category: string; stipend: number; durationWeeks: number }>(
  items: T[],
  filters: {
    search?: string;
    category?: string;
    maxDurationWeeks?: number;
    minStipend?: number;
  }
): T[] {
  return items.filter((item) => {
    if (filters.category && filters.category !== 'Semua' && item.category !== filters.category) {
      return false;
    }
    if (filters.maxDurationWeeks && item.durationWeeks > filters.maxDurationWeeks) {
      return false;
    }
    if (filters.minStipend && item.stipend < filters.minStipend) {
      return false;
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchTag && !matchCat) {
        return false;
      }
    }
    return true;
  });
}
