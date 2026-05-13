# Spec: Sito vetrina psicologo/a

**Data**: 2026-05-13
**Progetto**: sitowebpsi
**Stack**: Astro 5.x + Docker + GitHub Pages

## Obiettivo

Sito statico vetrina per psicologo/a libero professionista, multi-pagina, deploy su GitHub Pages. Scaffold strutturale neutro; design visivo definitivo demandato a fase successiva (skill `ui-ux-pro-max`). Contenuti iniziali con placeholder credibili, sostituibili modificando un singolo file dati.

## Scope

**In scope**:
- 4 pagine: Home, Chi sono, Servizi, Contatti
- Dati centralizzati TypeScript (profilo + servizi)
- Layout + componenti riutilizzabili (Header, Footer, Hero, ServizioCard, ContactInfo)
- SEO basics (title, meta description, Open Graph)
- 404 custom
- Accessibilità basics (lang, heading hierarchy, aria-label, contrasto)
- Build statico funzionante (`npm run build` → `dist/`)

**Out of scope**:
- Form di contatto (sostituito da link mailto/tel/WhatsApp)
- Pagine aggiuntive (Approccio, Tariffe/FAQ, Blog, Privacy)
- Cookie banner / consenso
- Backend / API / database
- CMS headless
- Test unitari automatici
- CI/CD GitHub Actions (upload manuale dist/ da parte utente)
- Design system finale (palette/font/animazioni)
- i18n / multilingua (solo italiano)
- Analytics

## Architettura

Sito statico multi-pagina renderizzato a build time. Zero JS client tranne link nativi (mailto:, tel:, whatsapp). CSS scoped Astro per componente + variabili globali in layout base.

### Struttura directory

```
src/
├── layouts/
│   └── Base.astro          # HTML shell, <head>, meta SEO, slot, CSS vars globali
├── components/
│   ├── Header.astro        # nav 4 link + nome professionista
│   ├── Footer.astro        # contatti sintetici + albo + ©
│   ├── Hero.astro          # blocco hero riutilizzabile (title + sub + CTA opzionale)
│   ├── ServizioCard.astro  # card singolo servizio (icon + titolo + descrizione)
│   └── ContactInfo.astro   # blocco contatti (variant full/compact)
├── data/
│   ├── profilo.ts          # oggetto profilo professionista
│   └── servizi.ts          # array servizi
└── pages/
    ├── index.astro         # home
    ├── chi-sono.astro      # bio estesa
    ├── servizi.astro       # griglia servizi
    ├── contatti.astro      # info contatto + mappa iframe
    └── 404.astro           # not found custom
```

### Data flow

Dati statici in `src/data/*.ts`, importati dalle pagine/componenti che li usano. Modifica = 1 punto, propagazione automatica al build successivo.

**`profilo.ts`** — shape:
```ts
export interface Profilo {
  nome: string;
  titolo: string;
  albo: string;
  email: string;
  tel: string;
  whatsapp: string;          // formato internazionale senza +
  indirizzo: {
    via: string;
    citta: string;
    cap: string;
  };
  orari: string;
  bio: string;               // ~150-250 parole
  formazione: string[];      // bullet list
  approccio: string;         // ~100-200 parole
  mapsEmbedUrl: string;      // URL iframe Google Maps
}
```

**`servizi.ts`** — shape:
```ts
export interface Servizio {
  slug: string;              // es. "ansia"
  titolo: string;            // es. "Disturbi d'ansia"
  descrizioneBreve: string;  // 1 frase, per card
  descrizioneEstesa: string; // 2-4 frasi, per pagina servizi
  icon: string;              // emoji (unicode) per scaffold; sostituibile con SVG inline in fase design
}

export const servizi: Servizio[] = [
  // 6 servizi placeholder: Ansia, Depressione, Coppia, Adolescenti, EMDR, Online
];
```

### Componenti — contratti

| Componente | Props | Responsabilità |
|---|---|---|
| `Base.astro` | `title?: string`, `description?: string`, `ogImage?: string` | Shell HTML, `<head>` (title, meta, OG), include Header + Footer + slot main |
| `Header.astro` | — | Nav con 4 link (Home, Chi sono, Servizi, Contatti) + nome professionista. Posizione statica nello scaffold; eventuale sticky in fase design finale |
| `Footer.astro` | — | Contatti compatti via `ContactInfo` variant compact, albo, © anno corrente |
| `Hero.astro` | `title: string`, `sub?: string`, `cta?: { label: string, href: string }` | Blocco di apertura riutilizzabile per ogni pagina |
| `ServizioCard.astro` | `servizio: Servizio` | Card con icon + titolo + descrizioneBreve, link a sezione dettaglio |
| `ContactInfo.astro` | `variant: "full" \| "compact"` | Renderizza dati da `profilo.ts`. Full = lista verticale con label; compact = inline orizzontale |

Tutti i componenti tipizzati TypeScript via Astro `Props` interface.

### Routing

File-based di Astro. Nessuna config aggiuntiva.

| Path | File | Contenuto |
|---|---|---|
| `/` | `pages/index.astro` | Hero + intro breve + 3 servizi top + CTA contatti |
| `/chi-sono` | `pages/chi-sono.astro` | Hero + bio + formazione + approccio |
| `/servizi` | `pages/servizi.astro` | Hero + griglia tutti i 6 servizi (`ServizioCard`) |
| `/contatti` | `pages/contatti.astro` | Hero + `ContactInfo` full + mappa iframe + orari |
| `*` | `pages/404.astro` | Messaggio + link a home |

### Stile

- **Zero framework CSS** (no Tailwind, no UI lib). Solo CSS scoped Astro + variabili.
- Variabili globali in `Base.astro` (sotto `:root`):
  - Colori: `--color-bg`, `--color-fg`, `--color-muted`, `--color-accent`, `--color-border`
  - Font: `--font-sans`, `--font-serif`
  - Spacing: `--space-1` ... `--space-8` (scala 4px o 8px)
  - Container: `--max-width: 1100px`
- Mobile-first responsive. Breakpoints minimi: 640px (sm), 1024px (lg).
- Valori palette/font iniziali = neutri/placeholder, sostituiti in fase `ui-ux-pro-max`.

### SEO / accessibilità

- `<html lang="it">`
- Per pagina: `<title>` + `<meta name="description">` via props di `Base`
- Open Graph minimi: `og:title`, `og:description`, `og:type=website`, `og:image` (placeholder SVG/PNG in `public/`)
- Heading hierarchy: un solo `<h1>` per pagina, gerarchia coerente
- `<nav aria-label="Principale">` su Header
- Link `tel:` / `mailto:` / `https://wa.me/...` con testo descrittivo
- Contrasto colore AA-compliant (verificato in fase design)
- Focus states visibili (default browser + custom in fase design)

### Error handling

- 404 custom in `src/pages/404.astro` (Astro lo serve automaticamente)
- Link esterni: `rel="noopener noreferrer"` su `target="_blank"`
- Mappa Google: iframe `loading="lazy"`, con fallback link "Apri in Google Maps" sotto

### Build / deploy

- `make up` → dev server con HMR su `localhost:4321`
- `make build` → genera `dist/` statico
- Upload manuale `dist/` su GitHub Pages da parte utente (no CI configurata)
- `astro.config.mjs`: `site` e `base` da scommentare quando l'utente comunica URL GitHub Pages

## Testing

Sito statico vetrina = superficie test minima:

| Test | Modalità | Criterio |
|---|---|---|
| Build statico | `make build` | Exit code 0, `dist/` popolato con 4 HTML + asset |
| Visual smoke | `make up` + browser manuale | Le 4 pagine si caricano, nav funziona, link contatti funzionano, mappa visibile, mobile responsive |
| HMR | Modifica `src/data/profilo.ts` durante `make up` | Browser si aggiorna automaticamente, dati propagati |
| 404 | Visita `/inesistente` in dev | Pagina 404 custom |
| Lighthouse | DevTools su `make preview` | Target ≥90 Performance/SEO/A11y (verificato in fase design finale) |

**Non in scope**: unit test, e2e (Playwright), visual regression. Aggiungibili dopo se sito cresce.

## Decisioni risolte

| # | Decisione | Scelta |
|---|---|---|
| 1 | Tipo sito | Vetrina psicologo/a libero professionista |
| 2 | Dati iniziali | Placeholder credibili (sostituiti dopo) |
| 3 | Pagine | 4 core: Home, Chi sono, Servizi, Contatti |
| 4 | Struttura | Multi-pagina classico |
| 5 | Stile iniziale | Scaffold neutro, design finale in fase `ui-ux-pro-max` |
| 6 | Form contatti | No form, solo info (mailto/tel/WhatsApp/mappa) |

## Dipendenze già installate

- `astro@^5.1.0` (versione effettiva risolta: 5.18.1)

Nessuna dipendenza aggiuntiva richiesta da questo scope.

## Rischi / note

- **Albo psicologi placeholder**: in fase deploy reale, sostituire con dati veri pena violazioni deontologiche. Memo nel CLAUDE.md.
- **Google Maps iframe**: senza chiave API per embed base (`maps.google.com/maps?...&output=embed`). Per Maps Embed API serve chiave + costi (out of scope).
- **WhatsApp link**: usa `https://wa.me/<numero>` formato internazionale senza `+`. Nessun JS richiesto.
- **GitHub Pages base path**: se repo non è `<username>.github.io`, serve `base: '/sitowebpsi'` in `astro.config.mjs`. Da decidere prima del primo deploy.

## Prossimo step

Implementazione tramite skill `writing-plans` → piano dettagliato con task ordinati.
