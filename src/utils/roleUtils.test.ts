import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  getAuthorizedTabs, 
  canSubmitApplication, 
  canReviewCandidates, 
  canPostMicroInternship, 
  canModerateCampuses 
} from './roleUtils.ts';

test('getAuthorizedTabs: returns correct tabs for mahasiswa', () => {
  const tabs = getAuthorizedTabs('mahasiswa');
  assert.deepEqual(tabs, ['analyzer', 'roadmap', 'internships', 'workspace', 'mentor']);
  assert.equal(tabs.includes('analyzer'), true);
  assert.equal(tabs.includes('admin-dashboard'), false);
});

test('getAuthorizedTabs: returns correct tabs for umkm', () => {
  const tabs = getAuthorizedTabs('umkm');
  assert.deepEqual(tabs, ['umkm-dashboard', 'umkm-projects', 'umkm-candidates']);
  assert.equal(tabs.includes('umkm-projects'), true);
  assert.equal(tabs.includes('roadmap'), false);
});

test('getAuthorizedTabs: returns correct tabs for admin', () => {
  const tabs = getAuthorizedTabs('admin');
  assert.deepEqual(tabs, ['admin-dashboard', 'admin-moderation', 'admin-certificates', 'admin-logs']);
  assert.equal(tabs.includes('admin-moderation'), true);
});

test('role permissions: enforces role boundaries accurately', () => {
  // Mahasiswa can submit, cannot review or moderate
  assert.equal(canSubmitApplication('mahasiswa'), true);
  assert.equal(canReviewCandidates('mahasiswa'), false);
  assert.equal(canModerateCampuses('mahasiswa'), false);

  // UMKM can review candidates and post, cannot moderate campus
  assert.equal(canSubmitApplication('umkm'), false);
  assert.equal(canReviewCandidates('umkm'), true);
  assert.equal(canPostMicroInternship('umkm'), true);
  assert.equal(canModerateCampuses('umkm'), false);

  // Admin can moderate campus and review
  assert.equal(canModerateCampuses('admin'), true);
  assert.equal(canReviewCandidates('admin'), true);
});
