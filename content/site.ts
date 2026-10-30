/**
 * content/site.ts — TOUT le contenu du site.
 *
 * Source : CONTENT.md (validé par les mariés). Ne pas reformuler les versets.
 * Les valeurs marquées TODO_MARIES sont à compléter (liste dans le README).
 *
 * Pour modifier un horaire, une adresse ou un texte : c'est ici, et nulle part ailleurs.
 */

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type SiteImage = {
  src: string; // ex. "/images/hero.webp"
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string; // généré par `npm run optimize-images`
};

export type Verse = {
  reference: string;
  title: string;
  text: string;
};

export type ProgrammeIcon =
  | "mosque"
  | "camera"
  | "door"
  | "utensils"
  | "cake"
  | "flower"
  | "images"
  | "music";

export type Venue = {
  id: "ceremonie" | "reception";
  title: string;
  time: string; // affichage, ex. "08 h 00"
  start: string; // ISO UTC (= heure d'Abidjan)
  end: string; // ISO UTC, utilisé seulement pour le fichier .ics
  place: string;
  landmark: string;
  /** Destination à saisir dans Yango (mention affichée tant que les coordonnées manquent) */
  yangoSearch: string;
  dressCode: string;
  mapsUrl: string | null; // TODO_MARIES — si null, une recherche Google Maps sur l'adresse est utilisée
  coordinates: { lat: number; lng: number } | null; // TODO_MARIES — active le bouton Yango
  icon: "mosque" | "utensils";
};

export type Contact = { label: string; whatsapp: string }; // label = numéro affiché ; whatsapp = format international sans +, ex. "2250700000000"

/* ------------------------------------------------------------------ */
/* Contenu                                                             */
/* ------------------------------------------------------------------ */

export const site = {
  identity: {
    groom: "Coulibaly Zié Aboubakar",
    bride: "Silué Aïchatou",
    monogram: "C&S.A²",
    groomFirstName: "Aboubakar",
    brideFirstName: "Aïchatou",
    displayNames: "Aboubakar & Aïchatou",
    dateLong: "Dimanche 29 novembre 2026",
    dateShort: "29.11.2026",
    city: "Abidjan (Abobo)",
    timezone: "Africa/Abidjan",
    /** Jour du mariage (date locale Abidjan = UTC) */
    weddingDay: "2026-11-29",
    /** Cible du compte à rebours */
    countdownTarget: "2026-11-29T08:00:00Z",
  },

  meta: {
    title: "Aboubakar & Aïchatou — 29 novembre 2026",
    description: "Nous nous marions. Vous êtes invités à célébrer notre union.",
  },

  nav: {
    home: "Accueil",
    ceremony: "Cérémonie",
    programme: "Programme",
    rsvp: "RSVP",
    story: "Notre histoire",
    gallery: "Galerie",
    gifts: "Cadeaux",
    faq: "FAQ",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
  },

  /** Ouverture : le site reste fermé par un parchemin scellé ; l'invité brise le sceau pour entrer */
  intro: {
    enabled: true,
    hint: "Touchez le sceau pour ouvrir",
    openLabel: "Briser le sceau et ouvrir l'invitation",
  },

  hero: {
    bismillahArabic: "بسم الله الرحمن الرحيم",
    bismillahTranslit: "Bismillahi ar-Rahmani ar-Rahim",
    verse: {
      reference: "Sourate Ar-Rum (30:21)",
      title: "Le miracle de l'amour",
      text: "« Et parmi Ses signes, Il a créé de vous, pour vous, des épouses afin que vous viviez en tranquillité avec elles et Il a mis entre vous de l'affection et de la bonté. »",
    } satisfies Verse,
    eyebrow: "Fotamanan !",
    title: "Nous nous marions",
    cta: "Confirmer votre présence",
    privacyNote: "Merci de ne pas partager ce lien",
    countdownLabels: { days: "Jours", hours: "Heures", minutes: "Minutes", seconds: "Secondes" },
    /** État « jour J » (BRIEF §7) */
    todayLabel: "C'est aujourd'hui",
    /** État « après » (BRIEF §7) */
    afterTitle: "Merci d'avoir partagé ce jour avec nous",
  },

  invitation: {
    verse: {
      reference: "Sourate An-Nisa (4:1)",
      title: "L'unité de la communauté humaine",
      text: "« Ô vous les gens ! Craignez votre Seigneur qui vous a créés d'une âme unique et qui a créé de celle-ci son épouse. »",
    } satisfies Verse,
    title: "Nous nous disons Oui !",
    text: "Coulibaly Zié Aboubakar et Silué Aïchatou ont la joie de vous inviter à célébrer leur union le dimanche 29 novembre 2026.",
    venues: [
      {
        id: "ceremonie",
        title: "Mariage religieux",
        time: "08 h 00",
        start: "2026-11-29T08:00:00Z",
        end: "2026-11-29T10:00:00Z",
        place: "Mosquée Aboubakar Sidik à Abobo derrière Rail",
        landmark: "Pharmacie Saint-Antoine (sur Yango)",
        yangoSearch: "Pharmacie Saint-Antoine",
        dressCode: "Tout en blanc",
        mapsUrl: "https://maps.app.goo.gl/En9NRTKftTCKtdxX7",
        coordinates: null, // TODO_MARIES — active le bouton Yango
        icon: "mosque",
      },
      {
        id: "reception",
        title: "Réception des convives",
        time: "13 h 00",
        start: "2026-11-29T13:00:00Z",
        end: "2026-11-29T19:00:00Z", // TODO_MARIES — heure de fin (fichier .ics uniquement)
        place: "Abobo Té Espace Événementiel N'Gouha, N° 90, Angoran",
        landmark: "Sur Yango",
        yangoSearch: "Abobo Té Espace Événementiel N'Gouha",
        dressCode: "Tout en blanc",
        mapsUrl: "https://maps.app.goo.gl/iRPMeKnKzG4yry2CA",
        coordinates: null, // TODO_MARIES
        icon: "utensils",
      },
    ] as Venue[],
    labels: {
      time: "Heure",
      place: "Lieu",
      landmark: "Repère",
      dressCodeBadge: "Dress code : tout en blanc",
      directions: "Itinéraire",
      yango: "Commander un Yango",
      yangoFallbackPrefix: "Sur Yango :",
      addToCalendar: "Ajouter au calendrier",
    },
  },

  dressCode: {
    label: "Dress code exigé",
    value: "Tout en blanc",
  },

  programme: {
    verse: {
      reference: "Sourate Al-Furqan (25:74)",
      title: "Une invocation pour la descendance",
      text: "« Seigneur, donne-nous, en nos épouses et nos descendants, la joie des yeux, et fais de nous un modèle pour les pieux. »",
    } satisfies Verse,
    title: "Programme de la journée",
    steps: [
      { time: "08 h 00", at: "08:00", label: "Mariage religieux à la mosquée", icon: "mosque" },
      { time: "10 h 00", at: "10:00", label: "Séance photos des mariés", icon: "camera" },
      { time: "12 h 00", at: "12:00", label: "Accueil et mise en place", icon: "door" },
      { time: "13 h 00", at: "13:00", label: "Réception et déjeuner", icon: "utensils" },
      { time: "15 h 00", at: "15:00", label: "Découpe du gâteau", icon: "cake" },
      { time: "16 h 30", at: "16:30", label: "Lancer du bouquet", icon: "flower" },
      { time: "17 h 00", at: "17:00", label: "Photos souvenirs", icon: "images" },
      { time: "17 h 30", at: "17:30", label: "Ouverture de la piste de danse", icon: "music" },
    ] satisfies { time: string; at: string; label: string; icon: ProgrammeIcon }[],
    closing: "Qu'Allah bénisse notre union et qu'Il vous comble de bienfaits.",
    nowLabel: "En cours",
  },

  rsvp: {
    title: "Confirmation de présence",
    // TODO_MARIES — date limite à confirmer (proposition : 15 novembre 2026)
    text: "Nous vous serions reconnaissants de confirmer votre présence avant le 15 novembre 2026.",
    /** Valeur par défaut si la variable d'environnement RSVP_DEADLINE est absente */
    deadlineDefault: "2026-11-15T23:59:00Z",
    success: "Merci ! Nous avons hâte de célébrer ce jour avec vous.",
    closed: "Les confirmations sont désormais closes. Merci à tous ceux qui ont répondu.",
    maxGuests: 5, // TODO_MARIES — nombre max. de personnes par réponse
    contacts: [
      { label: "+225 07 57 73 65 78", whatsapp: "2250757736578" },
      { label: "+225 07 48 78 92 22", whatsapp: "2250748789222" },
    ] as Contact[],
    contactsTitle: "Info line",
    /** Places par côté : chaque « Oui » retire son nombre de personnes (dernière réponse par numéro) */
    places: {
      capacity: { m: 100, mme: 150 },
      one: "place restante",
      many: "places restantes",
      full: "Complet",
      sides: { m: "Invités de M.", mme: "Invités de Mme" },
    },
    whatsappLabel: "WhatsApp",
    form: {
      name: "Nom complet",
      phone: "Téléphone (WhatsApp)",
      attending: "Serez-vous présent(e) ?",
      attendingYes: "Oui",
      attendingNo: "Non",
      guests: "Nombre de personnes",
      events: "Vous serez présent(e) à",
      eventsOptions: {
        ceremonie: "La cérémonie religieuse",
        reception: "La réception",
        "les-deux": "Les deux",
      },
      side: "Vous êtes invité(e) de",
      sideOptions: { m: "M. (Aboubakar)", mme: "Mme (Aïchatou)" },
      message: "Message aux mariés",
      optional: "facultatif",
      required: "obligatoire",
      submit: "Envoyer ma réponse",
      submitting: "Envoi en cours…",
      error: "Une erreur est survenue. Merci de réessayer.",
      rateLimited: "Trop de tentatives. Merci de réessayer dans quelques minutes.",
      errors: {
        name: "Merci d'indiquer votre nom complet.",
        phone: "Merci d'indiquer un numéro de téléphone valide.",
        attending: "Merci d'indiquer si vous serez présent(e).",
        guests: "Nombre de personnes invalide.",
        events: "Merci de choisir la ou les cérémonies.",
        message: "Votre message est trop long (1 000 caractères maximum).",
        side: "Merci d'indiquer de qui vous êtes l'invité(e).",
        notEnough: "Il ne reste que {n} place(s) de ce côté. Merci d'ajuster le nombre de personnes.",
        full: "Toutes les places de ce côté sont prises. Vous pouvez tout de même répondre « Non ».",
      },
    },
  },

  footer: {
    monogram: "C&S.A²",
    names: "Aboubakar & Aïchatou",
    date: "29.11.2026",
    blessing: "Qu'Allah bénisse notre union.",
  },

  admin: {
    title: "Réponses RSVP",
    loginTitle: "Espace des mariés",
    password: "Mot de passe",
    login: "Se connecter",
    logout: "Se déconnecter",
    wrongPassword: "Mot de passe incorrect.",
    notConfigured: "La variable ADMIN_PASSWORD n'est pas configurée sur Vercel.",
    dbError: "Impossible de lire la base de données. Vérifiez DATABASE_URL.",
    search: "Rechercher un nom ou un téléphone",
    searchButton: "Rechercher",
    export: "Export CSV",
    totals: {
      yes: "Oui",
      no: "Non",
      people: "Personnes attendues",
      ceremony: "Cérémonie religieuse",
      reception: "Réception",
    },
    bySide: "Par côté",
    sideStats: { yes: "oui", person: "personne", people: "personnes", remaining: "places restantes sur" },
    sides: {
      m: "Invités de M. (Aboubakar)",
      mme: "Invités de Mme (Aïchatou)",
      none: "Lien général",
    },
    sideFilter: "Côté",
    sideAll: "Tous",
    columns: {
      name: "Nom",
      phone: "Téléphone",
      attending: "Présence",
      guests: "Personnes",
      events: "Cérémonie(s)",
      message: "Message",
      side: "Invité de",
      date: "Date",
    },
    empty: "Aucune réponse pour le moment.",
  },

  /* ---------------------------------------------------------------- */
  /* Sections optionnelles — masquées tant qu'elles sont vides         */
  /* ---------------------------------------------------------------- */

  story: {
    enabled: false,
    title: "Notre histoire",
    paragraphs: [] as string[], // TODO_MARIES
  },

  gallery: {
    enabled: true,
    title: "Galerie",
    close: "Fermer",
    previous: "Photo précédente",
    next: "Photo suivante",
  },

  gifts: {
    enabled: false,
    title: "Liste de cadeaux",
    intro: "", // TODO_MARIES
    items: [] as { title: string; description?: string; url?: string; linkLabel?: string }[], // TODO_MARIES
  },

  faq: {
    enabled: false,
    title: "FAQ",
    items: [] as { question: string; answer: string }[], // TODO_MARIES
  },

  /* ---------------------------------------------------------------- */
  /* Photos — à renseigner APRÈS la mise en ligne (voir README)        */
  /* ---------------------------------------------------------------- */

  media: {
    hero: { src: "/images/couple-blanc.webp", alt: "Aboubakar et Aïchatou en chemise blanche et jean, debout côte à côte", width: 1024, height: 1535, blurDataURL: "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAwAgCdASoLABAAA4BaJQAB8ZoezfuA+j6LAAD++BVvrlRy0Z77OoKQ/EZtSaTC2RdrnkydqPRRH/11/X9yzEiib3/QOdfMnIrinbFfueJm6fbKVIAAAA==" } as SiteImage | null,
    invitation: null as SiteImage | null,
    story: null as SiteImage | null,
    gallery: [
      { src: "/images/couple-blanc.webp", alt: "Aboubakar et Aïchatou en chemise blanche et jean, debout côte à côte", width: 1024, height: 1535, blurDataURL: "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAwAgCdASoLABAAA4BaJQAB8ZoezfuA+j6LAAD++BVvrlRy0Z77OoKQ/EZtSaTC2RdrnkydqPRRH/11/X9yzEiib3/QOdfMnIrinbFfueJm6fbKVIAAAA==" },
      { src: "/images/couple-tenue-traditionnelle.webp", alt: "Aboubakar et Aïchatou en tenue traditionnelle jaune, Aboubakar enlaçant Aïchatou", width: 1024, height: 1535, blurDataURL: "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAQAgCdASoLABAAA4BaJbACdAYt9N8PakAAAN5YBliqC3TvPl2UwY1R6UQrDTxN+vlZFXtPJRZoJ+kQniZV5+V7KqPTYb3tpetSf8fAVvG/er8aQf7UNgyaqXIvs4AA" },
      { src: "/images/couple-bisou.webp", alt: "Aboubakar embrassant Aïchatou sur la joue, tous deux en chemise blanche", width: 1024, height: 1535, blurDataURL: "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAADwAQCdASoLABAAA4BaJQApgAY7jbFy46AA/uhuP/XCTrtm28/066mzzHtaLFpaF3dKJylYOeMgdGg6H2RnUwjl6gzqGgD1e/T4sAyGwOwe2TMA/Hf4kQPSyH/se6LaXB4AAA==" },
      { src: "/images/couple-portrait.webp", alt: "Portrait d'Aïchatou en robe beige et d'Aboubakar en veste bleue", width: 1024, height: 1535, blurDataURL: "data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAABQAgCdASoLABAAA4BaJaACdH8AgpicjMQ4M9AA/vKGYWfd8ghf30Dra/ds/2zLo/q22O47efFy5Aig3FD2MOpTSE5BsZNnZQFrN87mrPSDh7qc9cJS/r7+Mc5qchkDcgA1AFB20Kuery6ep23lsHAA" },
      { src: "/images/couple-tenue-soiree.webp", alt: "Aboubakar et Aïchatou enlacés, en tenue de soirée beige et bleue", width: 1025, height: 1535, blurDataURL: "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAQAgCdASoLABAAA4BaJQBOgMWHtlsgvywAAP70FOvt8YoFw/4m48HbwfsFH3bMCWQ7Yw246eXA4dYDuoQVHcX5/E4FcKlA++bx2NdnBUOfAAAA" },
    ] as SiteImage[],
    ogImage: null as SiteImage | null, // sinon image générée avec le monogramme
  },
};

export type Site = typeof site;
