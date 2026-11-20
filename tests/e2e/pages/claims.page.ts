import { type Page, expect } from '@playwright/test';

export class ClaimsPage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(this.page.getByRole('heading', { name: 'My Claims' })).toBeVisible({
      timeout: 15_000,
    });
  }

  async startNewClaim() {
    // Prefer direct navigation — client router.push from the CTA is flaky under Playwright.
    await this.page.goto('/claims/new');
    await expect(this.page.getByRole('heading', { name: 'Submit New Claim' })).toBeVisible({
      timeout: 15_000,
    });
  }
}

export class NewClaimWizardPage {
  constructor(private readonly page: Page) {}

  async fillStep1(opts: { date: string; location: string; amount: string }) {
    await expect(this.page.getByTestId('wizard-step-1')).toBeVisible();
    const date = this.page.locator('#incidentDate');
    const location = this.page.locator('#incidentLocation');
    const amount = this.page.locator('#claimAmount');

    await date.click();
    await date.fill(opts.date);
    await date.press('Tab');
    await location.fill(opts.location);
    await location.press('Tab');
    await amount.fill(opts.amount);
    await amount.press('Tab');

    await this.page.getByTestId('wizard-step-1').evaluate((form) => {
      (form as HTMLFormElement).requestSubmit();
    });
    await expect(this.page.getByTestId('wizard-step-2')).toBeVisible({ timeout: 10_000 });
  }

  async fillStep2(description: string) {
    await expect(this.page.getByTestId('wizard-step-2')).toBeVisible();
    const desc = this.page.locator('#description');
    await desc.fill(description);
    await desc.press('Tab');
    await this.page.getByTestId('wizard-step-2').evaluate((form) => {
      (form as HTMLFormElement).requestSubmit();
    });
    await expect(this.page.getByTestId('wizard-step-3')).toBeVisible({ timeout: 10_000 });
  }

  async submitStep3() {
    await expect(this.page.getByTestId('wizard-step-3')).toBeVisible();
    await this.page.getByTestId('wizard-step-3').getByRole('button', { name: 'Submit Claim' }).click();
  }
}

export class AdminDashboardPage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/admin\//, { timeout: 15_000 });
  }
}
