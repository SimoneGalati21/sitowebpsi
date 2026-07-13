export interface Indirizzo {
  via: string;
  citta: string;
  cap: string;
}

export interface Profilo {
  nome: string;
  titolo: string;
  albo: string;
  /** Lasciare "" per nascondere la riga/link nei componenti. */
  email: string;
  tel: string;
  telDisplay: string;
  whatsapp: string;
  instagram: string;
  /** P.IVA per il footer. Lasciare "" per nasconderla. */
  piva: string;
  /** Sede principale usata per mappa e footer. */
  indirizzo: Indirizzo;
  /** Elenco sedi/modalità mostrate nei contatti. */
  sedi: string[];
  orari: string;
  bio: string;
  formazione: string[];
  approccio: string;
  mapsEmbedUrl: string;
}

export const profilo: Profilo = {
  nome: "Dott.ssa Annamaria Cosentino",
  titolo: "Psicologa Psicoterapeuta",
  albo: "Ordine degli Psicologi della Calabria n° 2314",
  email: "psicologa.cosentino@gmail.com",
  tel: "+393275504342",
  telDisplay: "+39 327 550 4342",
  whatsapp: "393275504342",
  instagram: "https://www.instagram.com/annamariacosentino_psicologa/",
  // ⏳ P.IVA da fornire prima del deploy — lasciata vuota: il footer nasconde la riga.
  piva: "",
  indirizzo: {
    via: "Corso Italia 62",
    citta: "Filadelfia (VV)",
    cap: "89814",
  },
  sedi: [
    "Online — videochiamata sicura",
    "Sambiase, Lamezia Terme (CZ)",
    "Filadelfia (VV) — Corso Italia 62",
  ],
  orari: "Su appuntamento",
  bio: "Sono Annamaria Cosentino, psicologa psicoterapeuta a orientamento cognitivo-comportamentale, iscritta all'Ordine degli Psicologi della Calabria. Mi sono laureata in Psicologia Clinica e della Salute nel ciclo di vita presso l'Università degli Studi di Messina, con il massimo dei voti e la lode. Ho scelto questa professione perché credo nel valore delle relazioni di cura e nel loro potere trasformativo. Nel mio lavoro accompagno adulti e coppie in percorsi costruiti sulla persona, fondati sull'ascolto, sul rispetto dei tempi di ciascuno e su strumenti concreti per affrontare le difficoltà del quotidiano.",
  formazione: [
    "Laurea in Psicologia Clinica e della Salute nel ciclo di vita — Università degli Studi di Messina (110 e lode)",
    "Iscritta all'Ordine degli Psicologi della Calabria (n° 2314)",
    "Orientamento clinico Cognitivo-Comportamentale",
  ],
  approccio: "Il percorso parte da un primo colloquio conoscitivo, in cui capiamo insieme le tue esigenze e se possiamo lavorare bene insieme. Utilizzo un approccio cognitivo-comportamentale, orientato a strumenti concreti e verificabili: riconoscere i pensieri e i comportamenti che alimentano il disagio e costruire strategie efficaci nella vita di tutti i giorni. Ricevo in studio a Filadelfia e a Sambiase (Lamezia Terme) e online in videochiamata sicura, per adattarmi ai tuoi tempi e ai tuoi spostamenti.",
  mapsEmbedUrl: "https://www.google.com/maps?q=Corso+Italia+62,+89814+Filadelfia+VV&output=embed",
};
