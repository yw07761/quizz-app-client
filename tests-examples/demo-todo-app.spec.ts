import { test, expect } from '@playwright/test';

test.describe('Registration Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/register'); 
  });

  test('should register a new user successfully', async ({ page }) => {
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'john.doe@gmail.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');

    await page.check('input[type="checkbox"]');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('http://localhost:4200/login');
    await expect(page.locator('.success-message')).toHaveText('Đăng ký thành công!');
  });

  test('should show error message for invalid registration', async ({ page }) => {
    await page.fill('input[name="firstName"]', ''); 
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'invalid-email'); 
    await page.fill('input[name="password"]', '123'); 
    await page.fill('input[name="confirmPassword"]', '456'); 

    await page.click('button[type="submit"]');

    await expect(page.locator('.error-message')).toHaveText('Vui lòng kiểm tra thông tin đã nhập');
  });
});
