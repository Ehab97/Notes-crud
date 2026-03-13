import { test, expect } from '@playwright/test';
import { signUp } from './helpers/auth';

const TEST_PASSWORD = 'password123';

test.describe('Notes CRUD', () => {
  test('user can create a new note from dashboard', async ({ page }) => {
    const email = `notes-create-${Date.now()}@example.com`;
    await signUp(page, email, TEST_PASSWORD);
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });

    await page.click('text=New Note');
    // Should navigate to new note page
    await expect(page).toHaveURL(/\/notes\/new/, { timeout: 5000 });
  });

  test('user can save a note with title and content', async ({ page }) => {
    const email = `notes-save-${Date.now()}@example.com`;
    await signUp(page, email, TEST_PASSWORD);
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });

    await page.click('text=New Note');
    await expect(page).toHaveURL(/\/notes\/new/, { timeout: 5000 });

    // Fill title and content
    await page.fill('input[placeholder="Note title"]', 'My Test Note');
    await page.click('.ProseMirror');
    await page.keyboard.type('This is my note content');

    await page.click('text=Save Note');
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
    await expect(page.getByText('My Test Note')).toBeVisible();
  });

  test('user can delete a note with confirmation', async ({ page }) => {
    const email = `notes-delete-${Date.now()}@example.com`;
    await signUp(page, email, TEST_PASSWORD);
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });

    // Create a note first
    await page.click('text=New Note');
    await page.fill('input[placeholder="Note title"]', 'Note To Delete');
    await page.click('text=Save Note');
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });

    // Navigate to note
    await page.click('text=Note To Delete');
    await expect(page).toHaveURL(/\/notes\//, { timeout: 5000 });

    // Delete the note - click the delete trigger button
    await page.getByRole('button', { name: 'Delete' }).click();
    // Wait for dialog to appear and click confirm button inside dialog
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 3000 });
    await dialog.getByRole('button', { name: 'Delete' }).click();
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
    await expect(page.getByText('Note To Delete')).not.toBeVisible();
  });

  test('empty dashboard shows helpful message', async ({ page }) => {
    const email = `notes-empty-${Date.now()}@example.com`;
    await signUp(page, email, TEST_PASSWORD);
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
    await expect(page.getByText(/No notes yet/i)).toBeVisible();
  });
});
