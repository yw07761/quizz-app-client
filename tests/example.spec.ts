import { test, expect } from '@playwright/test';

test('create question form', async ({ page }) => {
  await page.goto('http://localhost:4200/question');

  // Click "Thêm câu hỏi mới"
  await page.click('button.add-btn');

  // Fill in question content
  await page.fill('textarea[placeholder="Nhập nội dung câu hỏi"]', 'What is the capital of France?');

  // Select category and group
  await page.waitForSelector('option[value="Vocabulary"]');
  await page.selectOption('select[ngmodel="question.category"]', 'Vocabulary');
  await page.waitForSelector('option[value="Intermediate"]');
  await page.selectOption('select[ngmodel="question.group"]', 'Intermediate');

  // Add answer options
  await page.fill('input[placeholder="Câu trả lời..."]', 'Paris');
  await page.click('i.fas.fa-toggle-off');  // Toggle correct answer
  
  await page.fill('input[placeholder="Câu trả lời..."]', 'London');
  await page.click('i.fas.fa-toggle-on');

  // Save the question
  await page.click('button.save-btn');

  // Verify that the question was saved
});
