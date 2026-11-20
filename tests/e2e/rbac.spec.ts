import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { ClaimsPage } from './pages/claims.page';
import { CLAIMANT } from './fixtures/test-users';

test.describe('RBAC', () => {
  test('claimant is blocked from admin dashboard APIs (sees claims home, not admin data)', async ({
    page,
  }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(CLAIMANT.email, CLAIMANT.password);

    const claims = new ClaimsPage(page);
    await claims.expectLoaded();

    // Middleware only checks cookie — navigation may succeed; API must not.
    const adminStats = page.waitForResponse(
      (res) => res.url().includes('/api/admin/') && res.request().method() === 'GET'
    );
    await page.goto('/admin/dashboard');
    const response = await adminStats.catch(() => null);

    if (response) {
      expect(
        [401, 403].includes(response.status()),
        `expected admin API denial, got ${response.status()}`
      ).toBeTruthy();
    } else {
      // If the page never called admin APIs, claimant should still not see admin chrome.
      await expect(page.getByRole('heading', { name: /dashboard|admin/i })).toHaveCount(0);
    }
  });
});
