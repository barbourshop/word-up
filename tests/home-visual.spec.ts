import { test, expect } from '@playwright/test';

test.describe('Home Page Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Prevent the instructions overlay from appearing
    await page.addInitScript(() => {
      window.localStorage.setItem('wordleHasVisited', 'true');
    });
    await page.goto('/');
  });

  test('should look correct', async ({ page }) => {
    // Wait for the main game board to be visible
    await page.waitForSelector('[data-testid="main-board"]', { timeout: 10000 });
    // Take a screenshot and compare
    expect(await page.screenshot()).toMatchSnapshot('home-page.png');
  });
}); 