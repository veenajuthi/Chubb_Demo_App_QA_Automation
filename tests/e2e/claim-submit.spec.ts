import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { ClaimsPage, NewClaimWizardPage } from './pages/claims.page';
import { CLAIMANT } from './fixtures/test-users';

test.describe('Claim submission', () => {
  test('claimant can submit a new claim through the wizard', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(CLAIMANT.email, CLAIMANT.password);

    const claims = new ClaimsPage(page);
    await claims.expectLoaded();
    await claims.startNewClaim();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().slice(0, 10);

    const wizard = new NewClaimWizardPage(page);
    await wizard.fillStep1({
      date: dateStr,
      location: '42 QA Avenue, Test City',
      amount: '1250.50',
    });
    await wizard.fillStep2(
      'Automated E2E claim: vehicle damaged in a parking-lot collision during daytime.'
    );
    await wizard.submitStep3();

    await expect(page.getByRole('heading', { name: 'My Claims' })).toBeVisible({
      timeout: 20_000,
    });
  });
});
