import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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

test('a crash shows the score, and a tap or click starts a fresh run', async ({ page, isMobile }) => {
  const errors = watchForErrors(page);
  await page.goto('/');
  const canvas = page.locator('#game canvas');
  const tapOrClick = () => (isMobile ? canvas.tap() : canvas.click());
  await page.waitForFunction(() => window.game?.state.current === 'splash', null, { timeout: 15000 });
  await tapOrClick();
  await page.waitForFunction(() => window.game.state.current === 'game');
  await page.waitForTimeout(500);

  // Drop a rock onto the tanuki
  await page.evaluate(() => {
    const player = window.game.state.states.game.player;
    const rocks = window.game.world.children.find((child) => child.children?.[0]?.key === 'rock1');
    rocks.getFirstExists(false).reset(player.x, player.y);
  });
  const gameOverText = () => page.evaluate(() =>
    window.game.world.children.find((child) => child.text?.startsWith?.('GAME OVER'))?.text);
  await expect.poll(gameOverText).toMatch(/GAME OVER\nSCORE: \d+/);

  // Nothing new spawns behind the GAME OVER screen, and the score is saved for the next visit
  expect(await page.evaluate(() => window.game.time.events.events.filter((event) => event.loop && !event.pendingDelete).length)).toBe(0);
  const savedScore = await page.evaluate(() => window.localStorage.getItem('go-home-tanuki-high-score'));
  expect(Number(savedScore)).toBeGreaterThan(0);

  // Restart is allowed two seconds after the crash; it must work without a keyboard
  await page.waitForTimeout(2200);
  await tapOrClick();
  await expect.poll(() => page.evaluate(() => window.game.state.states.game.player.alive)).toBe(true);
  expect(await page.evaluate(() => window.game.time.slowMotion)).toBe(1);
  expect(errors).toEqual([]);
});

test('the high score from a past visit shows on the next one', async ({ page, isMobile }) => {
  await page.addInitScript(() => window.localStorage.setItem('go-home-tanuki-high-score', '4321'));
  await page.goto('/');
  const canvas = page.locator('#game canvas');
  await page.waitForFunction(() => window.game?.state.current === 'splash', null, { timeout: 15000 });
  await (isMobile ? canvas.tap() : canvas.click());
  await page.waitForFunction(() => window.game.state.current === 'game');
  await expect.poll(() => page.evaluate(() =>
    window.game.world.children.some((child) => child.text === '4321'))).toBe(true);
});


test('has no automatically detectable accessibility problems', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target).join(', ')}`)).toEqual([]);
});

test('on its own page the game starts with sound, and the button mutes it', async ({ page, isMobile }) => {
  test.skip(isMobile && false, 'phones get the keyboard notice instead');
  await page.goto('/');
  await page.waitForFunction(() => window.game?.state.current === 'splash', null, { timeout: 15000 });
  expect(await page.evaluate(() => window.game.sound.mute)).toBe(false);
  await page.getByRole('button', { name: 'Turn sound off' }).click();
  expect(await page.evaluate(() => window.game.sound.mute)).toBe(true);
});

test('the about page has the artist statement, links back to the game, and passes axe', async ({ page }) => {
  const errors = watchForErrors(page);
  await page.goto('/about.html');
  await expect(page.locator('h2', { hasText: 'Artist statement' })).toBeVisible();
  await expect(page.getByText('He never gets home.')).toBeVisible();
  await expect(page.locator('a[href="/"]')).toHaveText('Play Go Home Tanuki');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target).join(', ')}`)).toEqual([]);
  expect(errors).toEqual([]);
});

test('the game links to its about page from the corner buttons', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.about-link')).toBeVisible();
  await expect(page.locator('.about-link')).toHaveAttribute('href', '/about.html');
});
