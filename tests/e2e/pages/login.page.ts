import { type Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/login');
    await expect(this.page.getByTestId('login-form')).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password', { exact: true }).fill(password);

    const loginResponse = this.page.waitForResponse(
      (res) => res.url().includes('/api/auth/login') && res.request().method() === 'POST'
    );
    await this.page.getByRole('button', { name: 'Log In' }).click();
    await loginResponse;
  }

  async expectInvalidCredentials() {
    // Prefer the form alert — Next.js also injects a generic alert region.
    await expect(this.page.getByTestId('login-form').locator('..').getByRole('alert').first())
      .toContainText(/invalid email or password/i);
  }
}
