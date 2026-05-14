# sitowebpsi

Sito vetrina statico per studio di psicoterapia. Build con Astro, deploy su GitHub Pages.

**Live:** https://simonegalati21.github.io/sitowebpsi/

---

## Stack

- **Framework:** [Astro 5](https://astro.build/) — SSG, file-based routing, zero JS runtime
- **Stile:** CSS scoped + custom properties (design tokens), no framework
- **Font:** Lora (heading) + Raleway (body), Google Fonts
- **Runtime dev/build:** Docker + docker-compose (Node 20 alpine)
- **Test:** Vitest (unit) + Playwright (E2E) + Lighthouse (perf/a11y/SEO)
- **CI/CD:** GitHub Actions → GitHub Pages

## Struttura

```
sitowebpsi/
├── src/
│   ├── pages/           # index, chi-sono, servizi, contatti, 404
│   ├── layouts/Base.astro
│   ├── components/      # Header, Footer, Hero, ServizioCard, ContactInfo
│   ├── data/            # profilo.ts, servizi.ts (placeholder)
│   └── lib/url.ts       # helper link() + isCurrent() (base-aware)
├── public/
│   ├── favicon.svg
│   ├── og-default.svg
│   └── illustrations/   # SVG inline (hero, avatar, pattern)
├── tests/
│   ├── unit/            # Vitest (data layer)
│   ├── e2e/             # Playwright (navigation, home, seo, a11y)
│   ├── smoke/           # check-dist.mjs (post-build verify)
│   └── lighthouse/      # run.mjs (perf/a11y/BP/SEO thresholds)
├── design-system/
│   └── studio-marchetti/MASTER.md   # generato da ui-ux-pro-max
├── .github/workflows/deploy.yml     # auto-deploy su push main
├── Dockerfile                       # dev/build (node:20-alpine)
├── Dockerfile.test                  # test (playwright:v1.60.0-jammy)
├── docker-compose.yml
├── Makefile
└── astro.config.mjs
```

## Sviluppo

Tutto gira in Docker. Niente Node installato localmente.

```bash
make install     # primo run: npm install nel container
make up          # dev server con HMR su http://localhost:4321
make build       # genera dist/ statico
make preview     # preview dist/ su http://localhost:4321
make clean       # rimuove dist, node_modules, container
make help        # lista completa
```

### Workflow tipico

1. `make install` (una volta)
2. `make up` → modifica `src/`, HMR ricarica
3. `make build` per generare `dist/`
4. Push → GitHub Actions deploya automatico

## Test

Container test dedicato (~2 GB, Playwright image con Chromium incluso).

```bash
make test-build         # primo run: builda image test
make test               # full pipeline: unit + build + smoke + e2e + lighthouse
make test-unit          # solo Vitest (data layer)
make test-e2e           # solo Playwright (80 test su chromium + mobile)
make test-smoke         # solo check post-build dist/
make test-lighthouse    # solo Lighthouse audit
```

**Soglie Lighthouse:** Performance 85 / Accessibility 90 / Best Practices 90 / SEO 90.

I test girano con `ASTRO_BASE=0` per servire a root (no base path), mentre il build di produzione include `/sitowebpsi/` per GitHub Pages.

## Deploy

### Automatico (consigliato)

Push su `main` → workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builda e pubblica. Richiede una volta sola:

**Settings → Pages → Source: GitHub Actions**

### Manuale

```bash
make build
# carica dist/ su branch gh-pages
```

## Configurazione

- `astro.config.mjs`: `site` + `base` per GitHub Pages, toggle via `ASTRO_BASE` env
- Tutti gli href/src interni passano da `src/lib/url.ts` per prefisso base automatico
- HMR via polling (`CHOKIDAR_USEPOLLING=true`) per compat bind mount Docker

## Contenuti placeholder

Il sito usa dati segnaposto credibili (Dott.ssa Elena Marchetti, Milano). Da sostituire prima del deploy reale:

- `src/data/profilo.ts` — nome, contatti, indirizzo, bio, formazione
- `src/data/servizi.ts` — aree di intervento
- `public/og-default.svg` — branding social
- `src/layouts/Base.astro` — meta description default

## Design system

Generato con [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — stile **Soft UI Evolution**:

- Palette: lavender `#8B5CF6` + wellness green `#10B981` su sfondo `#FAF5FF`
- Typography: Lora 400/600 + Raleway 400/500
- Anti-pattern rispettati: niente emoji come icone, no neon, no dark mode forzato
- Icone: SVG inline Lucide-style

Tutto in `design-system/studio-marchetti/MASTER.md`.

## Note tecniche

### Vite cache stale dopo rewrite

Se riscrivi completamente un `.astro` (Write tool, non Edit), Vite dev server può servire CSS scoped cached. Workaround:

```bash
docker compose restart web
# oppure
make down && make up
```

Edit incrementali HMR-friendly, Write totale rompe la cache moduli.

### Rollup optional deps (CI)

`package-lock.json` viene generato in container alpine (musl). CI Ubuntu (glibc) richiede variante diversa di `@rollup/rollup-linux-*`. Il workflow elimina il lock prima di `npm install` per workaround del [bug npm#4828](https://github.com/npm/cli/issues/4828).

## Licenza

Codice template MIT. Contenuti (testi, illustrazioni placeholder) per uso interno.
