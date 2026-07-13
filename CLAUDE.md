# sitowebpsi

## Progetto
Sito statico Astro, deploy su GitHub Pages via GitHub Actions (push a `main`).

## Stack
- **Framework**: Astro 5.x
- **Runtime dev/build**: Docker + docker-compose (Node 20 alpine)
- **Task runner**: Makefile
- **Output build**: `./dist/` (statico, pronto GitHub Pages)

## Struttura
```
sitowebpsi/
├── Dockerfile              # node:20-alpine
├── docker-compose.yml      # services: web (dev), build (profile)
├── Makefile                # comandi locali
├── package.json            # astro deps + scripts
├── astro.config.mjs        # host:true, polling per HMR Docker
├── .gitignore .dockerignore
├── src/
│   ├── pages/index.astro
│   └── layouts/Base.astro
├── public/favicon.svg
└── .claude/skills/ui-ux-pro-max/   # skill locale (tracciata in repo)
```

## Comandi principali (Makefile)
- `make install` — npm install nel container (prima volta)
- `make up` / `make dev` — dev server su http://localhost:4321 con HMR
- `make build` — genera `./dist/` statico
- `make preview` — anteprima build statica
- `make shell` — shell nel container
- `make clean` — rimuove dist, node_modules, container
- `make help` — elenco completo

## Test suite
Container dedicato `test` (image `mcr.microsoft.com/playwright:v1.60.0-jammy`, Node 20 + Chromium).

- `make test-build` — builda immagine test (prima volta, ~6 min)
- `make test` — full pipeline: unit + build + smoke + e2e + lighthouse
- `make test-unit` — solo Vitest (data layer: profilo + servizi)
- `make test-e2e` — solo Playwright (chromium + mobile-chrome): nav/home/seo/a11y, 80 test
- `make test-smoke` — solo smoke check su `dist/` post-build
- `make test-lighthouse` — solo Lighthouse (perf/a11y/BP/SEO), output in `lighthouse-reports/`
- `make test-shell` — shell dentro container test

**Struttura:**
```
tests/
├── unit/           # vitest (profilo.test.ts, servizi.test.ts)
├── e2e/            # playwright (navigation, home, seo, a11y)
├── smoke/          # check-dist.mjs (HTML + asset + link interni)
└── lighthouse/     # run.mjs (soglie: perf 85, a11y/bp/seo 90)
```

**Nota arch**: il container test usa base **jammy/glibc**, diverso da web (alpine/musl). Bind mount selettivo per evitare conflitti rollup binaries: solo `src/`, `tests/`, `public/`, config files. `node_modules` e `package-lock.json` restano nell'image (escluso da `.dockerignore`).

## Workflow tipico
1. `make install` (prima volta)
2. `make up` → sviluppa con HMR
3. `make build` → `dist/`
4. `git push origin main` → la CI builda e pubblica su Pages

## Note Astro config
- `site: 'https://simonegalati21.github.io'` + `base: '/sitowebpsi'` per GitHub Pages project site.
- URL prod: https://simonegalati21.github.io/sitowebpsi/
- Toggle env `ASTRO_BASE=0` disabilita site+base (usato dal pipeline test per servire a root).
- Tutti i link interni in pagine/componenti usano helper `link()` da `src/lib/url.ts` (prefisso base automatico).
- HMR via polling (`CHOKIDAR_USEPOLLING=true`) per compatibilità bind mount Docker.

## Deploy GitHub Pages (automatico)
1. Settings repo → Pages → **Source: GitHub Actions** (una tantum)
2. `git push origin main` → workflow `deploy.yml`: build + upload-pages-artifact + deploy-pages
3. Sito live: https://simonegalati21.github.io/sitowebpsi/
- Deploy manuale on-demand: tab Actions → "Deploy to GitHub Pages" → Run workflow (`workflow_dispatch`)

## Gotcha: Vite cache stale dopo rewrite file
Quando si **riscrive completamente** un `.astro` (Write tool, non Edit), Vite dev server può servire i **CSS module cached** invece di quelli aggiornati. Sintomo: file su disco aggiornato + `curl` mostra CSS nuovo, ma `<style>` nel DOM browser ha CSS vecchio (verificabile via `document.querySelectorAll('style')` o computed `var(--color-bg)` ancora old).

**Workaround**: `docker compose restart web` (oppure `make down && make up`). HMR funziona bene su Edit incrementali, rompe su Write totale dei `.astro`.

**Cause root**: cache moduli Vite + scoped CSS `data-astro-cid-xxx` non invalidati al rewrite. Issue noto Astro+Vite+bind mount Docker.

## Professionista (dati reali nel sito)
Fonte dati: profilo pubblico Unobravo + business Google + Instagram (NON citare Unobravo sul sito).
- **Dott.ssa Annamaria Cosentino** — Psicologa Psicoterapeuta, orientamento cognitivo-comportamentale
- Albo: Ordine degli Psicologi della Calabria n° 2314
- Laurea in Psicologia Clinica e della Salute nel ciclo di vita — Univ. di Messina (110 e lode)
- Tel/WhatsApp: +39 327 550 4342 · Email: psicologa.cosentino@gmail.com
- Instagram: @annamariacosentino_psicologa
- **Sedi**: Online (videochiamata) · Sambiase, Lamezia Terme (CZ) · Filadelfia (VV), Corso Italia 62, 89814 (sede primaria per mappa/footer)
- Aree servizi: ansia/panico/DOC, depressione, coppia, trauma/lutto, autostima, online
- Foto: `public/annamaria-cosentino.jpg` (miniatura 200×200, bassa risoluzione — da sostituire con originale se disponibile)
- Tutti i dati centralizzati in `src/data/profilo.ts` (+ `servizi.ts`); componenti nascondono le righe con valore `""`.

## Stato repo
- Branch `main`, remote `origin` → github.com/SimoneGalati21/sitowebpsi
- Deploy **automatico** via GitHub Actions (`.github/workflows/deploy.yml`) su push a `main`
- Implementazione completa: 4 pagine + 404, componenti, data layer, dati reali inseriti
- Design system "Soft UI Evolution" applicato (ui-ux-pro-max skill)
- Build statico verificato: `make build` → `dist/`

## Decisioni prese
- ✅ Stack: Astro 5
- ✅ Repo: git + remote origin su GitHub, deploy CI su Pages
- ✅ Contenuto: dati reali Dott.ssa Annamaria Cosentino (Calabria)
- ✅ Multi-pagina, 4 pagine core + 404
- ✅ Contatti: solo info (mailto/tel/whatsapp/instagram + mappa iframe)
- ✅ Design system: lavender (#8B5CF6) + wellness green (#10B981), Lora + Raleway
- ✅ Anti-pattern rispettati: no emoji icons (SVG Lucide), no neon, no dark mode
- ✅ `astro.config.mjs` `site` + `base`: attivi (default ON, `ASTRO_BASE=0` per test root)
- ✅ Primo colloquio descritto come "conoscitivo" (NON "gratuito" — non confermato)
- ⏳ **P.IVA**: mancante — footer nasconde la riga finché `profilo.piva` resta `""`

## Vincoli
- Memoria progetto: SOLO dentro questa cartella (no `~/.claude/`)
- Tutto stato/preferenze in CLAUDE.md o file locali

## Comandi utili
- Reinstall skill UI: `uipro init --ai claude`
- Update CLI: `npm i -g uipro-cli`
