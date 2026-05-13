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
  whatsapp: string;
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
