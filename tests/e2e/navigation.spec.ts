import { test, expect } from '@playwright/test';

const PAGES = [
  { path: '/', title: /Dott\.ssa Elena Marchetti/ },
  { path: '/chi-sono', title: /Chi sono/ },
  { path: '/servizi', title: /Servizi/ },
  { path: '/contatti', title: /Contatti/ },
];

for (const p of PAGES) {
  test(`pagina ${p.path} carica e ha titolo`, async ({ page }) => {
    const res = await page.goto(p.path);
    expect(res?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(p.title);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
}

test('header link navigano tra pagine', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Chi sono', exact: true }).first().click();
  await expect(page).toHaveURL(/\/chi-sono\/?$/);
  await expect(page.getByRole('heading', { name: /Chi sono/i }).first()).toBeVisible();

  await page.getByRole('link', { name: 'Servizi', exact: true }).first().click();
  await expect(page).toHaveURL(/\/servizi\/?$/);

  await page.getByRole('link', { name: 'Contatti', exact: true }).first().click();
  await expect(page).toHaveURL(/\/contatti\/?$/);
});

test('skip link presente e funzionante', async ({ page }) => {
  await page.goto('/');
  const skip = page.locator('a.skip-link');
  await expect(skip).toHaveAttribute('href', '#main');
});

test('404 mostra fallback', async ({ page }) => {
  const res = await page.goto('/pagina-inesistente-xyz');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Torna alla home/i })).toBeVisible();
});
