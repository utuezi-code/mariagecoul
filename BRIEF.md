# BRIEF.md — Direction artistique & cahier des charges

## 1. Intention

Un site **ultra-moderne et premium**, à mi-chemin entre une invitation de maison de couture et un faire-part de luxe. Le mariage est musulman et le dress code est **tout blanc** : le site doit respirer la sérénité, la foi et l'élégance, sans surcharge.

Les mots-clés sont **épuré, lumineux, solennel, raffiné, contemporain.**

À éviter : le look « template de mariage » (fleurs aquarelle, rose poudré, script partout), les ornements clichés et les dégradés arc-en-ciel.

## 2. Palette (blanc, noir, or)

| Token | Hex | Usage |
|---|---|---|
| `ivory` | `#FAF8F3` | Fond principal (blanc chaud, jamais `#FFF` pur en grand aplat) |
| `white` | `#FFFFFF` | Cartes, surfaces |
| `ink` | `#0B0B0B` | Sections sombres (hero, programme, RSVP), texte principal |
| `graphite` | `#2A2A2A` | Texte secondaire sur fond clair |
| `mist` | `#8A8578` | Légendes, métadonnées |
| `gold` | `#C9A24B` | Accent principal : titres, filets, icônes |
| `gold-light` | `#E6CB8A` | Reflets, survols |
| `gold-deep` | `#9A7A32` | Or sur fond clair quand il faut plus de contraste |

**Effet or premium.** Sur les grands titres et le monogramme, utiliser un dégradé linéaire `#9A7A32 → #E6CB8A → #C9A24B → #9A7A32` en `background-clip: text`, avec un léger reflet animé (shimmer lent, 6 s, désactivé si `prefers-reduced-motion`).

Il faut alterner des sections **noires** et **ivoire** pour créer du rythme. `theme-color` : `#0B0B0B`.

## 3. Typographie

- **Display :** `Cormorant Garamond` (300 et 500, italique pour les accents). Prénoms et grands titres, très grande taille, interlettrage serré.
- **Texte :** `Inter` ou `Manrope` (400 et 500). Petites capitales espacées (`tracking-[0.35em]`, uppercase, 11 à 13 px) pour les surtitres et le menu.
- **Arabe :** `Amiri` pour « بسم الله الرحمن الرحيم » dans le hero.
- **Interdit :** les scripts manuscrits type Great Vibes. Le premium passe ici par la serif fine et l'espace, pas par la calligraphie latine.

## 4. Éléments graphiques signature

- **Monogramme `C&S.A²`.** Il sert de logo dans le menu et de sceau dans le hero et le footer. Le dessiner en SVG : « C&S » en Cormorant, « A² » en exposant doré, inscrit dans une fine bordure octogonale ou un arc. Le « ² » rappelle les deux A (Aboubakar et Aïchatou), à mettre en valeur subtilement.
- **Motif géométrique islamique.** Une étoile à 8 branches ou un entrelacs, en filet or de 0,5 px, très discret (opacité 6 à 10 %), en fond de certaines sections noires. Ce motif ancre le site dans la culture sans le surcharger.
- **Arc d'ogive.** La forme d'arche de mosquée sert de cadre pour les photos et de masque pour les cartes de lieu.
- **Séparateur.** Un filet or, un petit losange ou une étoile à 8 branches, puis un filet or.
- **Grain.** Un bruit très léger (2 à 3 %) sur les sections noires pour un rendu « papier de luxe ».

## 5. Motion

- Le smooth scroll Lenis doit rester subtil.
- **Reveal** des textes ligne par ligne (masque plus translateY), 0,8 s, easing `[0.22, 1, 0.36, 1]`.
- **Hero.** Le monogramme se dessine (stroke-dashoffset), puis les prénoms apparaissent, puis la date.
- **Versets coraniques.** Apparition mot par mot au scroll, en lent.
- **Programme.** La ligne verticale dorée se trace au fil du scroll.
- Le parallaxe léger reste autorisé sur les photos. Pas d'effets gadgets : pas de curseur custom, pas de confettis.
- Tout doit respecter `prefers-reduced-motion`.

## 6. Structure de la page (one-page, dans cet ordre)

Le menu est fixe et transparent sur le hero, puis passe en fond `ink/80` avec flou au scroll. Il contient : Accueil · Cérémonie · Programme · RSVP (plus les sections optionnelles si elles sont activées). Sur mobile, il se transforme en menu plein écran noir avec les liens en Cormorant XXL.

### 6.1 Hero (fond noir)
- « بسم الله الرحمن الرحيم » en Amiri doré, avec la translittération en petites capitales en dessous
- Le verset Ar-Rum 30:21 en italique Cormorant, centré, limité à 40 caractères de large
- Le surtitre « Fotaman », puis « Nous nous marions »
- Les prénoms en très grand, sur deux lignes : **Aboubakar** / **& Aïchatou** (avec les noms complets en petites capitales sous chaque prénom), plus le monogramme
- La date « Dimanche 29 novembre 2026 »
- Un **compte à rebours** (jours, heures, minutes, secondes) avec des chiffres Cormorant et des séparateurs en filets or
- Un CTA principal **« Confirmer ma présence »** (bouton or plein, texte noir), qui fait défiler jusqu'au RSVP
- La mention discrète « Merci de ne pas partager ce lien »
- **V1 sans photo (lancement) :** le hero est purement typographique sur fond noir, avec le motif géométrique or en fond, une grande arche d'ogive dessinée en filet or qui encadre les prénoms, et un léger halo doré central. Cette version doit être superbe seule, c'est celle que les invités verront en premier.
- **V2 avec photo (plus tard) :** quand `media.hero` est renseigné, la photo apparaît dans l'arche d'ogive avec un dégradé noir pour garder le texte lisible. Même mise en page, aucun saut visuel.

### 6.2 Verset + Invitation « Nous nous disons Oui » (fond ivoire)
- Le verset An-Nisa 4:1
- Le titre « Nous nous disons Oui » et le texte d'invitation
- **Deux cartes de lieu** côte à côte (empilées sur mobile) :
  - **Mariage religieux** à 8 h 00, Mosquée Aboubakar Sidik, Abobo
  - **Réception des convives** à 13 h 00, Abobo Espace Événementiel
  - Chaque carte contient une icône fine, un horaire, une adresse et un repère, un badge **« Dress code : tout blanc »**, et deux boutons : **« Itinéraire »** (lien Google Maps) et **« Commander un Yango »** (deep link Yango si les coordonnées sont fournies, sinon simple mention « Sur Yango : … »).
  - Un bouton **« Ajouter au calendrier »** génère un fichier `.ics` avec les deux événements.

### 6.3 Dress code (bandeau court, fond blanc pur)
Un bandeau minimaliste : « Dress code exigé : tout blanc », avec une petite illustration au trait (silhouette de tenue ou icône chemise en or). Ce bandeau donne un vrai moment visuel au code vestimentaire, qui est important pour ce mariage.

### 6.4 Programme de la journée (fond noir)
- Le verset Al-Furqan 25:74
- Une timeline verticale avec une ligne dorée qui se dessine au scroll. Les étapes alternent gauche et droite sur desktop et sont toutes alignées à gauche sur mobile.
- Chaque étape comporte une heure en Cormorant doré, un intitulé et une icône fine.
- La formule de clôture « Qu'Allah bénisse notre union… » apparaît en italique.
- **Le jour J,** l'étape en cours est mise en évidence (halo or) selon l'heure réelle `Africa/Abidjan`.

### 6.5 RSVP (fond ivoire)
- Les champs sont : nom complet\*, téléphone (WhatsApp)\*, présence (Oui / Non)\*, nombre de personnes (1 à N, maximum configurable), présence à la cérémonie religieuse, à la réception ou aux deux, et un message aux mariés (facultatif).
- La validation Zod est faite côté client et côté serveur. Une protection anti-spam légère (honeypot plus rate limit par IP) est en place.
- La confirmation est élégante et animée (le monogramme se redessine, avec le message « Merci, nous avons hâte de vous recevoir »).
- **Après la date limite** (`RSVP_DEADLINE`), le formulaire est remplacé par la carte « Les confirmations sont closes. Merci à tous ceux qui ont répondu. »
- Les contacts des mariés ou de l'organisateur s'affichent avec un bouton WhatsApp (`wa.me`), `TODO_MARIES`.

### 6.6 Sections optionnelles (désactivées par défaut, prêtes à remplir)
- **Notre histoire :** texte plus photo en arche
- **Galerie :** grille masonry plus lightbox
- **Liste de cadeaux :** cartes « Enveloppe », « Contribution libre » et produits avec lien
- **FAQ :** accordéon (arrivée, parking, enfants, photos…)

### 6.7 Footer (fond noir)
Le monogramme, les prénoms, la date `29.11.2026` en Cormorant doré, puis « Qu'Allah bénisse notre union ». Pas de branding tiers.

## 7. Trois états du site (automatiques, selon la date)

1. **Avant le 29/11 :** le compte à rebours et le RSVP sont actifs.
2. **Le jour J :** le compte à rebours est remplacé par « C'est aujourd'hui » et le programme met en évidence l'étape en cours.
3. **Après le 29/11 :** le hero devient « Merci d'avoir partagé ce jour avec nous », le RSVP est masqué et la galerie est mise en avant si des photos ont été ajoutées.

Prévoir un paramètre `?preview=avant|jourj|apres` pour tester chaque état.

## 8. Admin

`/admin` est protégé par `ADMIN_PASSWORD` (cookie httpOnly). Il affiche un tableau des RSVP (nom, téléphone, présence, nombre, message, date), les totaux (oui, non, nombre total de personnes, répartition entre cérémonie et réception), un bouton **Export CSV** et une recherche.

## 9. SEO & partage

- `noindex, nofollow`, et un `robots.txt` qui bloque tout
- Une **image Open Graph** 1200×630 générée via `next/og` : fond noir, monogramme or, prénoms, date. C'est elle qui s'affiche dans l'aperçu WhatsApp, elle doit être magnifique.
- Titre : « Aboubakar & Aïchatou — 29 novembre 2026 »
- Description : « Nous nous marions. Vous êtes invités à célébrer notre union. »
- Favicon : le monogramme.

## 10. Critères d'acceptation

- [ ] **Le site est complet et premium sans aucune photo** (V1)
- [ ] Ajouter une photo = un fichier dans `public/images/` + une ligne dans `content/site.ts`, sans toucher aux composants
- [ ] Déployé sur Vercel, avec la base Neon connectée et un redéploiement automatique à chaque push
- [ ] Rendu parfait en 375 px, 768 px et 1440 px
- [ ] Lighthouse mobile ≥ 90 (Performance, Accessibilité, Bonnes pratiques)
- [ ] Le compte à rebours est juste en heure d'Abidjan
- [ ] Le RSVP est enregistré en base, visible dans l'admin et exportable en CSV
- [ ] Les trois états sont testables via `?preview=`
- [ ] Les liens Maps et le fichier `.ics` fonctionnent sur Android et iOS
- [ ] L'aperçu WhatsApp (OG image) est correct
- [ ] Aucun texte inventé, et tous les `TODO_MARIES` sont listés dans le README
