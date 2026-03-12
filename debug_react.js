import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error')
      console.log(`PAGE LOG: ${msg.text()}`);
  });
  page.on('pageerror', exception => {
    console.log(`Uncaught exception: ${exception}`);
  });
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle' });
  await browser.close();
})();
