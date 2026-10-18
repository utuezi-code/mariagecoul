# C&S.A² — Site de mariage

Site d'invitation privé de **Coulibaly Zié Aboubakar & Silué Aïchatou**, le **dimanche 29 novembre 2026** à Abidjan (Abobo).

Next.js 15 · Tailwind CSS v4 · Framer Motion · Lenis · Prisma + PostgreSQL (Neon) · Zod · hébergé sur Vercel.

> Documents de référence : [`CLAUDE.md`](CLAUDE.md) (règles techniques), [`BRIEF.md`](BRIEF.md) (direction artistique), [`CONTENT.md`](CONTENT.md) (textes validés).

---

## Sommaire

1. [Informations à compléter (TODO_MARIES)](#1-informations-à-compléter-todo_maries)
2. [Modifier un texte, un horaire, une adresse](#2-modifier-un-texte-un-horaire-une-adresse)
3. [Mettre le site en ligne sur Vercel (pas à pas)](#3-mettre-le-site-en-ligne-sur-vercel-pas-à-pas)
4. [Ajouter les photos (après la mise en ligne)](#4-ajouter-les-photos-après-la-mise-en-ligne)
5. [Activer les sections optionnelles](#5-activer-les-sections-optionnelles)
6. [Espace admin : voir les réponses RSVP](#6-espace-admin--voir-les-réponses-rsvp)
7. [Tester les trois états du site](#7-tester-les-trois-états-du-site)
8. [Brancher un nom de domaine personnalisé](#8-brancher-un-nom-de-domaine-personnalisé)
9. [Pour les développeurs](#9-pour-les-développeurs)

---

## 1. Informations à compléter (TODO_MARIES)

Toutes ces valeurs se trouvent dans **`content/site.ts`** (recherchez `TODO_MARIES`), sauf mention contraire. Le site fonctionne déjà sans elles.

| # | Information | Où | Valeur actuelle |
|---|---|---|---|
| 1 | Lien Google Maps de la **mosquée** | `invitation.venues[0].mapsUrl` | `null` → le bouton « Itinéraire » lance une recherche Google Maps sur l'adresse |
| 2 | Lien Google Maps de la **salle de réception** | `invitation.venues[1].mapsUrl` | `null` → recherche sur l'adresse |
| 3 | Coordonnées GPS des deux lieux (`{ lat: 5.4…, lng: -4.0… }`) | `invitation.venues[*].coordinates` | `null` → le bouton « Commander un Yango » est remplacé par la mention « Sur Yango : … » |
| 4 | **Date limite** des confirmations | `rsvp.text` **et** variable Vercel `RSVP_DEADLINE` | Proposition : 15 novembre 2026 (`2026-11-15T23:59:00Z`) |
| 5 | Nombre maximum de personnes par réponse | `rsvp.maxGuests` | `5` |
| 6 | Contacts (nom + numéro WhatsApp, 1 ou 2) | `rsvp.contacts` | vide → le bloc Contacts est masqué |
| 7 | Heure de fin de la réception (fichier calendrier uniquement) | `invitation.venues[1].end` | `19 h 00` (provisoire) |
| 8 | « Notre histoire » : texte + 1 photo | `story` + `media.story` | désactivée |
| 9 | Galerie : 6 à 12 photos HD | `media.gallery` | désactivée |
| 10 | Liste de cadeaux | `gifts` | désactivée |
| 11 | FAQ (arrivée, parking, enfants, photos…) | `faq` | désactivée |
| 12 | Photo principale du couple (portrait, HD) pour le hero | `media.hero` | aucune → hero typographique |
| 13 | (Optionnel) photo pour l'aperçu WhatsApp | `media.ogImage` | aucune → image générée avec le monogramme |
| 14 | Nom de domaine personnalisé | Vercel | sous-domaine `*.vercel.app` |
| 15 | Mot de passe de l'espace admin | variable Vercel `ADMIN_PASSWORD` | à choisir |

**Format des contacts :**

```ts
contacts: [
  { name: "Aboubakar", whatsapp: "2250700000000" }, // indicatif 225 + numéro, sans espace ni +
],
```

**Obtenir un lien Google Maps :** dans Google Maps, touchez le lieu → « Partager » → « Copier le lien ». Les coordonnées GPS s'affichent en appui long sur le lieu (deux nombres, ex. `5.4189, -4.0213` → `{ lat: 5.4189, lng: -4.0213 }`).

> Une fois les coordonnées renseignées, testez le bouton « Commander un Yango » sur un téléphone Android **et** un iPhone avec l'application Yango installée.

---

## 2. Modifier un texte, un horaire, une adresse

**Tout le contenu est dans un seul fichier : `content/site.ts`.** Aucun texte n'est écrit dans les composants.

Depuis GitHub, sans rien installer :

1. Ouvrez le dépôt sur github.com, puis le fichier `content/site.ts`.
2. Cliquez sur l'icône crayon (« Edit this file »).
3. Modifiez le texte **entre les guillemets** uniquement.
4. Cliquez sur « Commit changes ». Vercel remet le site à jour en 1 à 2 minutes.

⚠️ Ne touchez pas aux versets coraniques : ils ont été validés tels quels.

---

## 3. Mettre le site en ligne sur Vercel (pas à pas)

Prérequis : un compte [GitHub](https://github.com) (le code y est déjà) et un compte [Vercel](https://vercel.com) gratuit (plan Hobby), créé avec « Continue with GitHub ».

### Étape 1 — Importer le projet

1. Sur [vercel.com/new](https://vercel.com/new), choisissez le dépôt **mariagecoul** → « Import ».
2. Framework : **Next.js** (détecté automatiquement). Ne changez pas les commandes.
3. **Ne cliquez pas encore sur « Deploy »** si Vercel le permet : ouvrez « Environment Variables » et ajoutez :
   - `ADMIN_PASSWORD` : un mot de passe solide (pour l'espace admin)
   - `RSVP_DEADLINE` : `2026-11-15T23:59:00Z` (ou la date choisie)
   - `NEXT_PUBLIC_SITE_URL` : laissez vide pour l'instant
4. Si le premier déploiement démarre et échoue, c'est normal : la base de données n'est pas encore branchée.

### Étape 2 — Créer la base de données Neon

1. Dans le projet Vercel : onglet **Storage** → « Create Database » → **Neon** (Serverless Postgres) → « Continue ».
2. Région : **Frankfurt (eu-central-1)**, la même que les fonctions du site (`vercel.json` → `fra1`, la plus proche d'Abidjan). Plan gratuit.
3. Reliez la base au projet pour les environnements **Production** et **Preview**.
4. Vercel ajoute automatiquement `DATABASE_URL` (et selon les cas `DATABASE_URL_UNPOOLED` ou `POSTGRES_URL_NON_POOLING`). Seule `DATABASE_URL` est indispensable : le script de build déduit l'URL directe si elle manque.

### Étape 3 — Déployer

1. Onglet **Deployments** → sur le dernier déploiement, menu « ⋯ » → **Redeploy**.
2. Le build (`scripts/build.mjs`) exécute `prisma generate`, `prisma migrate deploy` puis `next build` : la table des RSVP est créée automatiquement.
3. Une fois terminé, Vercel affiche l'adresse du site (ex. `https://mariagecoul.vercel.app`).
4. Renseignez cette adresse dans `NEXT_PUBLIC_SITE_URL` (Settings → Environment Variables), puis redéployez une dernière fois.

### Étape 4 — Vérifier

- Ouvrez le site sur votre téléphone.
- Envoyez une réponse test via le formulaire, puis vérifiez-la dans `/admin`.
- Collez le lien dans une conversation WhatsApp pour voir l'aperçu (image noire et or avec le monogramme). WhatsApp garde les aperçus en cache : si l'ancien s'affiche, ajoutez `?v=2` à la fin du lien.
- Supprimez la réponse test (voir section 6).

**Ensuite :** chaque modification envoyée sur la branche `main` met le site à jour automatiquement. Les autres branches créent un site de prévisualisation.

---

## 4. Ajouter les photos (après la mise en ligne)

Le site est complet sans photo. Pour en ajouter, **aucun composant n'est à modifier**.

Pour voir le rendu final avant d'avoir les photos : `/?preview=demo`.

### Avec l'outil d'optimisation (recommandé)

Les photos brutes sont trop lourdes pour des connexions mobiles. Le script les redimensionne (2 400 px max), les convertit en WebP et AVIF (< 300 Ko) et génère les aperçus flous.

```bash
npm install
mkdir photos-brutes          # déposez-y les photos (JPG, PNG…)
npm run optimize-images
```

Le script crée les fichiers dans `public/images/` et affiche des lignes prêtes à coller :

```ts
media: {
  hero: { src: "/images/hero.webp", alt: "Aboubakar et Aïchatou", width: 1600, height: 2400, blurDataURL: "data:image/webp;base64,…" },
  invitation: null,
  story: null,
  gallery: [
    { src: "/images/photo-1.webp", alt: "…", width: 2400, height: 1600, blurDataURL: "…" },
  ],
  ogImage: null,
},
```

1. Collez la ligne voulue dans `content/site.ts` (objet `media`) et remplacez `alt` par une courte description.
2. `git add public/images content/site.ts && git commit -m "Ajout des photos" && git push`
3. Vercel redéploie automatiquement.

Le dossier `photos-brutes/` n'est jamais envoyé sur GitHub.

### Où apparaît chaque photo

| Clé | Emplacement |
|---|---|
| `media.hero` | Dans l'arche du hero, avec un dégradé noir pour garder les prénoms lisibles |
| `media.story` | Arche de « Notre histoire » (la section reste masquée sans photo) |
| `media.gallery` | Galerie en mosaïque avec agrandissement (masquée tant qu'elle est vide) |
| `media.ogImage` | Aperçu WhatsApp, format 1200 × 630 (sinon image générée) |

---

## 5. Activer les sections optionnelles

Dans `content/site.ts`, chaque section a un interrupteur `enabled`. Elle n'apparaît (page **et** menu) que si `enabled: true` **et** que son contenu est rempli :

- **Notre histoire** : `story.enabled`, `story.paragraphs` (liste de paragraphes) et `media.story`
- **Galerie** : `gallery.enabled` et au moins une photo dans `media.gallery` (pensez à passer `gallery.enabled` à `true` en ajoutant les photos)
- **Liste de cadeaux** : `gifts.enabled` et `gifts.items` (`{ title, description?, url?, linkLabel? }`)
- **FAQ** : `faq.enabled` et `faq.items` (`{ question, answer }`)

Après le mariage, la galerie remonte automatiquement juste sous le hero.

---

## 6. Espace admin : voir les réponses RSVP

- Adresse : `https://<votre-site>/admin`, puis le mot de passe `ADMIN_PASSWORD`.
- Vous y trouvez : le tableau des réponses (nom, téléphone cliquable vers WhatsApp, présence, nombre, cérémonie(s), message, date), les totaux (oui, non, personnes attendues, cérémonie religieuse, réception), une recherche et le bouton **Export CSV** (s'ouvre dans Excel ou Google Sheets).
- Une même personne peut répondre deux fois : les deux réponses apparaissent, la plus récente en haut.
- Supprimer une réponse (ex. le test) : Vercel → Storage → Neon → « Open in Neon Console » → Tables → `Rsvp`.

---

## 7. Tester les trois états du site

Le site change seul selon la date (heure d'Abidjan) :

| État | Quand | Effet |
|---|---|---|
| **Avant** | jusqu'au 28/11 | compte à rebours + formulaire RSVP (fermé après `RSVP_DEADLINE`) |
| **Jour J** | le 29/11 | « C'est aujourd'hui » à la place du compte à rebours, l'étape en cours du programme est mise en évidence |
| **Après** | dès le 30/11 | « Merci d'avoir partagé ce jour avec nous », RSVP masqué, galerie mise en avant |

Pour prévisualiser :

- `/?preview=avant`
- `/?preview=jourj`
- `/?preview=apres`
- `/?preview=clos` (avant le mariage, mais confirmations closes)
- `/?preview=demo` : rendu **avec photos** (hero et galerie) grâce à des visuels de démonstration or. Ces visuels (`public/images/demo/`, `content/demo.ts`) ne servent qu'à cet aperçu : le site public n'affiche que les photos déclarées dans `site.media`.

La page est mise en cache et régénérée chaque minute : le changement d'état est automatique, sans redéploiement.

---

## 8. Brancher un nom de domaine personnalisé

1. Achetez le domaine (ex. chez OVH, Namecheap, Gandi…) : `TODO_MARIES`.
2. Vercel → projet → **Settings → Domains** → « Add » → saisissez le domaine.
3. Vercel indique les enregistrements DNS à créer chez le registraire (en général un `A` vers `76.76.21.21` pour le domaine nu, et un `CNAME` `www` vers `cname.vercel-dns.com`).
4. Le certificat HTTPS est automatique (quelques minutes à quelques heures).
5. Mettez à jour `NEXT_PUBLIC_SITE_URL` avec le nouveau domaine, puis redéployez.

---

## 9. Pour les développeurs

```bash
npm install
cp .env.example .env        # renseigner DATABASE_URL / DATABASE_URL_UNPOOLED (Postgres local ou Neon)
npx prisma migrate deploy
npm run dev                 # http://localhost:3000
npm run typecheck
npm run build:local         # build sans migration
```

### Structure

```
app/
  layout.tsx                 polices (next/font), metadata, noindex, theme-color
  page.tsx                   page unique, statique, régénérée chaque minute
  apercu/[state]/page.tsx    aperçus ?preview= (réécriture par middleware.ts)
  admin/                     tableau des RSVP (cookie httpOnly)
  api/rsvp/route.ts          POST RSVP (Zod, honeypot, limite par IP)
  api/admin/export/route.ts  export CSV
  api/calendar/route.ts      fichier .ics des deux événements
  opengraph-image.tsx        aperçu WhatsApp 1200×630 (next/og)
  icon.tsx, apple-icon.tsx   favicon monogramme
  robots.ts                  bloque tout
components/HomePage.tsx      assemblage des sections
components/sections/         Navbar, Hero, Invitation, DressCode, Programme, Rsvp, Story, Gallery, Gifts, Faq, Footer
components/ui/               Monogram, OgiveArch, GeometricPattern, GoldDivider, Countdown, Reveal…
content/site.ts              TOUT le contenu typé
lib/                         date.ts (états, fuseau), rsvp.ts (schéma Zod), ics.ts, prisma.ts, admin-auth.ts…
prisma/                      schéma + migrations
scripts/optimize-images.mjs  npm run optimize-images
assets/fonts/                polices pour l'image OG + Amiri réduite
```

### Notes

- **Fuseau :** Abidjan est en UTC+0 toute l'année, toutes les dates sont stockées en UTC. Compte à rebours vers `2026-11-29T08:00:00Z`.
- **Animations :** apparitions au scroll en CSS pilotées par un seul IntersectionObserver (`RevealObserver`) pour limiter le JavaScript sur mobile ; Framer Motion pour la timeline du programme, le menu mobile, le RSVP et la galerie ; Lenis chargé après l'affichage. Tout respecte `prefers-reduced-motion`.
- **Performances mesurées** (Lighthouse mobile, build de production local) : Performance 93, Accessibilité 100, Bonnes pratiques 100.
- **Anti-spam :** champ piège invisible + 5 envois max. par IP et par 10 minutes (mémoire de l'instance serverless : protection légère).
- **Police arabe :** `assets/fonts/amiri-bismillah.woff2` ne contient que les glyphes de « بسم الله الرحمن الرحيم ». Si ce texte change, régénérez-la :
  ```bash
  pip install fonttools brotli
  npm pack @fontsource/amiri@5 && tar xzf fontsource-amiri-*.tgz
  pyftsubset package/files/amiri-arabic-400-normal.woff --text="NOUVEAU TEXTE" \
    --layout-features='*' --flavor=woff2 --output-file=assets/fonts/amiri-bismillah.woff2
  ```
