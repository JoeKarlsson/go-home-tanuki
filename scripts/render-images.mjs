// Renders the PNG icons from the tanuki sprite and the 1200x630 social card from
// the title screen. Run after `npm run build` with `npx vite preview` on port 4173.
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:4173/');

// First frame of the 115x100 flying-tanuki sprite sheet, centered on the night sky
for (const [file, size] of [['favicon.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  const icon = await browser.newPage({ viewport: { width: size, height: size } });
  await icon.goto('http://localhost:4173/robots.txt');
  await icon.setContent(`<style>*{margin:0}body{width:${size}px;height:${size}px;background:#000033;position:relative;overflow:hidden}
    div{width:115px;height:100px;background:url(http://localhost:4173/images/tanukisprite_115_100.webp) 0 0;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(${(size * 0.9) / 115})}</style><div></div>`);
  await icon.waitForLoadState('networkidle');
  await icon.screenshot({ path: `public/${file}` });
  await icon.close();
}

// The title screen finishes animating in about 4.5 seconds after it starts
await page.waitForFunction(() => window.game?.state.current === 'splash');
await page.waitForTimeout(5000);
const titleScreen = await page.locator('#game canvas').screenshot();
const card = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await card.setContent(`<style>*{margin:0}body{background:#000033}img{width:1200px;height:630px;object-fit:cover;object-position:50% 0;display:block}</style>
  <img src="data:image/png;base64,${titleScreen.toString('base64')}">`);
await card.screenshot({ path: 'public/og-image.jpg', type: 'jpeg', quality: 85 });
await browser.close();
