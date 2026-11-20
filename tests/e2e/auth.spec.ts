import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { ClaimsPage, AdminDashboardPage } from './pages/claims.page';
import { ADMIN, CLAIMANT } from './fixtures/test-users';

test.describe('Authentication', () => {
  test('claimant can log in and land on My Claims', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(CLAIMANT.email, CLAIMANT.password);

    const claims = new ClaimsPage(page);
    await claims.expectLoaded();
    await expect(page).toHaveURL(/\/claims/);
  });

  test('admin can log in and land on admin area', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(ADMIN.email, ADMIN.password);

    const admin = new AdminDashboardPage(page);
    await admin.expectLoaded();
  });

  test('rejects invalid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(CLAIMANT.email, 'WrongPassword!');
    await login.expectInvalidCredentials();
    await expect(page).toHaveURL(/\/login/);
  });
});
