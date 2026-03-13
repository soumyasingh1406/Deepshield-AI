import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Verify Evidence Locker integrity check workflow', async ({ page }) => {
  // Step 1: Upload a file to generate an Evidence Store record
  await page.goto('http://localhost:5173/');

  // Click on "Digital Manipulation Risk Analysis" in sidebar
  await page.locator('text=Digital Manipulation').click();
  
  // Create a dummy image
  const dummyFile = path.join(__dirname, 'dummy_test.jpg');
  fs.writeFileSync(dummyFile, 'dummy image content');

  // Upload file
  const fileChooserPromise = page.waitForEvent('filechooser');
  // Click on the drag and drop zone
  await page.locator('.glass-panel.border-dashed').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(dummyFile);

  // Click Ingest
  await page.locator('button:has-text("Ingest & Analyze")').click();

  // Wait for scan to finish and Evidence button to appear
  await page.locator('button:has-text("Send Hash to Evidence Locker")').waitFor({ state: 'visible', timeout: 30000 });
  
  // Save evidence
  await page.locator('button:has-text("Send Hash to Evidence Locker")').click();
  
  // Give it a second to save
  await page.waitForTimeout(1000);

  // Step 2: Navigate to Evidence Locker
  await page.locator('text=Evidence Locker').nth(1).click();
  
  // Locate the Verify Integrity button in the table row
  const verifyBtn = page.locator('button:has-text("Verify Integrity")').first();
  await verifyBtn.waitFor({ state: 'visible' });
  
  // Click Verify Integrity
  await verifyBtn.click();

  // Check that VERIFIED tag appears
  await expect(page.locator('span:has-text("VERIFIED")').first()).toBeVisible();

  // Step 3: Tamper with backend file and check Tamper status
  const uploadsDir = path.join(__dirname, 'backend', 'uploads');
  const files = fs.readdirSync(uploadsDir);
  const latestFile = files.find(f => f.includes('dummy_test.jpg'));
  
  if (latestFile) {
    const filePath = path.join(uploadsDir, latestFile);
    fs.appendFileSync(filePath, 'tampering_data');
  }

  // Refresh records
  await page.locator('button:has-text("Refresh records")').click();
  
  // It resets state to "Verify Integrity"
  await verifyBtn.waitFor({ state: 'visible' });
  await verifyBtn.click();
  
  // Check that HASH MISMATCH tag appears
  await expect(page.locator('span:has-text("HASH MISMATCH")').first()).toBeVisible();

  console.log("Playwright visual test sequence completed successfully!");
});
