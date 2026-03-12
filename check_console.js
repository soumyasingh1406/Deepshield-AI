import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Set a good viewport size like a normal browser window
    await page.setViewportSize({ width: 1280, height: 800 });
    
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle', timeout: 15000 });
    
    const artifactsDir = 'c:\\Users\\soumy\\.gemini\\antigravity\\brain\\e9116e08-ab93-4b64-997e-3b9de23f4017';
    if (!fs.existsSync(artifactsDir)){
        fs.mkdirSync(artifactsDir, { recursive: true });
    }
    
    const screenshotPath = path.join(artifactsDir, 'dashboard_screenshot.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved to ${screenshotPath}`);
    
    // Check if there is an error overlay
    const viteErrorOverlay = await page.evaluate(() => {
      const overlay = document.querySelector('vite-error-overlay');
      return overlay ? overlay.shadowRoot?.textContent : null;
    });
    
    if (viteErrorOverlay) {
      console.log('VITE ERROR OVERLAY:', viteErrorOverlay);
    }
    
    await browser.close();
  } catch (err) {
    console.error('Fatal Node error:', err);
    process.exit(1);
  }
})();
