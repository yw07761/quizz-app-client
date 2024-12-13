import { test, expect } from '@playwright/test';

test.describe('Login Component Tests', () => {
  test('should show error for missing email or password', async ({ page }) => {
    await page.goto('http://localhost:4200/login');
    await page.click('button[type="submit"]');
    await expect(page.locator('input#email')).toHaveClass(/ng-invalid/);
    await expect(page.locator('input#password')).toHaveClass(/ng-invalid/);
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.goto('http://localhost:4200/login');
    await page.fill('input#email', 'invalidemail');
    await page.fill('input#password', 'Password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('input#email')).toHaveClass(/ng-invalid/);
  });

  test('should navigate to dashboard on successful login', async ({ page }) => {
    await page.goto('http://localhost:4200/login');
    await page.fill('input#email', 'diep123@gmail.com');
    await page.fill('input#password', '123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:4200/role');
  });

  test('should show error for incorrect credentials', async ({ page }) => {
    await page.goto('http://localhost:4200/login');
    await page.fill('input#email', 'wronguser@example.com');
    await page.fill('input#password', 'WrongPassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('div.error-message')).toContainText('Invalid credentials');
  });
});
