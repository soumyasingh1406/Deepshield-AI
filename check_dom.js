import { chromium } from 'playwright';

(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Wait for a second just to be sure React mounts
    await page.waitForTimeout(2000);
    
    // Check the main element content
    const mainContent = await page.evaluate(() => {
        const main = document.querySelector('main');
        if (!main) return 'NO MAIN ELEMENT';
        return main.innerHTML;
    });
    
    console.log('--- MAIN HTML CONTENT ---');
    console.log(mainContent.substring(0, 2000));
    
    const errors = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.text-red-500, [style*="color: red"]')).map(el => el.textContent);
    });
    console.log('--- POTENTIAL ERROR TEXT ---');
    console.log(errors);

    await browser.close();
  } catch (err) {
    console.error('Fatal Node error:', err);
    process.exit(1);
  }
})();
