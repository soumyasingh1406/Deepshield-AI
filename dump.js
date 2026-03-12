import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    
    // Check the main element content
    const mainContent = await page.evaluate(() => {
        const main = document.querySelector('main');
        if (!main) return 'NO MAIN ELEMENT';
        return main.innerHTML;
    });
    
    fs.writeFileSync('c:\\Users\\soumy\\Deepshield AI\\dom_content.txt', mainContent, 'utf8');
    console.log('DOM written to dom_content.txt');

    await browser.close();
  } catch (err) {
    console.error('Fatal Node error:', err);
    process.exit(1);
  }
})();
