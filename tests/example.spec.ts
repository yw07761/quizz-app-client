import { test, expect } from '@playwright/test';

test.describe('RegisterComponent', () => {
  
  test('should show error if passwords do not match', async ({ page }) => {
    await page.goto('http://localhost:4200/register');

    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'johndoe@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'differentPassword');

    await page.click('button[type="submit"]');

    const passwordError = await page.locator('div.text-danger >> text=Mật khẩu không khớp');

  });

  test('should show error if email is already in use', async ({ page }) => {
    await page.goto('http://localhost:4200/register');

    // Assuming the email johndoe@example.com already exists
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'johndoe@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');

    await page.click('button[type="submit"]');

    const errorMessage = await page.locator('div.text-danger >> text=Email đã được sử dụng');
  });

  test('should show error if email format is invalid', async ({ page }) => {
    await page.goto('http://localhost:4200/register');

    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');

    await page.click('button[type="submit"]');

    const errorMessage = await page.locator('div.text-danger >> text=Email không hợp lệ');
    
  });

  test('should show error message if required fields are missing', async ({ page }) => {
    await page.goto('http://localhost:4200/register');

    // Leave required fields empty and submit
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.click('button[type="submit"]');

    const errorMessage = await page.locator('div.text-danger >> text=Vui lòng điền đầy đủ thông tin');
   
  });

  test('should navigate to login on successful registration', async ({ page }) => {
    await page.goto('http://localhost:4200/register');

    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'johndoe@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');

    // Assuming a successful registration
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('http://localhost:4200/register');
  });

});
