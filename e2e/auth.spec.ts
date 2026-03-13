import { test, expect } from '@playwright/test';
import { signUp, login } from './helpers/auth';

const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'password123';

test.describe('Authentication', () => {
  test('user can sign up and is redirected to dashboard', async ({ page }) => {
    await signUp(page, TEST_EMAIL, TEST_PASSWORD);
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('user can log in after signing up', async ({ page }) => {
    const email = `login-${Date.now()}@example.com`;
    await signUp(page, email, TEST_PASSWORD);
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });

    // Sign out
    await page.click('text=Sign out');
    await expect(page).toHaveURL('/');

    // Log back in
    await login(page, email, TEST_PASSWORD);
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('invalid credentials show error message', async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'nonexistent@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.getByRole('paragraph')).toBeVisible({ timeout: 5000 });
    // Should stay on auth page
    await expect(page).toHaveURL('/auth');
  });

  test('unauthenticated user is redirected from dashboard to auth', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/auth');
  });

  test('logout clears session', async ({ page }) => {
    const email = `logout-${Date.now()}@example.com`;
    await signUp(page, email, TEST_PASSWORD);
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });

    await page.click('text=Sign out');
    await expect(page).toHaveURL('/');

    // Verify session is gone by trying to access dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/auth');
  });
});
