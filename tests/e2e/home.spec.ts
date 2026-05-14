import { test, expect } from '@playwright/test';

test.describe('home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero principale visibile', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/ascoltarti/i);
    await expect(page.getByRole('link', { name: /Prenota un primo colloquio/i })).toBeVisible();
  });

  test('sezione intro con nome', async ({ page }) => {
    await expect(page.getByText(/Ciao, sono/i)).toBeVisible();
  });

  test('mostra 3 servizi top', async ({ page }) => {
    const cards = page.locator('.servizi-top .grid > *');
    await expect(cards).toHaveCount(3);
  });

  test('CTA band finale presente', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Iniziamo con un primo colloquio/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Contattami ora/i })).toBeVisible();
  });

  test('hero illustration caricata', async ({ page }) => {
    const img = page.locator('.hero-illu img').first();
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('src', /hero-home\.svg$/);
  });
});

test.describe('servizi page', () => {
  test('elenca tutti i servizi con titoli', async ({ page }) => {
    await page.goto('/servizi');
    const articles = page.locator('.lista .servizio');
    const count = await articles.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('ogni servizio ha icona SVG', async ({ page }) => {
    await page.goto('/servizi');
    const svgs = page.locator('.lista .servizio .icon-wrap svg');
    const count = await svgs.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });
});

test.describe('chi-sono page', () => {
  test('avatar + bio visibili', async ({ page }) => {
    await page.goto('/chi-sono');
    await expect(page.locator('.avatar img')).toBeVisible();
    await expect(page.getByRole('heading', { name: /La mia storia professionale/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Formazione/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Il mio approccio/i })).toBeVisible();
  });
});

test.describe('contatti page', () => {
  test('email, telefono, whatsapp, mappa', async ({ page }) => {
    await page.goto('/contatti');
    await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
    await expect(page.locator('a[href^="tel:"]').first()).toBeVisible();
    await expect(page.locator('a[href*="wa.me"], a[href*="whatsapp"]').first()).toBeVisible();
    await expect(page.locator('iframe')).toBeVisible();
  });
});
