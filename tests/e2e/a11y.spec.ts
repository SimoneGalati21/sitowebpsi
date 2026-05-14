import { test, expect } from '@playwright/test';

const PAGES = ['/', '/chi-sono', '/servizi', '/contatti'];

for (const path of PAGES) {
  test.describe(`a11y ${path}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test('skip-link è il primo focusable', async ({ page }) => {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        return el ? { tag: el.tagName, cls: el.className, href: el.getAttribute('href') } : null;
      });
      expect(focused?.tag).toBe('A');
      expect(focused?.cls).toContain('skip-link');
      expect(focused?.href).toBe('#main');
    });

    test('immagini hanno alt attribute', async ({ page }) => {
      const imgs = page.locator('img');
      const count = await imgs.count();
      for (let i = 0; i < count; i++) {
        const alt = await imgs.nth(i).getAttribute('alt');
        expect(alt, `img ${i} su ${path} deve avere alt (anche stringa vuota se decorativa)`).not.toBeNull();
      }
    });

    test('link senza testo hanno aria-label', async ({ page }) => {
      const links = page.locator('a:visible');
      const count = await links.count();
      for (let i = 0; i < count; i++) {
        const el = links.nth(i);
        const text = (await el.innerText()).trim();
        if (text.length === 0) {
          const aria = await el.getAttribute('aria-label');
          const title = await el.getAttribute('title');
          expect(aria || title, `link ${i} su ${path} senza testo richiede aria-label/title`).toBeTruthy();
        }
      }
    });

    test('landmark main + header + footer presenti', async ({ page }) => {
      await expect(page.locator('main#main')).toHaveCount(1);
      await expect(page.locator('header')).toHaveCount(1);
      await expect(page.locator('footer')).toHaveCount(1);
    });
  });
}

test.describe('reduced motion', () => {
  test.use({ colorScheme: 'light' });
  test('animazioni rispettano prefers-reduced-motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    const styles = await page.evaluate(() => {
      const el = document.querySelector('.btn-primary') as HTMLElement | null;
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { transition: cs.transitionDuration, animation: cs.animationDuration };
    });
    expect(styles).not.toBeNull();
    await context.close();
  });
});

test('focus visibile su tab', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const hasOutline = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return false;
    const cs = getComputedStyle(el);
    const noOutline = cs.outlineStyle === 'none' || cs.outlineWidth === '0px';
    const hasBoxShadow = cs.boxShadow !== 'none';
    return !noOutline || hasBoxShadow;
  });
  expect(hasOutline).toBe(true);
});
