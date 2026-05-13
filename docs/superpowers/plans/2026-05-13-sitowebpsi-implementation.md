# sitowebpsi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementare sito statico vetrina psicologo/a su Astro 5 con 4 pagine (Home, Chi sono, Servizi, Contatti), dati centralizzati e componenti riutilizzabili, deploy-ready su GitHub Pages. Design system completo già al primo passaggio (no fase "design dopo").

**Architettura:** Astro file-based routing multi-pagina. Dati statici TypeScript in `src/data/*.ts`. Layout base + componenti scoped (Header, Footer, Hero, ServizioCard, ContactInfo). Zero JS client. Build via `make build` → `dist/`. Design system "Soft UI Evolution" da `design-system/studio-marchetti/MASTER.md` (skill ui-ux-pro-max).

**Tech Stack:** Astro 5.18.1, TypeScript, CSS scoped (no framework), Google Fonts (Lora + Raleway), SVG inline (Lucide-style), Docker, Make.

**Spec di riferimento:** `docs/superpowers/specs/2026-05-13-sito-vetrina-psi-design.md`

**Design system di riferimento:** `design-system/studio-marchetti/MASTER.md`

**Nota sul test:** lo spec esclude unit/e2e test. Verifica per task: (a) `make build` exit 0; (b) ispezione visiva via `make up`. Dev server può restare attivo (HMR ricarica auto).

**Design system applicato (riassunto):**
- **Pattern**: Hero-Centric + Social Proof. CTA above fold.
- **Style**: Soft UI Evolution — ombre morbide, transizioni 200-300ms, focus visibile.
- **Palette**: Primary `#8B5CF6` (lavender), CTA `#10B981` (wellness green), Background `#FAF5FF`, Text `#4C1D95`, Secondary `#C4B5FD`.
- **Font**: Lora (headings, serif) + Raleway (body, sans), via Google Fonts.
- **Anti-pattern**: no emoji icons (uso SVG inline Lucide-style), no neon, no animazioni dure, no dark mode.
- **A11y**: WCAG AA minimo, `prefers-reduced-motion`, focus-visible esplicito.

**Stato iniziale (già presente, NON ricreare):**
- `Dockerfile`, `docker-compose.yml`, `Makefile`, `.gitignore`, `.dockerignore`
- `package.json`, `package-lock.json`, `astro.config.mjs`
- `src/layouts/Base.astro` (versione minimale — sostituita in Task 3)
- `src/pages/index.astro` (placeholder — sovrascritto in Task 9)
- `public/favicon.svg`
- `CLAUDE.md`, spec doc + design system già committati

---

## File map

### File da CREARE

| File | Responsabilità |
|---|---|
| `src/data/profilo.ts` | Dati professionista + tipo `Profilo` |
| `src/data/servizi.ts` | Array 6 servizi + tipo `Servizio` (icon = SVG inline) |
| `src/components/Header.astro` | Nav 4 link + brand |
| `src/components/Footer.astro` | Contatti compact + albo + © |
| `src/components/Hero.astro` | Hero riutilizzabile + CTA |
| `src/components/ServizioCard.astro` | Card servizio con SVG icon |
| `src/components/ContactInfo.astro` | Blocco contatti full/compact |
| `src/pages/chi-sono.astro` | Bio |
| `src/pages/servizi.astro` | Griglia servizi |
| `src/pages/contatti.astro` | Contatti + mappa |
| `src/pages/404.astro` | Not found |
| `public/og-default.svg` | Open Graph fallback con palette design system |

### File da MODIFICARE

| File | Cambio |
|---|---|
| `src/layouts/Base.astro` | Rewrite: design system tokens, Google Fonts, shadow scale, Lora/Raleway, reduced-motion |
| `src/pages/index.astro` | Rewrite: hero + intro + top 3 servizi + CTA |
| `CLAUDE.md` | Aggiornare stato + decisioni a fine plan |

---

## Task 1: Data layer — profilo

**Files:**
- Create: `src/data/profilo.ts`

- [ ] **Step 1: Creare `src/data/profilo.ts`**

```ts
export interface Indirizzo {
  via: string;
  citta: string;
  cap: string;
}

export interface Profilo {
  nome: string;
  titolo: string;
  albo: string;
  email: string;
  tel: string;
  telDisplay: string;
  whatsapp: string;        // formato internazionale senza +
  indirizzo: Indirizzo;
  orari: string;
  bio: string;
  formazione: string[];
  approccio: string;
  mapsEmbedUrl: string;
}

export const profilo: Profilo = {
  nome: "Dott.ssa Elena Marchetti",
  titolo: "Psicologa Psicoterapeuta",
  albo: "Ordine Psicologi Lombardia n° 12345",
  email: "info@studiomarchetti.it",
  tel: "+390212345678",
  telDisplay: "+39 02 1234 5678",
  whatsapp: "393331234567",
  indirizzo: {
    via: "Via Roma 12",
    citta: "Milano",
    cap: "20100",
  },
  orari: "Lunedì–Venerdì 9:00–19:00",
  bio: "Psicologa Psicoterapeuta iscritta all'Ordine degli Psicologi della Lombardia. Da oltre dieci anni accompagno adulti e adolescenti in percorsi di consapevolezza e cambiamento. Il mio lavoro si fonda sull'ascolto, sul rispetto dei tempi della persona e su un approccio integrato che attinge alla terapia cognitivo-comportamentale, all'EMDR e alla mindfulness. Credo che la relazione terapeutica sia uno spazio sicuro in cui esplorare emozioni, schemi e risorse, per costruire insieme strumenti utili nella vita quotidiana.",
  formazione: [
    "Laurea magistrale in Psicologia Clinica — Università degli Studi di Milano-Bicocca (2010)",
    "Specializzazione in Psicoterapia Cognitivo-Comportamentale — Scuola di Psicoterapia Cognitiva (2015)",
    "Formazione EMDR Livello I e II — Associazione EMDR Italia (2018)",
    "Master in Mindfulness-Based Stress Reduction — Università di Padova (2020)",
  ],
  approccio: "Il primo colloquio è un incontro conoscitivo gratuito di 50 minuti, in cui possiamo capire insieme se il percorso è adatto. Le sedute successive durano 50 minuti e hanno cadenza settimanale o quindicinale, in base alle esigenze. Lavoro sia in studio a Milano sia online via videochiamata sicura. Ogni percorso è costruito sulla persona: non esistono protocolli universali, ma strategie condivise.",
  mapsEmbedUrl: "https://www.google.com/maps?q=Via+Roma+12,+Milano&output=embed",
};
```

- [ ] **Step 2: Verificare build**

Run: `make build`
Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/data/profilo.ts
git commit -m "feat(data): add profilo data layer with placeholder content"
```

---

## Task 2: Data layer — servizi (SVG icons)

**Files:**
- Create: `src/data/servizi.ts`

> Icone come stringhe SVG inline (Lucide-style, viewBox 24x24, stroke). Rispetta anti-pattern "no emoji icons" del design system.

- [ ] **Step 1: Creare `src/data/servizi.ts`**

```ts
export interface Servizio {
  slug: string;
  titolo: string;
  descrizioneBreve: string;
  descrizioneEstesa: string;
  /** SVG markup inline (Lucide-style). Renderizzato via set:html. */
  icon: string;
}

const svgWrap = (paths: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

export const servizi: Servizio[] = [
  {
    slug: "ansia",
    titolo: "Disturbi d'ansia",
    descrizioneBreve: "Affrontare attacchi di panico, ansia generalizzata, fobie e ansia sociale con strumenti concreti.",
    descrizioneEstesa: "Lavoriamo insieme per comprendere i meccanismi che alimentano l'ansia, riconoscere i pensieri automatici e sviluppare strategie cognitivo-comportamentali efficaci. Il percorso include tecniche di rilassamento, esposizione graduale e ristrutturazione cognitiva.",
    // Lucide "wind"
    icon: svgWrap(`<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>`),
  },
  {
    slug: "depressione",
    titolo: "Depressione e umore",
    descrizioneBreve: "Sostegno nei momenti di tristezza profonda, apatia e perdita di motivazione.",
    descrizioneEstesa: "Un percorso strutturato per ritrovare energia, senso e progettualità. Lavoriamo sui pensieri disfunzionali, sull'attivazione comportamentale e sulla riscoperta di attività significative, integrando elementi di mindfulness quando utile.",
    // Lucide "sunrise"
    icon: svgWrap(`<path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/>`),
  },
  {
    slug: "coppia",
    titolo: "Terapia di coppia",
    descrizioneBreve: "Spazio di dialogo per coppie in crisi, momenti di transizione o desiderio di crescita condivisa.",
    descrizioneEstesa: "Un setting neutro e accogliente in cui entrambi i partner possono esprimersi e ascoltarsi. Lavoriamo su comunicazione, gestione dei conflitti, intimità e progetto comune, valorizzando le risorse della coppia.",
    // Lucide "heart-handshake"
    icon: svgWrap(`<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/><path d="m18 15-2-2"/><path d="m15 18-2-2"/>`),
  },
  {
    slug: "adolescenti",
    titolo: "Adolescenti e giovani adulti",
    descrizioneBreve: "Supporto in una fase di grandi cambiamenti: identità, relazioni, scuola, futuro.",
    descrizioneEstesa: "Un ambiente protetto in cui ragazze e ragazzi possono parlare liberamente di sé. Affrontiamo insieme temi come autostima, relazioni con i coetanei, pressione scolastica, identità e progetti di vita, coinvolgendo la famiglia quando utile.",
    // Lucide "sprout"
    icon: svgWrap(`<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>`),
  },
  {
    slug: "emdr",
    titolo: "EMDR — Trauma e lutto",
    descrizioneBreve: "Elaborazione di esperienze traumatiche e lutti attraverso il metodo EMDR.",
    descrizioneEstesa: "L'EMDR (Eye Movement Desensitization and Reprocessing) è un approccio riconosciuto dall'OMS per il trattamento del trauma. Aiuta a rielaborare ricordi dolorosi riducendone l'impatto emotivo, riportando la persona al presente con nuove risorse.",
    // Lucide "refresh-cw"
    icon: svgWrap(`<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>`),
  },
  {
    slug: "online",
    titolo: "Sedute online",
    descrizioneBreve: "Psicoterapia via videochiamata sicura, ovunque tu sia.",
    descrizioneEstesa: "Per chi vive all'estero, ha orari complessi o preferisce la propria casa come spazio sicuro. Le sedute online seguono gli stessi standard professionali e deontologici di quelle in studio, su piattaforma criptata.",
    // Lucide "monitor"
    icon: svgWrap(`<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>`),
  },
];

export const serviziTop = servizi.slice(0, 3);
```

- [ ] **Step 2: Verificare build**

Run: `make build`
Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/data/servizi.ts
git commit -m "feat(data): add servizi with Lucide-style inline SVG icons"
```

---

## Task 3: Refactor `Base.astro` con design system completo

**Files:**
- Modify: `src/layouts/Base.astro` (rewrite completo)

> Implementa tutti i token del design system: palette lavender+green, Lora/Raleway via Google Fonts (`@fontsource` opzionale, usiamo CDN per semplicità), spacing/shadow scale, focus-visible, `prefers-reduced-motion`.

- [ ] **Step 1: Sovrascrivere `src/layouts/Base.astro`**

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { profilo } from '../data/profilo.ts';

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
}

const {
  title,
  description = `${profilo.nome} — ${profilo.titolo}. Studio a ${profilo.indirizzo.citta}. Percorsi di psicoterapia individuale, di coppia, per adolescenti, online ed EMDR.`,
  ogImage = '/og-default.svg',
} = Astro.props;

const pageTitle = title ? `${title} — ${profilo.nome}` : `${profilo.nome} — ${profilo.titolo}`;
const canonicalUrl = new URL(Astro.url.pathname, Astro.site ?? 'http://localhost:4321');
---
<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <meta name="theme-color" content="#8B5CF6" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href={canonicalUrl.toString()} />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Raleway:wght@300;400;500;600;700&display=swap"
    />

    <meta property="og:type" content="website" />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:locale" content="it_IT" />

    <title>{pageTitle}</title>
  </head>
  <body>
    <a href="#main" class="skip-link">Vai al contenuto</a>
    <Header />
    <main id="main">
      <slot />
    </main>
    <Footer />
  </body>
</html>

<style is:global>
  :root {
    /* Design system: Soft UI Evolution — Studio Marchetti */
    --color-primary: #8B5CF6;
    --color-secondary: #C4B5FD;
    --color-cta: #10B981;
    --color-cta-hover: #059669;
    --color-bg: #FAF5FF;
    --color-surface: #FFFFFF;
    --color-text: #4C1D95;
    --color-muted: #6D5A8C;
    --color-border: #E9DDFB;

    --font-heading: 'Lora', Georgia, serif;
    --font-body: 'Raleway', system-ui, -apple-system, sans-serif;

    /* Spacing scale */
    --space-xs: 0.25rem;  /* 4px */
    --space-sm: 0.5rem;   /* 8px */
    --space-md: 1rem;     /* 16px */
    --space-lg: 1.5rem;   /* 24px */
    --space-xl: 2rem;     /* 32px */
    --space-2xl: 3rem;    /* 48px */
    --space-3xl: 4rem;    /* 64px */

    /* Shadow scale */
    --shadow-sm: 0 1px 2px rgba(76, 29, 149, 0.05);
    --shadow-md: 0 4px 6px rgba(76, 29, 149, 0.08);
    --shadow-lg: 0 10px 15px rgba(76, 29, 149, 0.10);
    --shadow-xl: 0 20px 25px rgba(76, 29, 149, 0.12);

    --radius-sm: 6px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;

    --max-width: 1100px;
    --transition: 200ms ease;
  }

  *, *::before, *::after { box-sizing: border-box; }

  html, body {
    margin: 0;
    padding: 0;
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    width: 100%;
    max-width: var(--max-width);
    margin: 0 auto;
    padding: var(--space-xl) var(--space-lg);
  }

  a {
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color var(--transition);
  }

  a:hover { color: var(--color-cta); }

  h1, h2, h3, h4 {
    font-family: var(--font-heading);
    color: var(--color-text);
    line-height: 1.2;
    margin: 0 0 var(--space-md);
    font-weight: 600;
  }

  h1 { font-size: clamp(2rem, 5vw, 3rem); }
  h2 { font-size: clamp(1.5rem, 3vw, 2rem); }
  h3 { font-size: 1.25rem; }

  p { margin: 0 0 var(--space-md); }

  button, .btn-primary, .btn-secondary { cursor: pointer; }

  :focus-visible {
    outline: 3px solid var(--color-primary);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }

  .skip-link {
    position: absolute;
    left: -9999px;
    top: 0;
    background: var(--color-primary);
    color: #fff;
    padding: var(--space-sm) var(--space-md);
    border-radius: 0 0 var(--radius-md) 0;
    text-decoration: none;
    z-index: 100;
  }
  .skip-link:focus { left: 0; color: #fff; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
</style>
```

- [ ] **Step 2: Verificare build**

Run: `make build`
Expected: FAIL (Header/Footer non esistono). Errore atteso su import Header. Build risale a verde a Task 5.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "refactor(layout): apply ui-ux-pro-max design system (Soft UI Evolution)

- Palette lavender + wellness green
- Lora + Raleway via Google Fonts
- Spacing/shadow scale tokens
- Skip-link, focus-visible, prefers-reduced-motion"
```

---

## Task 4: Header component

**Files:**
- Create: `src/components/Header.astro`

- [ ] **Step 1: Creare `src/components/Header.astro`**

```astro
---
import { profilo } from '../data/profilo.ts';

const path = Astro.url.pathname;
const isActive = (href: string) =>
  href === '/' ? path === '/' : path.startsWith(href);

const links = [
  { href: '/', label: 'Home' },
  { href: '/chi-sono', label: 'Chi sono' },
  { href: '/servizi', label: 'Servizi' },
  { href: '/contatti', label: 'Contatti' },
];
---
<header class="site-header">
  <div class="inner">
    <a href="/" class="brand" aria-label={`Home — ${profilo.nome}`}>
      <span class="brand-mark" aria-hidden="true">ψ</span>
      <span class="brand-text">
        <span class="brand-name">{profilo.nome}</span>
        <span class="brand-role">{profilo.titolo}</span>
      </span>
    </a>
    <nav aria-label="Principale">
      <ul>
        {links.map((l) => (
          <li>
            <a
              href={l.href}
              aria-current={isActive(l.href) ? 'page' : undefined}
              class:list={[{ active: isActive(l.href) }]}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </div>
</header>

<style>
  .site-header {
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    box-shadow: var(--shadow-sm);
  }

  .inner {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: var(--space-md) var(--space-lg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-lg);
    flex-wrap: wrap;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    text-decoration: none;
    color: var(--color-text);
    cursor: pointer;
  }

  .brand-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--color-primary);
    color: #fff;
    border-radius: var(--radius-md);
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 700;
    box-shadow: var(--shadow-md);
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .brand-name {
    font-family: var(--font-heading);
    font-size: 1rem;
    font-weight: 600;
  }

  .brand-role {
    font-size: 0.8rem;
    color: var(--color-muted);
  }

  nav ul {
    display: flex;
    gap: var(--space-lg);
    list-style: none;
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
  }

  nav a {
    color: var(--color-text);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    padding: var(--space-xs) 0;
    border-bottom: 2px solid transparent;
    transition: color var(--transition), border-color var(--transition);
    cursor: pointer;
  }

  nav a:hover { color: var(--color-primary); border-bottom-color: var(--color-primary); }
  nav a.active { color: var(--color-primary); border-bottom-color: var(--color-primary); font-weight: 600; }

  @media (max-width: 640px) {
    .inner { flex-direction: column; align-items: flex-start; }
    nav ul { gap: var(--space-md); }
  }
</style>
```

- [ ] **Step 2: Verificare build**

Run: `make build`
Expected: ancora FAIL (manca Footer). Errore solo su import Footer.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat(components): add Header with brand mark + nav (design system)"
```

---

## Task 5: Footer component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Creare `src/components/Footer.astro`**

```astro
---
import { profilo } from '../data/profilo.ts';
const anno = new Date().getFullYear();
---
<footer class="site-footer">
  <div class="inner">
    <div class="col">
      <strong class="name">{profilo.nome}</strong>
      <span>{profilo.titolo}</span>
      <span class="muted">{profilo.albo}</span>
    </div>
    <div class="col">
      <a href={`mailto:${profilo.email}`}>{profilo.email}</a>
      <a href={`tel:${profilo.tel}`}>{profilo.telDisplay}</a>
      <span>{profilo.indirizzo.via} — {profilo.indirizzo.cap} {profilo.indirizzo.citta}</span>
    </div>
    <div class="col copyright">
      <span>© {anno} {profilo.nome}</span>
      <span class="muted">P.IVA placeholder</span>
      <span class="muted">Tutti i diritti riservati</span>
    </div>
  </div>
</footer>

<style>
  .site-footer {
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    margin-top: var(--space-3xl);
  }

  .inner {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: var(--space-xl) var(--space-lg);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-lg);
    font-size: 0.9rem;
  }

  .col { display: flex; flex-direction: column; gap: var(--space-xs); }
  .name { font-family: var(--font-heading); font-size: 1rem; }
  .muted { color: var(--color-muted); font-size: 0.85rem; }
  .copyright { align-items: flex-end; text-align: right; }

  .col a {
    color: var(--color-text);
    text-decoration: none;
    transition: color var(--transition);
  }
  .col a:hover { color: var(--color-primary); text-decoration: underline; }

  @media (max-width: 768px) {
    .inner { grid-template-columns: 1fr; }
    .copyright { align-items: flex-start; text-align: left; }
  }
</style>
```

- [ ] **Step 2: Verificare build**

Run: `make build`
Expected: exit code 0 (Header + Footer ora disponibili per Base).

- [ ] **Step 3: Smoke visivo**

Browser su http://localhost:4321
- Header: brand mark "ψ" su lavender, nome + titolo, nav 4 link
- Hover nav: testo lavender + border-bottom lavender
- Footer: 3 colonne, palette coerente
- Sfondo lavender chiaro (`#FAF5FF`)
- Font: Lora visibile su headings, Raleway su body

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat(components): add Footer (design system)"
```

---

## Task 6: ContactInfo component

**Files:**
- Create: `src/components/ContactInfo.astro`

- [ ] **Step 1: Creare `src/components/ContactInfo.astro`**

```astro
---
import { profilo } from '../data/profilo.ts';

interface Props {
  variant?: 'full' | 'compact';
}

const { variant = 'full' } = Astro.props;
const whatsappUrl = `https://wa.me/${profilo.whatsapp}`;

const iconMail = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
const iconPhone = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const iconWhatsapp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;
const iconPin = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`;
const iconClock = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
---
<div class:list={["contact-info", `contact-${variant}`]}>
  <div class="row">
    <span class="ico" set:html={iconMail} />
    <span class="label">Email</span>
    <a href={`mailto:${profilo.email}`} aria-label={`Scrivi a ${profilo.email}`}>{profilo.email}</a>
  </div>
  <div class="row">
    <span class="ico" set:html={iconPhone} />
    <span class="label">Telefono</span>
    <a href={`tel:${profilo.tel}`} aria-label={`Chiama ${profilo.telDisplay}`}>{profilo.telDisplay}</a>
  </div>
  <div class="row">
    <span class="ico" set:html={iconWhatsapp} />
    <span class="label">WhatsApp</span>
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Scrivi su WhatsApp">Scrivi su WhatsApp</a>
  </div>
  <div class="row">
    <span class="ico" set:html={iconPin} />
    <span class="label">Indirizzo</span>
    <span>{profilo.indirizzo.via} — {profilo.indirizzo.cap} {profilo.indirizzo.citta}</span>
  </div>
  {variant === 'full' && (
    <div class="row">
      <span class="ico" set:html={iconClock} />
      <span class="label">Orari</span>
      <span>{profilo.orari}</span>
    </div>
  )}
</div>

<style>
  .contact-info { display: flex; flex-direction: column; gap: var(--space-md); }

  .row {
    display: grid;
    grid-template-columns: 24px 110px 1fr;
    gap: var(--space-md);
    align-items: center;
  }

  .ico {
    width: 24px;
    height: 24px;
    color: var(--color-primary);
    display: inline-flex;
  }
  .ico :global(svg) { width: 100%; height: 100%; }

  .label {
    color: var(--color-muted);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
  }

  .contact-compact .row { grid-template-columns: 24px 1fr; }
  .contact-compact .label { display: none; }

  a {
    color: var(--color-text);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: color var(--transition), border-color var(--transition);
  }
  a:hover { color: var(--color-primary); border-bottom-color: var(--color-primary); }

  @media (max-width: 480px) {
    .row { grid-template-columns: 24px 1fr; }
    .label { display: none; }
  }
</style>
```

- [ ] **Step 2: Verificare build**

Run: `make build`
Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/ContactInfo.astro
git commit -m "feat(components): add ContactInfo with SVG icons + variants"
```

---

## Task 7: Hero component

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Creare `src/components/Hero.astro`**

```astro
---
interface Cta {
  label: string;
  href: string;
}

interface Props {
  title: string;
  sub?: string;
  cta?: Cta;
  variant?: 'default' | 'compact';
}

const { title, sub, cta, variant = 'default' } = Astro.props;
---
<section class:list={["hero", `hero-${variant}`]}>
  <h1>{title}</h1>
  {sub && <p class="sub">{sub}</p>}
  {cta && (
    <a class="btn-primary" href={cta.href}>{cta.label}</a>
  )}
</section>

<style>
  .hero {
    padding: var(--space-3xl) 0 var(--space-2xl);
    border-bottom: 1px solid var(--color-border);
    margin-bottom: var(--space-2xl);
  }

  .hero-compact {
    padding: var(--space-2xl) 0 var(--space-lg);
    margin-bottom: var(--space-xl);
  }

  .sub {
    font-size: 1.15rem;
    color: var(--color-muted);
    max-width: 65ch;
    line-height: 1.7;
  }

  .btn-primary {
    display: inline-block;
    margin-top: var(--space-lg);
    padding: 14px 28px;
    background: var(--color-cta);
    color: #fff;
    text-decoration: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 1rem;
    box-shadow: var(--shadow-md);
    transition: background var(--transition), box-shadow var(--transition), transform var(--transition);
    cursor: pointer;
  }

  .btn-primary:hover {
    background: var(--color-cta-hover);
    box-shadow: var(--shadow-lg);
    transform: translateY(-1px);
    color: #fff;
  }
</style>
```

- [ ] **Step 2: Verificare build**

Run: `make build`
Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat(components): add Hero with primary CTA button"
```

---

## Task 8: ServizioCard component (Soft UI Evolution)

**Files:**
- Create: `src/components/ServizioCard.astro`

> Card con icon lavender circle, ombra morbida, hover lift `translateY(-4px)` + shadow-lg. Niente scale (anti-pattern: layout shift).

- [ ] **Step 1: Creare `src/components/ServizioCard.astro`**

```astro
---
import type { Servizio } from '../data/servizi.ts';

interface Props {
  servizio: Servizio;
}

const { servizio } = Astro.props;
---
<article class="card" id={servizio.slug}>
  <div class="icon-wrap" set:html={servizio.icon} />
  <h3>{servizio.titolo}</h3>
  <p>{servizio.descrizioneBreve}</p>
</article>

<style>
  .card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-xl);
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    box-shadow: var(--shadow-sm);
    transition: box-shadow var(--transition), transform var(--transition), border-color var(--transition);
  }

  .card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-4px);
    border-color: var(--color-secondary);
  }

  .icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: var(--radius-lg);
    background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
    color: #fff;
    box-shadow: var(--shadow-sm);
  }

  .icon-wrap :global(svg) { width: 28px; height: 28px; }

  h3 {
    margin: 0;
    font-size: 1.25rem;
  }

  p {
    color: var(--color-muted);
    margin: 0;
    line-height: 1.65;
  }
</style>
```

- [ ] **Step 2: Verificare build**

Run: `make build`
Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/ServizioCard.astro
git commit -m "feat(components): add ServizioCard with gradient icon + hover lift"
```

---

## Task 9: Home page

**Files:**
- Modify: `src/pages/index.astro` (rewrite completo)

- [ ] **Step 1: Sovrascrivere `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import ServizioCard from '../components/ServizioCard.astro';
import { profilo } from '../data/profilo.ts';
import { serviziTop } from '../data/servizi.ts';

const nomeBreve = profilo.nome.replace(/^Dott\.ssa |^Dott\. /, '');
---
<Base
  title="Home"
  description={`${profilo.nome} — Psicoterapia a ${profilo.indirizzo.citta} e online. Ansia, depressione, coppia, adolescenti, EMDR.`}
>
  <Hero
    title="Uno spazio per ascoltarti."
    sub="Psicoterapia individuale, di coppia e per adolescenti. In studio a Milano o online. Primo colloquio gratuito."
    cta={{ label: 'Prenota un primo colloquio', href: '/contatti' }}
  />

  <section class="intro">
    <h2>Ciao, sono {nomeBreve}.</h2>
    <p>
      Sono psicologa psicoterapeuta iscritta all'Ordine degli Psicologi della Lombardia.
      Il primo colloquio è gratuito e serve a conoscerci: nessun obbligo, solo
      l'occasione per capire se possiamo lavorare insieme.
    </p>
    <a href="/chi-sono" class="link-more">Scopri il mio approccio →</a>
  </section>

  <section class="servizi-top">
    <h2>Aree di intervento principali</h2>
    <p class="lead">Approcci integrati per le difficoltà più frequenti.</p>
    <div class="grid">
      {serviziTop.map((s) => <ServizioCard servizio={s} />)}
    </div>
    <a href="/servizi" class="link-more">Vedi tutti i servizi →</a>
  </section>

  <section class="cta-band">
    <div class="cta-inner">
      <div>
        <h2>Iniziamo con un primo colloquio.</h2>
        <p>Conoscitivo, gratuito, senza impegno. Dura 50 minuti.</p>
      </div>
      <a href="/contatti" class="btn-cta">Contattami ora</a>
    </div>
  </section>
</Base>

<style>
  .intro {
    margin: 0 0 var(--space-3xl);
    max-width: 65ch;
  }

  .servizi-top { margin-bottom: var(--space-3xl); }

  .lead {
    color: var(--color-muted);
    margin-top: calc(var(--space-md) * -1);
    margin-bottom: var(--space-xl);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-lg);
    margin: var(--space-lg) 0;
  }

  .link-more {
    display: inline-block;
    margin-top: var(--space-md);
    font-weight: 600;
    color: var(--color-primary);
    text-decoration: none;
    transition: color var(--transition);
  }
  .link-more:hover { color: var(--color-cta); }

  .cta-band {
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    border-radius: var(--radius-xl);
    padding: var(--space-2xl);
    margin-top: var(--space-2xl);
    color: #fff;
    box-shadow: var(--shadow-lg);
  }
  .cta-band h2, .cta-band p { color: #fff; }
  .cta-band p { opacity: 0.95; margin: 0; }

  .cta-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-xl);
    flex-wrap: wrap;
  }

  .btn-cta {
    display: inline-block;
    padding: 14px 28px;
    background: var(--color-cta);
    color: #fff;
    text-decoration: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    box-shadow: var(--shadow-md);
    transition: background var(--transition), transform var(--transition);
    cursor: pointer;
  }
  .btn-cta:hover { background: var(--color-cta-hover); transform: translateY(-1px); color: #fff; }
</style>
```

- [ ] **Step 2: Verificare build**

Run: `make build`
Expected: exit code 0, `dist/index.html` generato.

- [ ] **Step 3: Smoke visivo**

http://localhost:4321
- Hero con titolo "Uno spazio per ascoltarti." + sub + bottone verde
- Intro saluto
- 3 card servizi con icon gradient lavender→viola, hover lift
- Band CTA viola con bottone verde

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(pages): rewrite home with hero + services + gradient CTA band"
```

---

## Task 10: Chi sono page

**Files:**
- Create: `src/pages/chi-sono.astro`

- [ ] **Step 1: Creare `src/pages/chi-sono.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import { profilo } from '../data/profilo.ts';
---
<Base
  title="Chi sono"
  description={`Bio e approccio di ${profilo.nome}, psicoterapeuta a ${profilo.indirizzo.citta}.`}
>
  <Hero
    title="Chi sono"
    sub={profilo.titolo}
    variant="compact"
  />

  <section class="bio">
    <h2>La mia storia professionale</h2>
    <p>{profilo.bio}</p>
  </section>

  <section class="formazione">
    <h2>Formazione</h2>
    <ul>
      {profilo.formazione.map((f) => <li>{f}</li>)}
    </ul>
  </section>

  <section class="approccio">
    <h2>Il mio approccio</h2>
    <p>{profilo.approccio}</p>
  </section>

  <section class="cta-block">
    <h2>Vuoi sapere come lavoriamo?</h2>
    <p>Il primo colloquio è gratuito e senza impegno.</p>
    <a href="/contatti" class="btn-cta">Contattami</a>
  </section>
</Base>

<style>
  section { max-width: 70ch; margin-bottom: var(--space-2xl); }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  ul li {
    padding-left: var(--space-lg);
    position: relative;
    line-height: 1.6;
  }

  ul li::before {
    content: "▸";
    color: var(--color-primary);
    position: absolute;
    left: 0;
    top: 0;
  }

  .cta-block {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-2xl);
    text-align: center;
    max-width: none;
    box-shadow: var(--shadow-md);
  }

  .btn-cta {
    display: inline-block;
    margin-top: var(--space-md);
    padding: 14px 28px;
    background: var(--color-cta);
    color: #fff;
    text-decoration: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    box-shadow: var(--shadow-md);
    transition: background var(--transition), transform var(--transition);
    cursor: pointer;
  }
  .btn-cta:hover { background: var(--color-cta-hover); transform: translateY(-1px); color: #fff; }
</style>
```

- [ ] **Step 2: Verificare build**

Run: `make build`
Expected: exit code 0, `dist/chi-sono/index.html` generato.

- [ ] **Step 3: Smoke visivo**

http://localhost:4321/chi-sono — bio, formazione (lista con triangoli lavender), approccio, blocco CTA finale.

- [ ] **Step 4: Commit**

```bash
git add src/pages/chi-sono.astro
git commit -m "feat(pages): add chi-sono"
```

---

## Task 11: Servizi page

**Files:**
- Create: `src/pages/servizi.astro`

- [ ] **Step 1: Creare `src/pages/servizi.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import { servizi } from '../data/servizi.ts';
---
<Base
  title="Servizi"
  description="Aree di intervento: ansia, depressione, terapia di coppia, adolescenti, EMDR, sedute online."
>
  <Hero
    title="Aree di intervento"
    sub="Percorsi personalizzati, costruiti sulle tue esigenze. Ogni terapia parte da un primo colloquio gratuito."
    variant="compact"
  />

  <div class="lista">
    {servizi.map((s) => (
      <article class="servizio" id={s.slug}>
        <div class="icon-wrap" set:html={s.icon} />
        <div class="body">
          <h2>{s.titolo}</h2>
          <p>{s.descrizioneEstesa}</p>
        </div>
      </article>
    ))}
  </div>

  <section class="cta-block">
    <h2>Non sai da dove iniziare?</h2>
    <p>Il primo colloquio gratuito ci aiuta a capire insieme il percorso più adatto.</p>
    <a href="/contatti" class="btn-cta">Prenota ora</a>
  </section>
</Base>

<style>
  .lista {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    margin-bottom: var(--space-2xl);
  }

  .servizio {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: var(--space-xl);
    padding: var(--space-xl);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    align-items: start;
    transition: box-shadow var(--transition), border-color var(--transition);
  }

  .servizio:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--color-secondary);
  }

  .icon-wrap {
    width: 64px;
    height: 64px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-lg);
    background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
    color: #fff;
    box-shadow: var(--shadow-sm);
  }
  .icon-wrap :global(svg) { width: 32px; height: 32px; }

  .servizio h2 {
    margin: 0 0 var(--space-sm);
    font-size: 1.35rem;
  }
  .servizio p {
    color: var(--color-muted);
    margin: 0;
    line-height: 1.7;
  }

  .cta-block {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-2xl);
    text-align: center;
    box-shadow: var(--shadow-md);
  }

  .btn-cta {
    display: inline-block;
    margin-top: var(--space-md);
    padding: 14px 28px;
    background: var(--color-cta);
    color: #fff;
    text-decoration: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    box-shadow: var(--shadow-md);
    transition: background var(--transition), transform var(--transition);
    cursor: pointer;
  }
  .btn-cta:hover { background: var(--color-cta-hover); transform: translateY(-1px); color: #fff; }

  @media (max-width: 600px) {
    .servizio { grid-template-columns: 1fr; gap: var(--space-md); }
  }
</style>
```

- [ ] **Step 2: Verificare build**

Run: `make build`
Expected: exit code 0.

- [ ] **Step 3: Smoke visivo**

http://localhost:4321/servizi — 6 card servizi con icon gradient + testo dettagliato.

- [ ] **Step 4: Commit**

```bash
git add src/pages/servizi.astro
git commit -m "feat(pages): add servizi list (design system)"
```

---

## Task 12: Contatti page

**Files:**
- Create: `src/pages/contatti.astro`

- [ ] **Step 1: Creare `src/pages/contatti.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import ContactInfo from '../components/ContactInfo.astro';
import { profilo } from '../data/profilo.ts';

const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${profilo.indirizzo.via}, ${profilo.indirizzo.cap} ${profilo.indirizzo.citta}`
)}`;
---
<Base
  title="Contatti"
  description={`Come contattare ${profilo.nome}: email, telefono, WhatsApp, sede a ${profilo.indirizzo.citta}.`}
>
  <Hero
    title="Contatti"
    sub="Scrivimi o chiamami: rispondo entro 24 ore nei giorni lavorativi."
    variant="compact"
  />

  <div class="grid">
    <section class="card-pane">
      <h2>Come raggiungermi</h2>
      <ContactInfo variant="full" />
    </section>

    <section class="card-pane">
      <h2>Dove sono</h2>
      <iframe
        src={profilo.mapsEmbedUrl}
        title={`Mappa studio ${profilo.nome}`}
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
      <p class="fallback">
        <a href={mapsLink} target="_blank" rel="noopener noreferrer">
          Apri in Google Maps →
        </a>
      </p>
    </section>
  </div>

  <section class="nota">
    <h2>Prima del primo contatto</h2>
    <p>
      Se preferisci, puoi anticiparmi nella prima email/messaggio una breve
      descrizione di ciò che ti porta a cercare un percorso. Non è necessario,
      ma può aiutarci a preparare meglio il primo colloquio. Tutte le
      comunicazioni sono coperte da segreto professionale.
    </p>
  </section>
</Base>

<style>
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
    margin-bottom: var(--space-2xl);
  }

  .card-pane {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-xl);
    box-shadow: var(--shadow-sm);
  }

  iframe {
    width: 100%;
    height: 320px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .fallback {
    margin-top: var(--space-sm);
    font-size: 0.9rem;
  }

  .nota {
    max-width: 70ch;
    margin-bottom: var(--space-2xl);
  }

  @media (max-width: 768px) {
    .grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2: Verificare build**

Run: `make build`
Expected: exit code 0.

- [ ] **Step 3: Smoke visivo**

http://localhost:4321/contatti
- 2 card-pane (contatti + mappa)
- Click email/tel/WhatsApp funzionanti
- Mappa carica (placeholder Milano)
- Hover su link cambia colore lavender→verde

- [ ] **Step 4: Commit**

```bash
git add src/pages/contatti.astro
git commit -m "feat(pages): add contatti with maps iframe"
```

---

## Task 13: 404 page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Creare `src/pages/404.astro`**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Pagina non trovata">
  <section class="notfound">
    <h1>404</h1>
    <p>La pagina che cerchi non esiste o è stata spostata.</p>
    <a href="/" class="btn-cta">Torna alla home</a>
  </section>
</Base>

<style>
  .notfound {
    text-align: center;
    padding: var(--space-3xl) 0;
  }
  .notfound h1 {
    font-size: clamp(4rem, 12vw, 7rem);
    margin-bottom: var(--space-sm);
    background: linear-gradient(135deg, var(--color-primary), var(--color-cta));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .btn-cta {
    display: inline-block;
    margin-top: var(--space-lg);
    padding: 14px 28px;
    background: var(--color-cta);
    color: #fff;
    text-decoration: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    box-shadow: var(--shadow-md);
    transition: background var(--transition), transform var(--transition);
    cursor: pointer;
  }
  .btn-cta:hover { background: var(--color-cta-hover); transform: translateY(-1px); color: #fff; }
</style>
```

- [ ] **Step 2: Verificare build**

Run: `make build`
Expected: exit code 0, `dist/404.html` generato.

- [ ] **Step 3: Smoke visivo**

http://localhost:4321/percorso-inesistente — 404 con titolo gradient lavender→green.

- [ ] **Step 4: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat(pages): add custom 404 with gradient title"
```

---

## Task 14: OG image + build finale + checklist

**Files:**
- Create: `public/og-default.svg`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Creare `public/og-default.svg`**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#C4B5FD"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="280" text-anchor="middle" font-family="Georgia, serif" font-size="64" font-weight="700" fill="#fff">Dott.ssa Elena Marchetti</text>
  <text x="600" y="360" text-anchor="middle" font-family="system-ui, sans-serif" font-size="36" fill="rgba(255,255,255,0.95)">Psicologa Psicoterapeuta</text>
  <rect x="475" y="420" width="250" height="6" rx="3" fill="#10B981"/>
  <text x="600" y="490" text-anchor="middle" font-family="system-ui, sans-serif" font-size="26" fill="rgba(255,255,255,0.8)">Milano · Online</text>
</svg>
```

- [ ] **Step 2: Build finale completo**

Run: `make build`
Expected: exit code 0. Output deve contenere:
- `dist/index.html`
- `dist/chi-sono/index.html`
- `dist/servizi/index.html`
- `dist/contatti/index.html`
- `dist/404.html`
- `dist/favicon.svg`, `dist/og-default.svg`

Run: `ls dist/ && find dist -name "*.html"`
Verifica struttura.

- [ ] **Step 3: Design system pre-delivery checklist**

Verifica nel browser (DevTools):
- [ ] No emoji usato come icona UI (tutti SVG)
- [ ] Tutti gli elementi cliccabili hanno `cursor: pointer`
- [ ] Hover smooth (200ms) su nav, card, bottoni
- [ ] Contrasto testo principale: `#4C1D95` su `#FAF5FF` ≥ 4.5:1 (verificare con Lighthouse o axe)
- [ ] Focus visibile: Tab navigation mostra outline lavender 3px
- [ ] `prefers-reduced-motion`: in DevTools → Rendering → Emulate CSS media feature → reduce, transizioni quasi azzerate
- [ ] Responsive ai breakpoint: 375px, 768px, 1024px, 1440px (DevTools toolbar)
- [ ] No horizontal scroll a 375px
- [ ] Lighthouse score ≥90 su Performance/SEO/A11y/Best Practices

- [ ] **Step 4: Smoke visivo finale tutte pagine**

- [ ] `/` — hero + intro + 3 servizi + band CTA
- [ ] `/chi-sono` — bio + formazione + approccio
- [ ] `/servizi` — 6 servizi con icon gradient
- [ ] `/contatti` — info + mappa
- [ ] `/inesistente` → 404 gradient
- [ ] Nav active state cambia per pagina
- [ ] Link mailto/tel/whatsapp funzionano
- [ ] Skip-link appare su Tab dalla home (prima focus action)

- [ ] **Step 5: Aggiornare `CLAUDE.md`**

Sostituire sezione "Stato repo" + "Decisioni prese":

```markdown
## Stato repo
- Git init locale (branch `main`)
- Implementazione iniziale completata: 4 pagine + 404 + componenti + data layer
- Design system "Soft UI Evolution" applicato (ui-ux-pro-max skill)
- Build statico verificato: `make build` → `dist/` pronto per GitHub Pages
- Nessun remote configurato (push manuale utente)

## Decisioni prese
- ✅ Stack: Astro 5
- ✅ Repo: git init locale, no remote
- ✅ Contenuto: vetrina psicologa (placeholder credibili — Dott.ssa Elena Marchetti)
- ✅ Multi-pagina, 4 pagine core + 404
- ✅ Contatti: solo info (mailto/tel/whatsapp + mappa iframe)
- ✅ Design system: lavender (#8B5CF6) + wellness green (#10B981), Lora + Raleway
- ✅ Anti-pattern rispettati: no emoji icons (SVG Lucide), no neon, no dark mode
- ⏳ Dati reali professionista: da sostituire prima del deploy
- ⏳ `astro.config.mjs` `site` + `base`: da scommentare prima del deploy GitHub Pages
```

- [ ] **Step 6: Commit finale**

```bash
git add public/og-default.svg CLAUDE.md
git commit -m "feat: add OG image with brand gradient + finalize scaffold

All 4 pages + 404 functional. Design system applied. Build verified."
```

- [ ] **Step 7: Verifica stato finale**

Run: `git log --oneline`
Expected: ~14 commit, uno per task.

Run: `git status`
Expected: clean working tree.

---

## Definition of Done

- [ ] `make build` exit 0 senza warning critici
- [ ] 5 HTML in `dist/` (index, chi-sono, servizi, contatti, 404)
- [ ] Tutte le pagine navigabili in dev, link funzionanti
- [ ] Mappa carica, link mailto/tel/whatsapp funzionano
- [ ] Mobile responsive 375px (no overflow)
- [ ] Console browser pulita
- [ ] Lighthouse A11y ≥90
- [ ] Design system MASTER.md rispettato (palette, font, anti-pattern)
- [ ] Skip-link funzionante via Tab
- [ ] `prefers-reduced-motion` rispettato
- [ ] CLAUDE.md aggiornato
- [ ] Working tree clean

## Note per futuri sviluppi

- Sostituire dati placeholder in `src/data/profilo.ts` con dati reali
- Configurare `site` + `base` in `astro.config.mjs` per GitHub Pages
- Considerare `@fontsource/lora` + `@fontsource/raleway` per self-host font (no CDN, no privacy issue)
- Eventuale pagina dettaglio servizio: `src/pages/servizi/[slug].astro` con `getStaticPaths`
- Aggiungere foto profilo professionista (`public/profilo.jpg`) e usarla in `/chi-sono`
- Lighthouse audit completo prima del deploy
