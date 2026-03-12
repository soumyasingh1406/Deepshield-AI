import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // Go to Command Center first
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 15000 });
    
    console.log("Current URL before click:", page.url());
    
    // Find the Threat Intelligence link and click it
    const sidebarLink = page.locator('nav a >> text="Threat Intelligence"');
    
    const href = await sidebarLink.getAttribute('href');
    console.log("Threat Intelligence href is:", href);
    
    await sidebarLink.click();
    
    // Wait for URL to change or network idle
    await page.waitForTimeout(2000); // just to be safe
    
    console.log("Current URL after click:", page.url());
    
    const artifactsDir = 'c:\\Users\\soumy\\.gemini\\antigravity\\brain\\e9116e08-ab93-4b64-997e-3b9de23f4017';
    const screenshotPath = path.join(artifactsDir, 'dashboard_after_click.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved to ${screenshotPath}`);
    
    await browser.close();
  } catch (err) {
    console.error('Fatal Node error:', err);
    process.exit(1);
  }
})();
