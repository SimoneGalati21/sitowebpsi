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
    titolo: "Ansia, panico e DOC",
    descrizioneBreve: "Affrontare ansia generalizzata, attacchi di panico, fobie e disturbo ossessivo-compulsivo con strumenti concreti.",
    descrizioneEstesa: "Lavoriamo insieme per comprendere i meccanismi che alimentano l'ansia, riconoscere i pensieri automatici e sviluppare strategie cognitivo-comportamentali efficaci. Il percorso include tecniche di rilassamento, esposizione graduale e ristrutturazione cognitiva.",
    icon: svgWrap(`<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>`),
  },
  {
    slug: "depressione",
    titolo: "Depressione e umore",
    descrizioneBreve: "Sostegno nei momenti di tristezza profonda, apatia e perdita di motivazione.",
    descrizioneEstesa: "Un percorso strutturato per ritrovare energia, senso e progettualità. Lavoriamo sui pensieri disfunzionali, sull'attivazione comportamentale e sulla riscoperta di attività significative, integrando elementi di mindfulness quando utile.",
    icon: svgWrap(`<path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/>`),
  },
  {
    slug: "coppia",
    titolo: "Terapia di coppia",
    descrizioneBreve: "Spazio di dialogo per coppie in crisi, momenti di transizione o desiderio di crescita condivisa.",
    descrizioneEstesa: "Un setting neutro e accogliente in cui entrambi i partner possono esprimersi e ascoltarsi. Lavoriamo su comunicazione, gestione dei conflitti, intimità e progetto comune, valorizzando le risorse della coppia.",
    icon: svgWrap(`<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/><path d="m18 15-2-2"/><path d="m15 18-2-2"/>`),
  },
  {
    slug: "autostima",
    titolo: "Autostima e crescita personale",
    descrizioneBreve: "Ritrovare fiducia in sé, chiarire i propri obiettivi e affrontare i momenti di transizione.",
    descrizioneEstesa: "Un percorso per conoscersi meglio, riconoscere le proprie risorse e i propri schemi, e affrontare passaggi di vita e scelte importanti. Lavoriamo su autostima, gestione delle emozioni e definizione di obiettivi realistici e significativi.",
    icon: svgWrap(`<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>`),
  },
  {
    slug: "trauma",
    titolo: "Trauma ed elaborazione del lutto",
    descrizioneBreve: "Rielaborare esperienze dolorose e affrontare la perdita in uno spazio sicuro.",
    descrizioneEstesa: "Uno spazio protetto per dare significato a esperienze difficili, traumi e lutti. Attraverso il lavoro cognitivo-comportamentale aiutiamo a ridurre l'impatto emotivo dei ricordi dolorosi, ritrovando gradualmente equilibrio e risorse nel presente.",
    icon: svgWrap(`<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>`),
  },
  {
    slug: "online",
    titolo: "Sedute online",
    descrizioneBreve: "Sedute via videochiamata sicura, ovunque tu sia.",
    descrizioneEstesa: "Per chi vive all'estero, ha orari complessi o preferisce la propria casa come spazio sicuro. Le sedute online seguono gli stessi standard professionali e deontologici di quelle in studio, su piattaforma criptata.",
    icon: svgWrap(`<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>`),
  },
];

export const serviziTop = servizi.slice(0, 3);
