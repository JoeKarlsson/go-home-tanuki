import { test, expect } from '@playwright/test';

// Collects console errors, page errors and failed requests so each test can assert none happened
function watchForErrors(page) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(`console: ${message.text()}`);
    }
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('requestfailed', (request) => errors.push(`requestfailed: ${request.url()}`));
  page.on('response', (response) => {
    if (response.status() >= 400) {
      errors.push(`${response.status()}: ${response.url()}`);
    }
  });
  return errors;
}

test('head metadata is complete', async ({ page, request }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Go Home Tanuki/);
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  expect(description.length).toBeLessThanOrEqual(160);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://tanuki.joekarlsson.com/');
  await expect(page.locator('meta[name="darkreader-lock"]')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
  for (const path of [new URL(ogImage).pathname, '/favicon.png', '/apple-touch-icon.png', '/icon-192.png',
    '/icon-512.png', '/site.webmanifest', '/robots.txt', '/sitemap.xml']) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
});

test('plays from the title screen into a flight without errors, fitting the screen', async ({ page, isMobile }) => {
  const errors = watchForErrors(page);
  await page.goto('/');

  const canvas = page.locator('#game canvas');
  await expect(canvas).toBeVisible();
  await page.waitForFunction(() => window.game?.state.current === 'splash', null, { timeout: 15000 });

  // Start the game the way a player would: a tap on a phone, a click on a computer
  const tapOrClick = () => (isMobile ? canvas.tap() : canvas.click());
  await tapOrClick();
  await page.waitForFunction(() => window.game.state.current === 'game');
  for (let flap = 0; flap < 6; flap++) {
    await tapOrClick();
    await page.waitForTimeout(250);
  }

  // The 1024x768 game scales to fit the window without cropping or scrolling
  const fit = await page.evaluate(() => {
    const box = document.querySelector('#game canvas').getBoundingClientRect();
    return {
      inside: box.left >= 0 && box.top >= 0 && box.right <= innerWidth + 1 && box.bottom <= innerHeight + 1,
      scrolls: document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight
    };
  });
  expect(fit).toEqual({ inside: true, scrolls: false });
  expect(errors).toEqual([]);
});
