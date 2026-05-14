#!/usr/bin/env node
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const DIST = join(ROOT, 'dist');

const REQUIRED_PAGES = [
  'index.html',
  'chi-sono/index.html',
  'servizi/index.html',
  'contatti/index.html',
  '404.html',
];

const REQUIRED_ASSETS = [
  'favicon.svg',
  'og-default.svg',
  'illustrations/hero-home.svg',
  'illustrations/profile-avatar.svg',
  'illustrations/pattern-blob.svg',
];

const failures = [];

function fail(msg) {
  failures.push(msg);
  console.error(`✗ ${msg}`);
}

function pass(msg) {
  console.log(`✓ ${msg}`);
}

if (!existsSync(DIST)) {
  fail(`dist/ non esiste. Esegui "npm run build" prima.`);
  process.exit(1);
}

for (const p of REQUIRED_PAGES) {
  const full = join(DIST, p);
  if (!existsSync(full)) {
    fail(`pagina mancante: ${p}`);
    continue;
  }
  const s = await stat(full);
  if (s.size < 500) {
    fail(`pagina troppo piccola (${s.size}B): ${p}`);
    continue;
  }
  const html = await readFile(full, 'utf8');
  if (!html.includes('<!DOCTYPE html>') && !html.includes('<!doctype html>')) {
    fail(`doctype mancante: ${p}`);
    continue;
  }
  if (!html.includes('<title>')) {
    fail(`title mancante: ${p}`);
    continue;
  }
  if (!html.includes('lang="it"')) {
    fail(`lang="it" mancante: ${p}`);
    continue;
  }
  if (!html.match(/<meta\s+name=["']description["']/i)) {
    fail(`meta description mancante: ${p}`);
    continue;
  }
  if (!html.match(/<link\s+rel=["']canonical["']/i)) {
    fail(`canonical mancante: ${p}`);
    continue;
  }
  if (!html.includes('og:title')) {
    fail(`og:title mancante: ${p}`);
    continue;
  }
  if (!html.includes('id="main"')) {
    fail(`<main id="main"> mancante: ${p}`);
    continue;
  }
  if (!html.includes('skip-link')) {
    fail(`skip-link mancante: ${p}`);
    continue;
  }
  pass(`pagina ok: ${p} (${s.size}B)`);
}

for (const a of REQUIRED_ASSETS) {
  const full = join(DIST, a);
  if (!existsSync(full)) {
    fail(`asset mancante: ${a}`);
    continue;
  }
  pass(`asset ok: ${a}`);
}

const indexHtml = await readFile(join(DIST, 'index.html'), 'utf8');
const internalLinks = [...indexHtml.matchAll(/href=["'](\/[^"'#?]*)["']/g)]
  .map((m) => m[1])
  .filter((h) => !h.startsWith('//'));
const uniqueLinks = [...new Set(internalLinks)];

for (const link of uniqueLinks) {
  let target;
  if (link === '/' || link === '') {
    target = join(DIST, 'index.html');
  } else if (link.endsWith('/')) {
    target = join(DIST, link, 'index.html');
  } else if (link.includes('.')) {
    target = join(DIST, link);
  } else {
    target = join(DIST, link, 'index.html');
    if (!existsSync(target)) {
      target = join(DIST, `${link}.html`);
    }
  }
  if (!existsSync(target)) {
    fail(`link interno rotto da index.html: ${link} → ${target.replace(DIST, 'dist')}`);
  } else {
    pass(`link interno ok: ${link}`);
  }
}

if (failures.length > 0) {
  console.error(`\n${failures.length} smoke check fallit${failures.length === 1 ? 'o' : 'i'}.`);
  process.exit(1);
}

console.log('\nSmoke check OK.');
