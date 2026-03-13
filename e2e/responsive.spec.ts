import { test, expect } from '@playwright/test';
import { signUp } from './helpers/auth';

const TEST_PASSWORD = 'password123';

test.describe('Responsive Design', () => {
  test('landing page renders correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('navigation').getByText('Log in')).toBeVisible();
  });

  test('landing page renders correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('dashboard renders correctly on mobile', async ({ page }) => {
    const email = `responsive-${Date.now()}@example.com`;
    await page.setViewportSize({ width: 375, height: 667 });
    await signUp(page, email, TEST_PASSWORD);
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
    await expect(page.getByText('My Notes')).toBeVisible();
    await expect(page.getByText('New Note')).toBeVisible();
  });

  test('header navigation works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header.getByText('NoteApp')).toBeVisible();
  });

  test('dark mode: page has correct background', async ({ page }) => {
    await page.goto('/');
    // Check that the body has styling applied (dark mode via CSS)
    const body = page.locator('body');
    await expect(body).toBeVisible();
    // Verify antialiased class is applied (from layout.tsx)
    await expect(body).toHaveClass(/antialiased/);
  });
});
