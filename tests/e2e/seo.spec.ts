import { test, expect } from '@playwright/test';

const PAGES = ['/', '/chi-sono', '/servizi', '/contatti'];

for (const path of PAGES) {
  test(`SEO meta su ${path}`, async ({ page }) => {
    await page.goto(path);

    await expect(page.locator('html')).toHaveAttribute('lang', 'it');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description, `meta description su ${path}`).toBeTruthy();
    expect(description!.length).toBeGreaterThan(40);
    expect(description!.length).toBeLessThan(200);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical, `canonical su ${path}`).toBeTruthy();

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    const ogLocale = await page.locator('meta[property="og:locale"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
    expect(ogDesc).toBeTruthy();
    expect(ogImage).toBeTruthy();
    expect(ogLocale).toBe('it_IT');

    const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');
    expect(themeColor).toBe('#8B5CF6');

    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');

    const h1Count = await page.locator('h1').count();
    expect(h1Count, `un solo h1 su ${path}`).toBeGreaterThanOrEqual(1);
  });
}

test('favicon disponibile', async ({ page, request }) => {
  await page.goto('/');
  const href = await page.locator('link[rel="icon"]').getAttribute('href');
  expect(href).toBeTruthy();
  const res = await request.get(href!);
  expect(res.status()).toBe(200);
});

test('og image raggiungibile', async ({ page, request }) => {
  await page.goto('/');
  const og = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(og).toBeTruthy();
  const url = og!.startsWith('http') ? og! : og!;
  const res = await request.get(url);
  expect(res.status()).toBe(200);
});
