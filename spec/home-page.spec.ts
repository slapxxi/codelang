import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('localhost:5173/');
  });

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Codelang | Home/);
  });
});
