import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  classifyCampusTier, 
  generateContextualGapAnalysis, 
  filterMicroInternships 
} from './skillGapCalculator.ts';

test('classifyCampusTier: accurately classifies top tier vs local campuses', () => {
  assert.equal(classifyCampusTier('ITB'), 'unggul');
  assert.equal(classifyCampusTier('Universitas Indonesia'), 'unggul');
  assert.equal(classifyCampusTier('UGM'), 'unggul');
  assert.equal(classifyCampusTier('BINUS University'), 'unggul');
  assert.equal(classifyCampusTier('Telkom University'), 'unggul');
  
  // Regional / local campus
  assert.equal(classifyCampusTier('Universitas Daerah Pelita Jaya'), 'berkembang');
  assert.equal(classifyCampusTier('STMIK Nusa Mandiri Klaten'), 'berkembang');
});

test('generateContextualGapAnalysis: gives higher match (60%-78%) for top tier campus', () => {
  const result = generateContextualGapAnalysis('ITB', 'Teknik Informatika', 'Data Analyst');
  assert.equal(result.university, 'ITB');
  assert.equal(result.targetRole, 'Data Analyst');
  assert.ok(result.matchPercentage >= 60 && result.matchPercentage <= 78, `Expected 60-78%, got ${result.matchPercentage}%`);
  assert.equal(result.matchScore, result.matchPercentage);
  assert.ok(result.curriculumAnalysis.includes('ITB'));
  assert.ok(result.curriculumAnalysis.includes('Teknik Informatika'));
  assert.ok(result.missingSkills.length >= 3);
  assert.ok(result.roadmap.length >= 3);
  assert.ok(result.roadmap[0].recommendedMicroInternship.length > 5);
});

test('generateContextualGapAnalysis: gives 35%-55% match for regional campus with missing modern tools', () => {
  const result = generateContextualGapAnalysis('Universitas Swasta Daerah', 'Sistem Informasi', 'Frontend Developer');
  assert.equal(result.university, 'Universitas Swasta Daerah');
  assert.ok(result.matchPercentage >= 35 && result.matchPercentage <= 55, `Expected 35-55%, got ${result.matchPercentage}%`);
  assert.ok(result.curriculumAnalysis.includes('Universitas Swasta Daerah'));
  assert.ok(result.curriculumAnalysis.includes('Sistem Informasi'));
  // Verify missing skills include modern frameworks/tools
  const missingStr = result.missingSkills.join(' ');
  assert.ok(missingStr.includes('React') || missingStr.includes('Git') || missingStr.includes('Tailwind') || missingStr.includes('Tooling'));
});

test('filterMicroInternships: filters accurately by category and stipend', () => {
  const dummyProjects = [
    { id: '1', category: 'Tech & AI', stipend: 1500000, durationWeeks: 2, tags: ['React', 'API'] },
    { id: '2', category: 'UI/UX Design', stipend: 800000, durationWeeks: 1, tags: ['Figma'] },
    { id: '3', category: 'Tech & AI', stipend: 500000, durationWeeks: 4, tags: ['Python', 'Data'] },
  ];

  const filtered = filterMicroInternships(dummyProjects, {
    category: 'Tech & AI',
    minStipend: 1000000,
  });

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, '1');
});
