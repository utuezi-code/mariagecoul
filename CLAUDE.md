# CLAUDE.md — Site de mariage C&S.A²

Site d'invitation de mariage privé pour **Coulibaly Zié Aboubakar & Silué Aïchatou**, le **dimanche 29 novembre 2026** à Abidjan (Abobo).

Lis ces trois fichiers avant d'écrire du code :
1. `CLAUDE.md` (ce fichier) : stack, règles, workflow
2. `BRIEF.md` : direction artistique, sections, fonctionnalités
3. `CONTENT.md` : tout le texte du site, validé par les mariés. **Ne pas réécrire ni inventer de contenu.**

---

## Contraintes clés du projet

1. **Next.js, hébergé sur Vercel.** Non négociable.
2. **Les photos seront ajoutées APRÈS la mise en ligne.** La V1 sort **sans aucune photo** et doit déjà être premium et complète grâce à la typographie, au motif géométrique, au monogramme et à l'or. Chaque emplacement photo doit pouvoir être activé plus tard **sans toucher au code des composants**. Voir la section « Photos » plus bas.

## Stack imposée

- **Next.js 15** (App Router, TypeScript strict), hébergé sur **Vercel** (plan Hobby suffisant)
- **Tailwind CSS v4** avec les tokens de couleur définis dans `BRIEF.md`
- **Framer Motion** pour les animations, **Lenis** pour le smooth scroll
- **next/font** pour les polices (pas de lien Google Fonts dans le `<head>`)
- **Prisma + PostgreSQL (Neon)** pour stocker les RSVP
- **Zod** pour la validation des formulaires (client et serveur)
- **lucide-react** pour les icônes (trait fin, `strokeWidth={1.25}`)
- Pas de framework UI lourd (pas de MUI ni de Chakra). shadcn/ui est autorisé seulement pour l'accordéon et les champs de formulaire, restylés.

## Architecture

```
app/
  layout.tsx            # polices, metadata, noindex, theme-color
  page.tsx              # page unique, sections empilées
  merci/page.tsx        # (optionnel) page après RSVP
  admin/page.tsx        # liste des RSVP, protégée par mot de passe
  api/rsvp/route.ts     # POST RSVP
  api/admin/export/route.ts  # export CSV
components/sections/    # Hero, Verset, Invitation, Programme, Rsvp, Footer...
components/ui/          # Countdown, GoldDivider, Ornament, SectionTitle...
content/site.ts         # TOUT le contenu typé (source : CONTENT.md)
lib/                    # prisma.ts, date.ts, ics.ts
prisma/schema.prisma
public/images/
```

- **Tout le texte vit dans `content/site.ts`.** Aucun texte en dur dans les composants. Les mariés doivent pouvoir changer un horaire ou une adresse dans un seul fichier.
- Les sections optionnelles (Notre histoire, Galerie, Cadeaux, FAQ) sont activées par des flags dans `content/site.ts`. Si le contenu est vide, la section ne s'affiche pas et n'apparaît pas dans le menu.

## Règles

- **Mobile first.** 90 % des invités ouvriront le lien depuis WhatsApp sur Android. Tester d'abord en 375 px, puis 768 px et 1440 px.
- **Performance.** Lighthouse mobile ≥ 90 partout. Images en `next/image`, AVIF/WebP, `priority` uniquement sur le hero. Les connexions mobiles à Abidjan peuvent être lentes : pas de vidéo en autoplay lourde, aucune image > 300 Ko après optimisation.
- **Accessibilité.** Contraste AA. L'or `#C9A24B` sur blanc est trop faible pour du texte courant, donc l'utiliser pour les titres et accents, pas pour les paragraphes. Respecter `prefers-reduced-motion`. Focus visibles. Labels sur tous les champs.
- **Confidentialité.** `robots: noindex, nofollow` dans la metadata, plus un `robots.txt` qui bloque tout. Pas d'analytics tiers.
- **Fuseau horaire.** Toutes les dates sont en `Africa/Abidjan` (UTC+0). Cible du compte à rebours : `2026-11-29T08:00:00Z`.
- **Langue.** 100 % français, sauf les formules arabes déjà présentes dans `CONTENT.md`. Aucun texte en anglais (pas de « See you there »).
- Ne pas afficher de mention « Built by » ni de branding tiers.

## Photos (ajoutées plus tard)

- Toutes les photos sont déclarées dans `content/site.ts`, dans un objet `media`, avec `null` par défaut :
  ```ts
  media: {
    hero: null,          // { src: "/images/hero.jpg", alt: "..." }
    invitation: null,
    story: null,
    gallery: [],         // tableau d'images
    ogImage: null,       // sinon OG générée automatiquement
  }
  ```
- **Chaque composant gère les deux cas :**
  - `null` : une variante sans photo, soignée (hero typographique avec motif géométrique, arche dorée vide en filet, etc.). Pas de rectangle gris ni d'image placeholder visible.
  - image fournie : `next/image` dans le cadre prévu (arche d'ogive, etc.), avec `placeholder="blur"`.
- La galerie et « Notre histoire » restent masquées tant qu'elles n'ont pas de photo.
- **Procédure d'ajout (à documenter dans le README) :** déposer les fichiers dans `public/images/`, renseigner les chemins dans `content/site.ts`, puis faire un `git push`. Vercel redéploie automatiquement.
- Fournir un script `npm run optimize-images` (avec `sharp`) qui redimensionne (2400 px max), convertit en WebP/AVIF et génère les `blurDataURL`. Les mariés enverront des photos brutes et lourdes.

## Déploiement Vercel

- Repo GitHub, puis import dans Vercel. Chaque push sur `main` déclenche un déploiement en production, et chaque branche une preview.
- Base de données : **Neon via l'intégration Vercel Marketplace**, qui injecte `DATABASE_URL` automatiquement.
- Le `build` lance `prisma generate && prisma migrate deploy && next build`.
- Domaine : sous-domaine `*.vercel.app` par défaut. Prévoir dans le README comment brancher un domaine personnalisé (`TODO_MARIES`).
- Le README contient les étapes de déploiement pas à pas, pour quelqu'un qui ne code pas.

## Variables d'environnement

```
DATABASE_URL=
ADMIN_PASSWORD=
NEXT_PUBLIC_SITE_URL=
RSVP_DEADLINE=2026-11-15T23:59:00Z
```

## Workflow attendu

1. Initialiser le projet, installer les dépendances, configurer Tailwind avec les tokens.
2. Créer `content/site.ts` à partir de `CONTENT.md`.
3. Construire les sections dans l'ordre de `BRIEF.md`, en vérifiant chacune en mobile.
4. Brancher le RSVP (Prisma, route API, page admin, export CSV).
5. Implémenter les trois états du site (avant, jour J, après), voir `BRIEF.md`.
6. Passer Lighthouse et corriger.
7. Préparer le déploiement Vercel (README avec les étapes).

Quand une information manque (photos, coordonnées GPS, contacts), utiliser un placeholder clairement marqué `TODO_MARIES` et lister tous les TODO dans le README. Ne rien inventer.
