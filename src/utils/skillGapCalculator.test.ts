import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateReadiness, filterMicroInternships } from './skillGapCalculator.ts';

test('calculateReadiness: correctly scores user skills vs target industry skills', () => {
  const targetSkills = [
    { name: 'Python', importance: 'critical' as const, category: 'tech' },
    { name: 'SQL', importance: 'critical' as const, category: 'tech' },
    { name: 'Tableau', importance: 'recommended' as const, category: 'tool' },
    { name: 'Git', importance: 'bonus' as const, category: 'tool' },
  ];

  // User has Python and SQL (both critical = 3 + 3 = 6 weight out of total 3+3+2+1 = 9 => 67%)
  const userSkills = ['Python', 'SQL'];
  const result = calculateReadiness(userSkills, targetSkills, 10);

  assert.equal(result.matchScore, 67);
  assert.equal(result.readinessTier, 'Siap Micro-Internship');
  assert.equal(result.campusAcquiredCount, 2);
  assert.equal(result.industryGapCount, 2);
  assert.ok(result.missingToolSkills.includes('Tableau'));
  assert.ok(result.missingToolSkills.includes('Git'));
  assert.equal(result.estimatedWeeks, 3); // 2 skills * 15h = 30h / 10h/week = 3 weeks
});

test('calculateReadiness: handles empty skills with Tahap Eksplorasi', () => {
  const targetSkills = [
    { name: 'React', importance: 'critical' as const, category: 'tech' },
  ];
  const result = calculateReadiness([], targetSkills, 10);

  assert.equal(result.matchScore, 0);
  assert.equal(result.readinessTier, 'Tahap Eksplorasi');
  assert.equal(result.missingCriticalSkills[0], 'React');
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
