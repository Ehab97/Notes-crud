import { test, expect } from '@playwright/test';
import { signUp } from './helpers/auth';

const TEST_PASSWORD = 'password123';

test.describe('Note Sharing', () => {
  test('user can enable public sharing and see public URL', async ({ page }) => {
    const email = `share-${Date.now()}@example.com`;
    await signUp(page, email, TEST_PASSWORD);
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });

    // Create a note
    await page.click('text=New Note');
    await page.fill('input[placeholder="Note title"]', 'Public Note');
    await page.click('.ProseMirror');
    await page.keyboard.type('Public content');
    await page.click('text=Save Note');
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });

    // Navigate to note view
    await page.click('text=Public Note');
    await expect(page).toHaveURL(/\/notes\//, { timeout: 5000 });

    // Enable sharing
    await page.click('text=Share publicly');
    await expect(page.getByText('Copy')).toBeVisible({ timeout: 5000 });
  });

  test('anonymous user can access public note', async ({ page }) => {
    const email = `share-anon-${Date.now()}@example.com`;
    await signUp(page, email, TEST_PASSWORD);
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });

    // Create and share a note
    await page.click('text=New Note');
    await page.fill('input[placeholder="Note title"]', 'Shared Note');
    await page.click('.ProseMirror');
    await page.keyboard.type('Shared content');
    await page.click('text=Save Note');
    await page.click('text=Shared Note');

    // Enable sharing
    await page.click('text=Share publicly');
    await expect(page.getByText('Copy')).toBeVisible({ timeout: 5000 });

    // Get the public URL from input
    const urlInput = page.locator('input[readonly]');
    const publicUrl = await urlInput.inputValue();
    expect(publicUrl).toContain('/p/');

    // Open in new context (anonymous user)
    const newPage = await page.context().newPage();
    // Clear cookies to simulate anonymous
    await newPage.context().clearCookies();
    await newPage.goto(publicUrl);
    await expect(newPage.getByText('Shared Note')).toBeVisible({ timeout: 5000 });
    await newPage.close();
  });

  test('returns 404 for invalid public slug', async ({ page }) => {
    await page.goto('/p/invalid-slug-that-does-not-exist');
    // Should show 404 page
    await expect(page.getByText(/404|not found/i)).toBeVisible({ timeout: 5000 });
  });
});
