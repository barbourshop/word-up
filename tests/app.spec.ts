import { test, expect } from '@playwright/test';

test('app loads and displays welcome message', async ({ page }) => {
  await page.goto('/');
  // Adjust the selector/text below to match your minimal App
  await expect(page.locator('h1, h2, h3')).toHaveText(/welcome|hello|react/i, { useInnerText: true });
}); 