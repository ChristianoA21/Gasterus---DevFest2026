import { SkillGapAnalysisResult } from '../types';

/**
 * Client service to call the server-side Gemini API or contextual engine
 */
export async function generateSkillRoadmap(
  namaKampus: string,
  jurusan: string,
  targetRole: string
): Promise<SkillGapAnalysisResult> {
  const response = await fetch('/api/gemini/analyze-gap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      namaKampus: namaKampus.trim(),
      university: namaKampus.trim(),
      jurusan: jurusan.trim(),
      major: jurusan.trim(),
      targetRole: targetRole.trim(),
      dreamJob: targetRole.trim(),
    }),
  });

  const result = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Gagal memproses analisis skill gap');
  }

  return result.data;
}
