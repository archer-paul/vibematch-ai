# PITCH VIBEMATCH - Demo Live

**Contexte :** Pitch devant un fond d'investissement qui envisage de lancer un fond pour aider les influenceurs. L'objectif est de montrer la competence technique et expliquer l'architecture en detail.

**Duree estimee :** 20-30 minutes (demo live incluse)

---

## PARTIE 1 : INTRODUCTION (5 min)

### Le marche

> Bonjour a tous, merci de me recevoir. Je suis Paul Archer, et aujourd'hui je vais vous presenter VibeMatch, une plateforme qu'on a developpee pour resoudre un probleme enorme dans le marketing d'influence.
>
> Aujourd'hui, le marche du marketing d'influence c'est **21 milliards de dollars en 2025**, et ca croit de 30% par an. C'est un marche gigantesque. Mais quand on regarde comment les deals se font concretement, c'est archaique.
>
> Comment ca se passe aujourd'hui ? Une marque qui veut faire une campagne avec un createur de contenu, elle passe par une agence. L'agence prend 20 a 40% de commission, elle a un carnet d'adresses limite, et le matching se fait essentiellement a la main, au feeling. Sinon, c'est du cold email : on envoie des centaines de mails a des createurs en esperant qu'ils repondent. Le taux de reponse ? Moins de 5%.
>
> Le resultat c'est que les createurs de contenu, surtout les micro et mid-tier -- ceux entre 10 000 et 500 000 abonnes -- qui representent 80% de l'engagement sur les reseaux, ils sont invisibles pour les marques. Et les marques, elles gaspillent du budget sur des partenariats mal cibles.

### L'idee

> Notre idee, c'est simple : **cut the middle man**. On supprime l'agence et on met en contact directement les createurs et les sponsors, mais -- et c'est la le point cle -- avec de l'intelligence artificielle pour garantir que chaque matching est pertinent.
>
> On analyse en profondeur le contenu des createurs : leurs videos, leurs transcripts, leur niche, leur style, leur taux d'engagement, la qualite de leur SEO, leur autorite sur un sujet... Et on genere un score de compatibilite precis entre un createur et une marque.

### Le probleme du network effect

> Maintenant, le challenge classique d'une marketplace comme la notre, c'est le **network effect**. Si personne n'est sur la plateforme, personne ne veut s'y inscrire. On a la poule et l'oeuf.
>
> Notre solution a ca, c'est qu'on n'a pas besoin que les createurs soient inscrits pour les analyser. Grace a l'integration des API de YouTube, et a terme Twitter et Instagram, on peut **crawler les reseaux sociaux** pour trouver le match parfait pour une marque, meme si le createur n'est pas encore sur VibeMatch. On peut analyser n'importe quel createur public, generer un profil complet, et permettre a la marque de l'inviter directement sur la plateforme.
>
> Ca resout le cold start problem : le sponsor a de la valeur des le premier jour, et le createur recoit une invitation personnalisee avec un score de compatibilite deja calcule.

### Transition vers la demo

> Voila pour le contexte. Maintenant, le mieux c'est de vous montrer. Je vais vous faire une demo live de la plateforme. On va commencer par le cote sponsor, puis on passera cote createur.

---

## PARTIE 2 : DEMO LIVE - COTE SPONSOR (10 min)

### Dashboard Sponsor

> *[Ouvrir vibematch.tech, se connecter en tant que sponsor]*
>
> Ici on est sur le dashboard sponsor. C'est la vue d'ensemble pour une marque. On voit en haut les **KPI principaux** :
> - **Budget total** alloue aux campagnes
> - **Campagnes actives** en cours
> - **Createurs engages** dans des partenariats
> - **ROI moyen** estime
>
> En dessous, on a le **Campaign Overview** avec les alertes et recommandations, et plus bas un tableau avance des createurs avec lesquels on travaille, avec des filtres par niche, par engagement, par taille d'audience.

### Creation de campagne - "Find Matching Creators"

> Maintenant, disons que je suis une marque tech et je veux lancer une campagne. Je clique sur **"Find Matching Creators"**.
>
> *[Cliquer sur le bouton]*
>
> Je remplis le formulaire :
> - **Campaign name** : "iPhone 17 Launch"
> - **Budget** : 50000
> - **Target niches** : je selectionne *Technology* et *Lifestyle*
> - **Campaign objectives** : je choisis *Brand Awareness* et *Engagement*
> - **Audience description** : "Tech-savvy young adults aged 18-35 who follow the latest smartphone trends and value in-depth product reviews"
>
> *[Cliquer sur "Find Matching Creators"]*
>
> Et la, en quelques secondes, l'IA me recommande **5 createurs YouTube reels** qui correspondent a mes criteres. Par exemple, on voit apparaitre **Marques Brownlee** (MKBHD).
>
> Comment ca marche derriere ? L'IA -- on utilise GPT-4o-mini -- analyse le brief de la campagne et croise ca avec sa connaissance des createurs sur YouTube pour recommander des profils pertinents. Elle renvoie le nom, le handle YouTube, une estimation du nombre d'abonnes, et surtout la raison du matching.

### Analyse approfondie d'un createur

> Maintenant c'est la ou **la magie opere**. Je vais sur la page **Discover** et je lance une analyse approfondie de Marques Brownlee.
>
> *[Aller sur Discover, taper @mkbhd]*
>
> Quand je lance l'analyse, voila ce qui se passe en coulisses, et c'est la que c'est techniquement interessant :
>
> **Etape 1 - Fetch YouTube** : On interroge l'**API YouTube Data v3** -- c'est l'API officielle, publique et documentee de Google -- pour recuperer :
> - Le profil de la chaine : nombre d'abonnes, nombre total de vues, date de creation, pays, mots-cles de la chaine, photo de profil
> - Les **50 dernieres videos** avec pour chacune : titre, description, tags, nombre de vues, likes, commentaires, duree
>
> **Etape 2 - Extraction des transcripts** : Et la, ca devient vraiment interessant. Pour les 10 dernieres videos, on recupere le transcript complet -- c'est-a-dire tout ce que le createur dit dans sa video, mot pour mot. C'est ca qui nous permet d'analyser son vocabulaire, sa niche, son expertise.
>
> Et ca, ca a ete **la partie la plus complexe techniquement** du projet. Laissez-moi vous raconter le parcours parce que c'est assez revelateur de la demarche d'ingenierie.
>
> D'abord, l'API officielle YouTube Data v3 -- celle qu'on utilise pour les stats -- ne permet tout simplement pas de telecharger les sous-titres d'une video dont on n'est pas proprietaire. C'est une limitation volontaire de Google.
>
> Ensuite, on a essaye du **scraping classique** -- aller chercher la page de la video et extraire les sous-titres. Mais YouTube genere les sous-titres dynamiquement en JavaScript, donc quand on fetch la page depuis un serveur, on n'obtient que le HTML statique.
>
> Troisieme tentative : on a decouvert que YouTube expose des **URLs directes** vers les fichiers de sous-titres dans les metadonnees de la video. Ca marchait parfaitement en local sur nos machines. Mais en production, sur Google Cloud, **YouTube bloque ces requetes** : il detecte que l'IP vient d'un serveur cloud et renvoie une erreur. Toutes les librairies npm existantes pour les transcripts YouTube avaient exactement le meme probleme.
>
> C'est la qu'on a eu l'idee cle. YouTube a en fait **deux API** : l'API publique (Data v3), et une **API interne** appelee **InnerTube**. InnerTube, c'est l'API que les apps officielles YouTube utilisent -- l'app Android, l'app iOS, YouTube sur smart TV. Elle n'est pas documentee, pas supportee, mais elle est extremement puissante parce qu'elle a acces a tout.
>
> Et surtout : YouTube ne bloque pas ses propres apps. Si une requete vient de l'app Android YouTube, elle passe, meme depuis une IP de serveur.
>
> Donc notre solution, c'est de **se faire passer pour l'app Android YouTube**. Concretement :
> - On envoie un **User-Agent** qui dit "je suis l'app YouTube pour Android version 19.02.39"
> - On utilise une **cle API publique** hardcodee dans l'APK de l'app Android -- cette cle est la meme pour tous les milliards d'utilisateurs Android, YouTube ne peut pas la revoquer sans casser l'app
> - On simule l'**acceptation des cookies RGPD** avec un cookie special, sinon en Europe YouTube redirige vers une page de consentement
> - On extrait un **identifiant de visiteur** depuis la page de la video, necessaire pour authentifier la requete
> - Et on recupere un **token d'acces au transcript** cache dans un JSON de plusieurs megaoctets qu'on parse avec un algorithme de comptage d'accolades fait maison
>
> C'est du reverse-engineering de l'infrastructure YouTube, mais c'est robuste : cette methode fonctionne de maniere fiable depuis des mois, parce que YouTube ne peut pas bloquer ses propres clients sans casser l'experience de milliards d'utilisateurs.
>
> **Etape 3 - Detection de niche par LDA** : On passe tout le corpus textuel -- titres, descriptions, tags, transcripts -- dans un algorithme de **Latent Dirichlet Allocation**. C'est un modele de topic modeling non-supervise qui identifie les themes dominants dans un corpus de texte. On a defini 15 niches predefinies (Technology, Gaming, Beauty, Fitness, etc.) avec des dictionnaires de mots-cles, et on mappe les topics LDA sur ces niches. Ca nous donne une detection de niche avec un score de confiance.
>
> **Etape 4 - Analyse OpenAI** : On envoie tout ca -- les donnees de la chaine, les metriques, les niches detectees, et les transcripts -- a GPT-4o-mini avec un prompt structure qui evalue le createur sur **6 categories** :
>
> 1. **Vocabulary & Language** (0-100) : Richesse du vocabulaire, articulation, capacite multilingue
> 2. **SEO & Metadata** (0-100) : Efficacite des titres, qualite des descriptions, strategie de tags
> 3. **Engagement** (0-100) : Taux d'engagement, ratio likes/vues, regularite de publication
> 4. **Audience Reach** (0-100) : Taille de l'audience, croissance, fidelite
> 5. **Topical Authority** (0-100) : Clarte du sujet, profondeur d'expertise, coherence thematique
> 6. **Tone & Brand Voice** (0-100) : Style de communication, authenticite, constance
>
> Le tout renvoie un **score global**, un resume, les forces, faiblesses, et recommandations.
>
> *[Montrer les resultats a l'ecran]*
>
> Voila, on voit le score de Marques Brownlee. On a un score eleve, ce qui est logique pour un des plus grands createurs tech sur YouTube. On voit la ventilation par categorie, ses points forts, et ses niches detectees.

### Score de matching

> Maintenant, le scoring de compatibilite entre ce createur et notre marque, c'est un **algorithme hybride** :
>
> **40% score deterministe** -- un algorithme rapide sans IA qui evalue 6 facteurs :
> - **Alignement de niche** (poids 30%) : correspondance entre les niches du createur et les secteurs de la marque
> - **Qualite d'engagement** (poids 20%) : taux d'engagement compare aux benchmarks de sa categorie de taille (nano, micro, mid, macro, mega)
> - **Taille d'audience** (poids 15%) : adequation entre la taille de l'audience et le budget de la campagne
> - **Compatibilite de contenu** (poids 15%) : correspondance entre les objectifs de campagne et les styles de contenu du createur
> - **Brand safety** (poids 10%) : verification que le createur n'est pas dans des secteurs evites par la marque
> - **Activite recente** (poids 10%) : frequence de publication et recence du dernier contenu
>
> **60% score IA** -- GPT-4o-mini analyse la compatibilite globale en prenant en compte des facteurs plus subtils comme le ton, le style, et l'alignement strategique.
>
> Le score final est une combinaison ponderee des deux.

### Montrer les transcripts et videos

> Je peux aussi voir les transcripts des dernieres videos.
>
> *[Cliquer pour deployer un transcript]*
>
> Ca permet a la marque de verifier concretement de quoi parle le createur, son style, son vocabulaire. Et si je clique sur le titre de la video, ca m'amene directement sur YouTube.
>
> *[Cliquer sur un titre pour ouvrir YouTube]*

### Recherche interactive

> Et bien sur, on peut rechercher n'importe quel createur. Est-ce que vous avez un YouTuber prefere que vous aimeriez qu'on analyse ?
>
> *[Attendre une suggestion du public, taper le handle, lancer l'analyse]*
>
> *[Commenter les resultats en direct]*

### Autres fonctionnalites sponsor

> Pour completer le cote sponsor, on a aussi :
> - Une page **Analytics** ou le sponsor peut suivre la performance de ses campagnes en temps reel
> - Une **messagerie integree** pour echanger directement avec les createurs, sans passer par un intermediaire

---

## PARTIE 3 : DEMO LIVE - COTE CREATEUR (7 min)

> *[Se deconnecter et se reconnecter en tant que createur]*
>
> Passons maintenant de l'autre cote, celui du createur de contenu.

### Dashboard Createur

> Sur le dashboard createur, je vois mes **analytics essentielles** : vues du profil, likes recus, messages, croissance des abonnes. Je vois aussi mon **score de profil IA** qui indique a quel point mon profil est optimise pour attirer des sponsors.

### Tinder-like Matching

> Maintenant, si je vais dans la section **"AI Matches"**...
>
> *[Cliquer sur AI Matches dans la sidebar]*
>
> On a essaye de **gamifier l'experience** avec une interface inspiree de Tinder. Je ne sais pas si c'etait la meilleure decision UX, mais c'etait marrant a developper et ca rend l'experience plus engageante.
>
> *[Montrer les cartes de sponsors]*
>
> Je vois les entreprises avec lesquelles je suis potentiellement aligne. Chaque carte montre le nom de l'entreprise, son secteur, son budget, et ses objectifs de campagne. Derriere, c'est exactement le meme algorithme de scoring qu'on vient de voir cote sponsor, sauf qu'il est "sous le capot" -- le createur voit juste les marques les plus compatibles en premier.
>
> Je peux swiper a droite pour liker, a gauche pour passer, ou vers le haut pour un **Super Like** -- qui est limite en nombre pour gamifier l'interaction.

### Marques recommandees et score

> Si je redescends sur le dashboard, je vois aussi la section **marques recommandees**.
>
> *[Montrer la tuile des sponsors recommandes]*
>
> Je peux cliquer sur **"View Details"** pour voir le score de matching detaille avec cette marque, et aussi envoyer directement un message. C'est un peu comme LinkedIn ou Le Bon Coin : un **message generique est pre-rempli** pour faciliter la prise de contact.

### Mes campagnes

> Sur la page **"My Campaigns"**, je vois toutes les campagnes auxquelles je participe. Pour chacune, je vois les deadlines, les deliverables attendus, le statut de chaque livrable.

### Marketplace

> Et sur la page **"All Campaigns"**, je peux voir toutes les campagnes disponibles sur la plateforme, sans intervention de l'IA. C'est important parce que certains utilisateurs peuvent etre un peu suspicieux vis-a-vis de l'IA et veulent garder le controle. D'ailleurs, c'etait l'idee de base du projet : simplement creer une marketplace pour mettre en contact createurs et marques. L'IA est venue enrichir cette base.

### Profil

> Sur la page **"Profile"**, je peux gerer mon profil : uploader ma photo, ecrire ma bio, connecter mes reseaux sociaux.

### Leaderboard

> La page **"Leaderboard"** fait partie de notre strategie de gamification. On a un classement des createurs et des sponsors, des challenges quotidiens, hebdomadaires et mensuels, et un systeme d'achievements. L'objectif c'est d'encourager les createurs a etre actifs sur la plateforme et a faire des partenariats.

### Analytics et Messages

> Et comme pour le sponsor, on a les pages **Analytics** et **Messages**.

### Conclusion demo

> Voila pour la demo. Pour resumer, on a une plateforme double-face avec une experience adaptee a chaque type d'utilisateur, alimentee par de l'IA qui analyse en profondeur le contenu pour garantir des matchings pertinents.

---

## PARTIE 4 : QUESTIONS (5-10 min)

> Si vous avez des questions, n'hesitez pas. Je peux rentrer dans le detail technique de n'importe quel composant.

### Questions anticipees et reponses

**Q: Combien de temps prend une analyse complete d'un createur ?**
> Une analyse complete prend entre 10 et 20 secondes. Le goulot d'etranglement c'est l'extraction des transcripts via InnerTube : chaque transcript necessite 2 requetes HTTP (page web + appel InnerTube), et on traite 10 videos en batches de 5 en parallele avec 200ms entre chaque batch. L'appel OpenAI prend environ 2-3 secondes. On a optimise les batches -- au debut on etait a 3 en parallele avec 500ms de delai, maintenant c'est 5 avec 200ms, ce qui a divise le temps quasi par deux.

**Q: Quel est le cout par analyse ?**
> On utilise GPT-4o-mini qui est tres economique : environ $0.15 par million de tokens d'entree. Une analyse complete coute moins d'un centime. L'API YouTube est gratuite dans les limites du quota (10 000 unites/jour).

**Q: Comment vous gerez les couts d'infrastructure ?**
> Cloud Run avec scale-to-zero : quand personne n'utilise la plateforme, on ne paie rien. On est configure a max 2 instances, 512 Mo de RAM, 1 vCPU. Firebase Hosting est gratuit pour notre volume. Au total, pour un site de demo avec ~10 visites/jour, on est a environ 3 centimes par mois (juste le stockage de l'image Docker).

**Q: Pourquoi YouTube InnerTube et pas l'API officielle de transcripts ?**
> YouTube a deux API : la Data API v3, officielle et documentee, et InnerTube, l'API interne utilisee par les apps officielles (Android, iOS, TV). La Data API v3 ne permet pas de telecharger les sous-titres d'une video dont on n'est pas proprietaire. On a essaye 3 autres approches (scraping, baseUrl directe, librairies npm) et toutes echouent en production parce que YouTube bloque les IP de serveurs cloud. InnerTube avec un contexte client Android contourne ca parce que YouTube fait confiance a ses propres apps. La cle API est publique, hardcodee dans l'APK Android, et n'a pas change depuis 5 ans. C'est du reverse-engineering, mais c'est la seule solution viable et c'est robuste.

**Q: L'algorithme de scoring est-il biaise ?**
> Le scoring deterministe est entierement transparent et auditable -- ce sont des formules mathematiques avec des poids definis. La partie IA (60% du score final) utilise GPT-4o-mini en mode JSON avec une temperature de 0.3, donc tres deterministe. On pourrait facilement ajouter un mecanisme de feedback pour affiner les poids au fil du temps.

**Q: Quels reseaux sociaux supportez-vous ?**
> Actuellement YouTube est pleinement integre avec analyse en profondeur. L'architecture est concue pour ajouter Twitter/X et Instagram facilement -- les champs sont deja presents dans la base de donnees (social_platforms, follower_counts). C'est sur la roadmap.

**Q: Comment vous gerez la vie privee des createurs analyses sans leur consentement ?**
> On n'analyse que des donnees publiquement disponibles : les videos publiques, les statistiques de chaine, les transcripts de videos publiques. C'est exactement ce que fait n'importe quel internaute en visitant une chaine YouTube. On ne stocke pas de donnees personnelles, uniquement des metriques d'analyse.

---

---

# CHEAT SHEET TECHNIQUE

## Architecture globale

```
Utilisateur (navigateur)
    |
    | HTTPS
    v
Firebase Hosting (CDN global)
    |
    |-- Fichiers statiques (React app compilee) --> dist/
    |
    |-- /api/** --> URL Rewrite
    |               |
    |               v
    |        Cloud Run "vibematch-ai"
    |        Region: europe-west9 (Paris)
    |        Port: 8080
    |        512 Mo RAM, 1 vCPU
    |        0-2 instances (scale-to-zero)
    |               |
    |               |-- Express.js (server.js)
    |               |     |
    |               |     |-- /health
    |               |     |-- /api/youtube/*    --> server/youtube.js
    |               |     |-- /api/analyze/*    --> server/analyze.js
    |               |     |-- /api/match/*      --> server/match.js
    |               |     |-- /api/campaigns/*  --> server/campaigns.js
    |               |     |-- /api/admin/*      --> server/admin.js
    |               |     |-- /*                --> index.html (SPA fallback)
    |               |
    |               |-- Appels externes :
    |                     |-- YouTube Data API v3
    |                     |-- YouTube InnerTube API (transcripts)
    |                     |-- OpenAI API (gpt-4o-mini)
    |                     |-- Supabase (PostgreSQL + Auth)
```

## Nombre de serveurs

| Service | Nombre | Role |
|---------|--------|------|
| Firebase Hosting | CDN distribue (Google) | Sert les fichiers statiques React, redirige /api vers Cloud Run |
| Cloud Run | 0 a 2 instances | Backend Express.js : API YouTube, analyse IA, scoring, campagnes |
| Supabase | 1 instance PostgreSQL (hebergee) | Base de donnees, authentification, stockage |
| YouTube API | Service Google (externe) | Donnees de chaines et videos |
| OpenAI API | Service OpenAI (externe) | Analyse de profil, recommendations de createurs |

**Total : 1 seul serveur gere par nous** (Cloud Run) + 3 services externes manages (Supabase, YouTube, OpenAI)

## Stack technique

### Frontend
- **React 18.3.1** + TypeScript 5.5.3
- **Vite 5.4.1** (bundler)
- **Tailwind CSS 3.4.11** (styling)
- **ShadCN UI + Radix UI** (composants)
- **React Router v6** (routing client)
- **TanStack React Query** (data fetching + cache)
- **Framer Motion** (animations)

### Backend
- **Express 4.18** (serveur HTTP)
- **googleapis 171.4** (YouTube Data API v3)
- **openai 6.22** (API OpenAI)
- **lda 0.2** (topic modeling)
- **natural 8.1** (NLP / traitement texte)
- **@supabase/supabase-js 2.53** (client BDD)
- **express-rate-limit 8.2** (protection anti-spam)

### Infrastructure
- **Docker** (multi-stage build, node:18-alpine)
- **Google Cloud Run** (serverless containers)
- **Google Cloud Build** (CI/CD)
- **Firebase Hosting** (CDN + domaine)
- **Supabase** (PostgreSQL + Auth + RLS)

## Pipeline d'analyse d'un createur

```
Handle YouTube (ex: @mkbhd)
    |
    v
1. YouTube API v3 - channels.list(forHandle)
   --> ID chaine, nom, abonnes, vues, date creation, pays, keywords, photo
    |
    v
2. YouTube API v3 - playlistItems.list + videos.list
   --> 50 dernieres videos : titre, description, tags, vues, likes, commentaires, duree
    |
    v
3. Calcul de metriques (server/youtube.js:95-180)
   --> avgViews, avgLikes, engagementRate, publishFrequencyDays, topTags, viewsToSubsRatio
    |
    v
4. InnerTube API (Android client) - server/transcript.js
   --> Transcripts des 10 dernieres videos (batch de 5, 200ms entre batches)
   --> Tronque a 500 mots par video
    |
    v
5. LDA Topic Modeling (server/lda-analyzer.js)
   --> Corpus = titres + descriptions + tags + transcripts
   --> 8 topics, 10 termes par topic
   --> Mapping vers 15 niches predefinies avec scores de confiance
    |
    v
6. Classification LLM des niches (server/openai-analyzer.js:248-321)
   --> GPT-4o-mini valide/affine les niches LDA
   --> 15 niches possibles, chacune avec confiance 0-1
    |
    v
7. Analyse de profil OpenAI (server/openai-analyzer.js:13-115)
   --> Prompt structure avec toutes les donnees
   --> Temperature 0.3, mode JSON, max 1000 tokens
   --> 6 categories de scoring (voir ci-dessous)
    |
    v
8. Stockage Supabase
   --> Table ai_analysis : donnees brutes + score
   --> Table profiles : mise a jour niches, engagement_rate, follower_counts
    |
    v
9. Reponse au frontend
   --> Score global, categories, resume, forces, faiblesses, recommandations
```

## 6 categories de scoring OpenAI

| Categorie | Ce qui est evalue | Exemple de critere |
|-----------|-------------------|-------------------|
| **vocabularyLanguage** | Richesse lexicale, articulation, capacite multilingue | Diversite du vocabulaire, structures de phrases complexes |
| **seoMetadata** | Titres, descriptions, tags | Titres accrocheurs, descriptions avec mots-cles, tags pertinents |
| **engagement** | Interaction de l'audience | Ratio likes/vues, frequence de publication, commentaires |
| **audienceReach** | Taille et fidelite de l'audience | Nombre d'abonnes, ratio vues/abonnes, croissance |
| **topicalAuthority** | Expertise et coherence thematique | Profondeur du sujet, coherence entre videos, specialisation |
| **toneBrandVoice** | Style de communication | Authenticite, constance du ton, professionnalisme |

## Algorithme de matching (server/scoring.js)

### Score deterministe (40% du score final)

```
Score = nicheAlignment     * 0.30    (correspondance des niches)
      + engagementQuality  * 0.20    (taux d'engagement vs benchmarks)
      + audienceSize       * 0.15    (taille audience vs budget)
      + contentCompat      * 0.15    (objectifs campagne vs styles contenu)
      + brandSafety        * 0.10    (absence de secteurs evites)
      + activity           * 0.10    (frequence + recence publication)
```

### Tiers d'audience

| Tier | Abonnes | Benchmark engagement |
|------|---------|---------------------|
| Nano | 0-1k | Eleve |
| Micro | 1k-10k | Bon |
| Mid | 10k-100k | Moyen |
| Macro | 100k-1M | Correct |
| Mega | 1M+ | Faible (mais reach enorme) |

### Score IA (60% du score final)

GPT-4o-mini analyse la compatibilite globale et renvoie :
- `compatibilityScore` (0-100)
- `matchFactors` : nicheAlignment, audienceFit, contentQuality, brandSafety, engagementPotential
- `summary`, `recommendations`, `risks`

### Score final

```
finalScore = (deterministicScore * 0.4) + (aiScore * 0.6)
```

## Base de donnees Supabase (14 tables)

| Table | Role |
|-------|------|
| **profiles** | Profils utilisateurs (creator/sponsor), infos, niches, engagement |
| **ai_analysis** | Resultats d'analyses completes (YouTube + LDA + OpenAI) |
| **matchings** | Scores de compatibilite createur-sponsor |
| **campaigns** | Campagnes creees par les sponsors |
| **campaign_creators** | Table de liaison campagne-createur (statut, deliverables) |
| **campaign_analytics** | Metriques de performance des campagnes |
| **conversations** | Fils de discussion createur-sponsor |
| **messages** | Messages individuels dans les conversations |
| **user_subscriptions** | Abonnements (free/pro/elite/starter/business/enterprise) |
| **user_quotas** | Quotas journaliers (super likes, matches mensuels) |
| **swipe_actions** | Actions de swipe (like/dislike/super_like) |
| **achievements** | Badges et accomplissements (gamification) |
| **creator_analytics** | Metriques detaillees par createur |
| **ghost_profiles** | Profils decouverts mais non-inscrits (pour invitations) |

Toutes les tables ont **Row Level Security (RLS)** active : chaque utilisateur ne peut acceder qu'a ses propres donnees.

## Les 2 API YouTube qu'on utilise (et pourquoi)

On utilise **deux API YouTube completement differentes**, et c'est important de comprendre la distinction :

### YouTube Data API v3 (officielle)

- **Statut** : API officielle, publique, documentee par Google
- **Authentification** : Cle API personnelle creee dans la Google Cloud Console
- **Quota** : 10 000 unites/jour gratuites (1 unite = channels.list, 100 unites = search.list)
- **Ce qu'on peut faire** : recuperer les infos de chaine (abonnes, vues, description), lister les videos, obtenir les stats de chaque video (vues, likes, commentaires, duree, tags)
- **Ce qu'on NE PEUT PAS faire** : telecharger les sous-titres d'une video dont on n'est pas proprietaire
- **On l'utilise pour** : toute la collecte de donnees de chaine et de videos (server/youtube.js)

### YouTube InnerTube API (interne, non-documentee)

- **Statut** : API interne de YouTube, utilisee par les apps officielles (Android, iOS, TV, web). Non-documentee, pas de support officiel.
- **Authentification** : Cle API publique hardcodee dans l'app Android YouTube (`AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w`). Cette cle est identique pour les milliards d'utilisateurs Android. YouTube ne peut pas la revoquer sans casser l'app pour tout le monde.
- **Quota** : Pas de quota formel -- rate limiting implicite (d'ou nos batches avec delais)
- **Ce qu'on peut faire** : tout ce que l'app YouTube peut faire, y compris recuperer les transcripts de n'importe quelle video publique
- **Risque** : Google peut changer la structure a tout moment sans prevenir (mais ca n'arrive quasiment jamais car ca casserait les anciennes versions de l'app)
- **On l'utilise UNIQUEMENT pour** : les transcripts (server/transcript.js)

### Comparaison rapide

| | YouTube Data API v3 | InnerTube API |
|---|---|---|
| Officielle | Oui | Non (interne) |
| Documentee | Oui (developers.google.com) | Non (reverse-engineering) |
| Cle API | Perso (Google Console) | Publique (hardcodee dans l'app) |
| Quota | 10 000 unites/jour | Pas de quota formel |
| Transcripts | Interdit (sauf proprietaire) | Accessible via client Android |
| Stabilite | Garantie, versionnee | Peut changer sans prevenir |
| Notre usage | Chaines, videos, stats | Transcripts uniquement |

**En resume** : on utilise l'API officielle pour tout ce qu'elle permet legalement, et InnerTube uniquement pour les transcripts parce qu'il n'y a aucune autre option viable.

---

## Transcript YouTube - Technique InnerTube (la partie la plus galere)

### Le probleme (pourquoi c'etait si difficile)

On avait besoin des transcripts (sous-titres) des videos YouTube pour analyser le contenu des createurs. Ca parait simple, mais c'est un cauchemar technique :

1. **L'API officielle YouTube Captions** (`captions.download`) ne fonctionne que si on est proprietaire de la video ou si on a une autorisation OAuth du proprietaire. Inutilisable pour analyser des createurs tiers.

2. **Le scraping classique** ne marche pas non plus. YouTube genere les sous-titres dynamiquement via JavaScript. Quand on fetch la page d'une video depuis un serveur, on n'obtient que le HTML statique, pas les sous-titres.

3. **L'approche baseUrl** : YouTube expose une `baseUrl` dans les metadata de la video qui pointe vers les fichiers de sous-titres (format XML). MAIS YouTube detecte les IP de serveurs cloud (Google Cloud, AWS, etc.) et **bloque ces requetes** en renvoyant `ip=0.0.0.0`. Ca marchait en local mais pas en production.

4. **Les librairies npm existantes** (`youtube-transcript`, `youtubei.js`) utilisaient toutes cette meme baseUrl en interne, donc elles echouaient aussi en production pour la meme raison.

### La solution : se faire passer pour l'app Android YouTube

On a decouvert que l'**API InnerTube** de YouTube (l'API interne utilisee par toutes les apps YouTube officielles) a un endpoint `get_transcript` qui ne bloque pas les IP serveur **si on se presente comme le client Android**. YouTube fait confiance a ses propres apps.

### Le processus en 4 etapes (server/transcript.js)

**Etape 1 - Scraper la page web de la video** (lignes 18-42)

On fetch la page HTML de la video (`https://www.youtube.com/watch?v=VIDEO_ID`) avec :
- Un **User-Agent de navigateur Chrome** pour que YouTube nous serve la page complete
- Un **header Accept-Language** en anglais pour avoir les sous-titres en anglais
- Un **cookie `CONSENT=PENDING+987`** qui est le truc cle : ca simule l'acceptation du bandeau cookies RGPD de YouTube. Sans ce cookie, YouTube en Europe redirige vers une page de consentement et on n'obtient jamais le contenu de la video.

De cette page HTML, on extrait :
- Les **cookies de session** renvoyes par YouTube (`Set-Cookie` headers) -- necessaires pour l'etape 3
- Le **VISITOR_DATA** : un identifiant de visiteur que YouTube genere et qui est requis pour authentifier les appels InnerTube. On l'extrait avec une regex depuis le JavaScript inline de la page.
- Les **transcript params** : un token encode en base64 cache dans le JSON `ytInitialData` de la page, dans la section `engagementPanels` > `engagement-panel-searchable-transcript`. Ce token identifie de maniere unique les sous-titres de cette video.

**Etape 2 - Extraire les params de transcript du JSON ytInitialData** (lignes 119-149)

Le JSON `ytInitialData` est enorme (plusieurs Mo). On ne peut pas simplement faire `JSON.parse()` sur le HTML brut. On a du implementer un **parseur a comptage d'accolades** (brace counting, lignes 155-190) qui :
- Trouve le debut du JSON apres `var ytInitialData = `
- Compte les accolades ouvrantes/fermantes en gerant les chaines de caracteres et les echappements
- Extrait exactement le bon objet JSON sans se tromper de fermeture

Ensuite on navigue dans cet objet pour trouver le panneau de transcription :
```
engagementPanels[]
  > engagementPanelSectionListRenderer (panelIdentifier = "engagement-panel-searchable-transcript")
    > content > continuationItemRenderer > continuationEndpoint > getTranscriptEndpoint > params
```

Si ce panneau n'existe pas, la video n'a pas de sous-titres (ni automatiques, ni manuels).

**Etape 3 - Appel InnerTube get_transcript en tant qu'Android** (lignes 44-67)

C'est l'astuce principale. On appelle :
```
POST https://www.youtube.com/youtubei/v1/get_transcript?key=AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w
```

Avec :
- **User-Agent Android** : `com.google.android.youtube/19.02.39 (Linux; U; Android 11) gzip`
  Ca fait croire a YouTube que c'est l'app YouTube pour Android v19.02.39 qui fait la requete
- **Cookies de session** recuperes a l'etape 1 (necessaires pour la validation)
- **X-Goog-Visitor-Id** : le VISITOR_DATA extrait a l'etape 1 (lie la requete a la session)
- **Corps JSON** avec un contexte client Android :
  ```json
  {
    "context": {
      "client": {
        "clientName": "ANDROID",
        "clientVersion": "19.02.39",
        "hl": "en",
        "visitorData": "<VISITOR_DATA>"
      }
    },
    "params": "<token base64 de l'etape 2>"
  }
  ```

La **cle API** (`AIzaSyA8...`) est une cle publique d'InnerTube, identique pour tous les clients Android YouTube. Elle n'est pas secrete.

**Etape 4 - Extraction du texte** (lignes 76-108)

La reponse InnerTube a une structure profondement imbriquee :
```
actions[0]
  > elementsCommand > transformEntityCommand > arguments
    > transformTranscriptSegmentListArguments > overwrite > initialSegments[]
      > transcriptSegmentRenderer > snippet
        > elementsAttributedString > content (texte)
        OU > simpleText (texte)
        OU > runs[] > text (texte)
```

On parcourt chaque segment, on extrait le texte (en essayant 3 formats differents car YouTube n'est pas consistant), on concatene tout, et on tronque a **500 mots** par video pour ne pas exploser les tokens OpenAI.

### Gestion du rate limiting (lignes 196-229)

Pour eviter de se faire bloquer par YouTube, on fetch les transcripts en :
- **Batches de 5 videos** en parallele
- **200ms de delai** entre chaque batch
- **Promise.allSettled()** pour que l'echec d'un transcript ne bloque pas les autres
- On traite les **10 dernieres videos** maximum par createur

Avec 10 videos : 2 batches de 5, 1 seul delai de 200ms = **0.2s de pause totale**.
Le vrai temps c'est les requetes HTTP (~2-3s par transcript), donc ~8-15s au total pour 10 videos.

En pratique, on recupere entre 7 et 10 transcripts sur 10 (certaines videos n'ont pas de sous-titres ou sont en live).

### Pourquoi c'est robuste

Cette approche fonctionne parce que :
- YouTube ne bloque pas ses propres clients (Android, iOS, TV)
- La cle API InnerTube est publique et stable (inchangee depuis des annees)
- Le cookie CONSENT contourne le RGPD sans interaction utilisateur
- Le VISITOR_DATA + cookies de session legitimisent la requete
- Le parseur a comptage d'accolades est resistant aux changements de structure HTML

### Ce qui pourrait casser

- YouTube change le format de `ytInitialData` (rare, mais possible)
- YouTube revoque la cle InnerTube Android (jamais arrive en 5+ ans)
- YouTube ajoute une verification supplementaire pour les clients Android (signature APK, etc.)
- Changement de la structure de reponse `get_transcript` (on gere deja 3 formats differents)

## LDA (Latent Dirichlet Allocation)

**Quoi** : Algorithme de topic modeling non-supervise (statistique bayesienne).

**Comment** :
1. Construction du corpus : 1 document = 1 video (titre + description + tags + transcript)
2. Preprocessing : lowercase, suppression des stopwords (anglais + francais, 128 mots), suppression ponctuation, mots < 3 caracteres
3. Execution LDA : 8 topics, 10 termes par topic
4. Mapping des topics vers 15 niches predefinies via dictionnaires de mots-cles
5. Normalisation et retour des top 5 niches avec score de confiance

**15 niches predefinies** : Technology, Gaming, Beauty, Fitness, Fashion, Food, Travel, Education, Entertainment, Music, Finance, Lifestyle, Science, Sports, Sustainability

## Securite et rate limiting

- **Rate limiting** : 50 requetes / 15 minutes par IP sur /api/*
- **Cles API** : jamais dans le code, passees via Cloud Build substitutions
- **CORS** : meme origine (Firebase Hosting)
- **RLS Supabase** : isolation des donnees par utilisateur
- **Docker multi-stage** : image de production ne contient pas les devDependencies

## Cout mensuel (site de demo ~10 visites/jour)

| Service | Cout |
|---------|------|
| Cloud Run (scale-to-zero) | ~$0 (free tier : 2M requetes/mois) |
| GCR (1 image ~273 Mo) | ~$0.03 |
| Firebase Hosting | $0 (free tier : 10 Go/mois) |
| Supabase (free tier) | $0 |
| YouTube API | $0 (10 000 unites/jour gratuit) |
| OpenAI (gpt-4o-mini) | ~$0.01 par analyse |
| **Total** | **< $1/mois** |

## Deployment pipeline

```
Code push
    |
    v
Cloud Build (cloudbuild.yaml)
    |
    |-- Step 1: docker build (multi-stage)
    |     |-- Stage 1: npm ci + npm run build (Vite compile React)
    |     |-- Stage 2: npm ci --production + copy dist/ + copy server/
    |
    |-- Step 2-3: docker push vers GCR
    |     |-- gcr.io/vibematch-ai/vibematch-app:$BUILD_ID
    |     |-- gcr.io/vibematch-ai/vibematch-app:latest
    |
    |-- Step 4: gcloud run deploy
    |     |-- Image depuis GCR
    |     |-- Region europe-west9
    |     |-- Env vars via substitutions
    |
    v
Cloud Run sert le container
Firebase Hosting pointe /api/** vers Cloud Run
```

## Pages de l'application

### Cote Sponsor
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | /dashboard | KPIs, campaigns, creator table, analytics |
| Discover | /discover | Recherche et analyse IA de createurs |
| Analytics | /analytics | Performance des campagnes |
| Messages | /messages | Messagerie avec createurs |
| Profile | /profile | Infos entreprise, industrie, budget |

### Cote Createur
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | /dashboard | Score IA, sponsors recommandes, performance |
| AI Matches | /matches | Interface Tinder-like avec sponsors |
| My Campaigns | /campaigns | Campagnes actives, deliverables, deadlines |
| All Campaigns | /market | Marketplace de toutes les campagnes |
| Leaderboard | /leaderboard | Classement, challenges, achievements |
| Analytics | /analytics | Vues, engagement, croissance |
| Messages | /messages | Messagerie avec sponsors |
| Profile | /profile | Photo, bio, reseaux sociaux |

## Fichiers cles du backend

| Fichier | Lignes | Role |
|---------|--------|------|
| `server.js` | 89 | Point d'entree Express, middleware, routing |
| `server/youtube.js` | ~258 | YouTube API : resolve handle, fetch videos, metriques |
| `server/transcript.js` | ~229 | InnerTube API : extraction transcripts Android |
| `server/lda-analyzer.js` | ~287 | LDA topic modeling + keyword fallback |
| `server/openai-analyzer.js` | ~400 | Analyse OpenAI : profil, compatibilite, niches, recommendations |
| `server/scoring.js` | ~248 | Scoring deterministe : 6 facteurs ponderes |
| `server/match.js` | ~128 | Endpoint matching : combine deterministe + IA |
| `server/analyze.js` | ~158 | Orchestrateur : YouTube -> LDA -> OpenAI -> Supabase |
| `server/campaigns.js` | ~89 | CRUD campagnes + recommendations IA |
| `server/admin.js` | ~138 | Stats plateforme + research tool |
| `server/supabase.js` | ~10 | Initialisation client Supabase |
