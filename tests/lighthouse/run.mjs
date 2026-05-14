#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const REPORTS_DIR = join(ROOT, 'lighthouse-reports');
const PORT = 4322;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const PAGES = [
  { path: '/', slug: 'home' },
  { path: '/chi-sono', slug: 'chi-sono' },
  { path: '/servizi', slug: 'servizi' },
  { path: '/contatti', slug: 'contatti' },
];

const THRESHOLDS = {
  performance: 0.85,
  accessibility: 0.9,
  'best-practices': 0.9,
  seo: 0.9,
};

if (!existsSync(join(ROOT, 'dist'))) {
  console.error('dist/ non esiste. Esegui "npm run build" prima.');
  process.exit(1);
}

await mkdir(REPORTS_DIR, { recursive: true });

console.log(`Avvio preview server su porta ${PORT}...`);
const preview = spawn('npx', ['astro', 'preview', '--host', '0.0.0.0', '--port', String(PORT)], {
  cwd: ROOT,
  stdio: ['ignore', 'pipe', 'pipe'],
});

let serverReady = false;
preview.stdout.on('data', (d) => {
  const msg = d.toString();
  if (msg.includes('localhost') || msg.includes('Local')) serverReady = true;
});
preview.stderr.on('data', (d) => process.stderr.write(d));

const waitForServer = async () => {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
};

const ready = await waitForServer();
if (!ready) {
  console.error('Preview server non risponde.');
  preview.kill('SIGTERM');
  process.exit(1);
}

const { default: lighthouse } = await import('lighthouse');
const chromeLauncher = await import('chrome-launcher');

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
});

const failures = [];

try {
  for (const p of PAGES) {
    console.log(`\nLighthouse → ${p.path}`);
    const url = `${BASE_URL}${p.path}`;
    const result = await lighthouse(
      url,
      {
        port: chrome.port,
        output: 'json',
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor: 'desktop',
        screenEmulation: { disabled: true },
      },
      undefined,
    );

    const lhr = result.lhr;
    const reportPath = join(REPORTS_DIR, `${p.slug}.json`);
    await writeFile(reportPath, JSON.stringify(lhr, null, 2));

    const scores = {
      performance: lhr.categories.performance?.score ?? 0,
      accessibility: lhr.categories.accessibility?.score ?? 0,
      'best-practices': lhr.categories['best-practices']?.score ?? 0,
      seo: lhr.categories.seo?.score ?? 0,
    };

    console.log(
      `  performance=${(scores.performance * 100).toFixed(0)} ` +
        `a11y=${(scores.accessibility * 100).toFixed(0)} ` +
        `bp=${(scores['best-practices'] * 100).toFixed(0)} ` +
        `seo=${(scores.seo * 100).toFixed(0)}`,
    );

    for (const [cat, min] of Object.entries(THRESHOLDS)) {
      const score = scores[cat];
      if (score < min) {
        failures.push(`${p.path} ${cat}=${(score * 100).toFixed(0)} < ${(min * 100).toFixed(0)}`);
      }
    }
  }
} finally {
  await chrome.kill();
  preview.kill('SIGTERM');
}

if (failures.length > 0) {
  console.error('\nLighthouse soglie non rispettate:');
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}

console.log('\nLighthouse OK. Report in lighthouse-reports/.');
