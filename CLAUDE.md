# sitowebpsi

## Progetto
Sito statico Astro, deploy su GitHub Pages (upload manuale da parte utente).

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

## Workflow tipico
1. `make install` (prima volta)
2. `make up` → sviluppa con HMR
3. `make build` → `dist/`
4. Utente carica manualmente `dist/` su GitHub Pages

## Note Astro config
- `site` e `base` in `astro.config.mjs` commentati: scommentare quando si sa URL GitHub Pages (es. `https://USERNAME.github.io` + `base: '/sitowebpsi'` se non è user/org site).
- HMR via polling (`CHOKIDAR_USEPOLLING=true`) per compatibilità bind mount Docker.

## Stato repo
- Git init locale (branch `main`)
- Nessun remote configurato (push manuale utente)
- File staged, nessun commit ancora

## Decisioni prese
- ✅ Stack: Astro
- ✅ Repo: git init locale, no remote
- ⏳ Contenuto: ancora da definire ("psi" = ?)

## Vincoli
- Memoria progetto: SOLO dentro questa cartella (no `~/.claude/`)
- Tutto stato/preferenze in CLAUDE.md o file locali

## Comandi utili
- Reinstall skill UI: `uipro init --ai claude`
- Update CLI: `npm i -g uipro-cli`
