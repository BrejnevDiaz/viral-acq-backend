# Acquisition Pro — Rapport Stratégique #1
**De : Ton Co-fondateur Stratégique (Product & Growth)**
**Objet : Rétention quotidienne, conversion 48h, 100 premiers clients Marques**

---

## Axe 1 — La Killer Feature (Rétention quotidienne)

Le AdSpy fait venir. Il ne fait pas revenir. Ce qui fait revenir, c'est ce qui **change tous les jours** et ce qui **touche l'ego ou l'argent**. Deux features, dans l'ordre de priorité :

### Feature A — Le "Creator Score" + Leaderboard vivant (priorité absolue)
Un score public par créateur (0-1000), recalculé **chaque nuit**, basé sur : vues générées, taux d'engagement, ROAS estimé des pubs qui utilisent leurs vidéos, réactivité aux messages.

- **Pourquoi les créateurs reviennent chaque jour** : leur score bouge tous les matins. Notification push PWA à 9h : « Ton score a bougé : +12 pts. Tu es passé Top 8% en Beauté. » Personne ne résiste à ça — c'est le mécanisme Duolingo/LinkedIn SSI appliqué à leur gagne-pain.
- **Pourquoi les marques reviennent chaque jour** : onglet « Movers » — les créateurs qui montent le plus vite dans les dernières 24h. C'est là que sont les bonnes affaires (talents pas encore chers). Une marque qui rate un Mover rate une opportunité.
- **Gamification** : badges de streak (connexion + réponse rapide = badge « Réactif » visible par les marques), paliers Bronze/Argent/Or/Elite qui débloquent une meilleure visibilité dans la recherche.
- **Effet secondaire monétisable** : le score devient LA monnaie de la plateforme. Les créateurs le mettent dans leur bio Instagram/TikTok → acquisition gratuite (voir Axe 3).

**Brief pour Opus 4.8** : cron job nocturne de calcul, page profil avec graphique d'évolution du score, notif push PWA quotidienne, onglet Movers côté marques avec delta 24h/7j.

### Feature B — Le "Drop Quotidien" (mécanisme d'urgence)
Chaque matin à 9h, la plateforme publie le **Drop du jour** : les 10 créatives les plus performantes détectées dans les dernières 24h + les 5 créateurs derrière. **Visible 24h, puis archivé derrière le paywall.**

- **Pour les marques** : FOMO structurel. Si tu ne te connectes pas aujourd'hui, tu as raté le drop d'aujourd'hui. C'est le mécanisme BeReal appliqué au B2B.
- **Pour les créateurs** : être « dans le Drop » = le graal. Ils partagent leur apparition sur leurs réseaux (screenshot brandé auto-généré, prêt à poster) → boucle virale.
- **Croisement avec le CRM** : depuis le Drop, bouton « Contacter ce créateur » en 1 clic → alimente le pipeline CRM. Le Drop nourrit directement l'usage du produit payant.

**Brief pour Opus 4.8** : sélection algorithmique quotidienne, compte à rebours visible, archive verrouillée (les Drops passés = feature payante), image de partage auto-générée pour les créateurs.

**Décision** : Feature A d'abord (elle crée l'habitude), Feature B en semaine 2 (elle crée l'urgence). Les deux se renforcent.

---

## Axe 2 — Le Tunnel de Monétisation (conversion 48h)

Principe directeur : **montrer 100% de la valeur, verrouiller 100% de l'action.** L'utilisateur gratuit doit voir exactement ce qu'il rate, au pixel près. Un point d'hygiène : la frustration doit venir d'une valeur réelle retenue, pas de fausse rareté — les faux compteurs se repèrent et tuent la confiance (et donc le pricing à 299€).

### Architecture du paywall

- **Le flou stratégique (blur, pas masquage)** : en gratuit, la marque voit les métriques complètes (vues, ROAS, score) mais le **nom, la photo et le contact du créateur sont floutés**. Elle sait qu'un créateur à 890/1000 fait +400% de ROAS en cosmétique — elle ne sait pas qui c'est. C'est le modèle Similarweb/Apollo : la donnée prouve la valeur, l'identité est le produit.
- **3 crédits de déblocage offerts à l'inscription** : elle débloque 3 profils, contacte, voit que ça marche. Les crédits sont consommés en 20 minutes — c'est voulu. Le paywall frappe au moment exact de l'intention maximale : le clic sur « Contacter » du 4e créateur.
- **Le paywall contextuel, pas générique** : la modale ne dit pas « Passez Premium ». Elle dit : « Ce créateur a généré 2,3M de vues ce mois-ci. 4 marques l'ont contacté cette semaine. Débloquez-le maintenant. » Chiffres réels, injectés dynamiquement.
- **L'offre 48h** : à l'inscription, un timer démarre — **-30% sur le premier mois de n'importe quel plan, valable 48h**, bandeau persistant avec compte à rebours. Vraie deadline, vraiment expirée après 48h (sinon plus personne ne croit jamais tes deadlines).
- **Ancrage sur l'Elite** : la page pricing affiche 3 plans, Elite 299€ en position centrale surlignée « Choisi par les marques qui scalent », avec le plan intermédiaire conçu pour paraître frustrant (quota de contacts vite atteint). L'intermédiaire existe pour vendre l'Elite.
- **Relance automatique** : email + push à H+24 (« Il te reste 24h sur ton offre ») et H+46 (« Dernière chance + le créateur X que tu as consulté vient de monter de 40 places »).

### Brief design pour Opus 4.8

- Blur CSS sur identité créateur (données serveur jamais envoyées au client — le blur front seul se contourne en 10 secondes via l'inspecteur).
- Modale paywall avec données dynamiques du créateur consulté + preuve sociale réelle.
- Timer 48h persistant (header), état stocké côté serveur.
- Checkout Stripe en 1 clic depuis la modale — zéro page intermédiaire. Chaque page de plus = -10% de conversion.
- Événements analytics sur chaque hit du paywall : tu dois savoir quel écran convertit.

---

## Axe 3 — Go-To-Market : 100 marques payantes avant fin juillet

Oublie les ads (trop lent, trop cher à ce stade). Trois leviers, tous exécutables cette semaine :

### Levier 1 — L'Audit Créatif Offensif (outbound qui ne ressemble pas à de l'outbound)
Cible : les marques e-commerce **qui diffusent déjà des pubs UGC** (repérables via les bibliothèques publicitaires Meta/TikTok). Elles ont le budget et le problème.

- Pour chaque marque ciblée, génère avec ta propre plateforme un **mini-rapport personnalisé** : « Vos 3 pubs actuelles vs les 3 créateurs de votre niche qui performent 2 à 5x mieux ». PDF brandé + Loom de 90 secondes.
- Envoi : email + DM LinkedIn au fondateur/head of growth. Tu ne vends pas un outil, tu livres un résultat avant même le premier appel.
- Volume : 30 audits/jour = ~600 sur le mois. À 5-8% de conversion sur une cible aussi chaude, tu es dans les 30-50 clients sur ce seul levier.

### Levier 2 — Les créateurs comme force de vente (supply-side virality)
Tes créateurs gratuits sont ton armée commerciale — arme-les.

- Chaque créateur reçoit un **Media Kit public auto-généré** : page web avec son Creator Score, ses stats live, ses meilleures créatives. Il l'envoie aux marques pour se vendre — il le fera, c'est son intérêt direct.
- Chaque Media Kit contient un CTA marque : « Voyez les 200 créateurs similaires sur Acquisition Pro ». Chaque créateur qui prospecte prospecte **pour toi**.
- Bonus : programme de parrainage inversé — un créateur qui amène une marque payante gagne un boost de visibilité (coût marginal : zéro).

### Levier 3 — Le Leaderboard public comme machine à PR (ego bait)
Publie chaque mois le **« Top 50 des créateurs UGC »** (par pays/niche) sur une page publique SEO-optimisée.

- Les créateurs classés le partagent massivement (c'est leur trophée) → des milliers d'impressions gratuites auprès de leur audience... qui contient leurs clients : les marques.
- Les données de contact et les scores détaillés du Top 50 sont derrière l'inscription → chaque partage ramène des marques directement dans ton tunnel de l'Axe 2.
- Pousse le classement aux newsletters/médias e-commerce : un classement inédit avec données propriétaires, c'est exactement ce qu'ils cherchent à publier.

### Math de l'objectif
100 clients × ~150€ de panier moyen = ~15K€ MRR fin juillet. Répartition réaliste : Levier 1 → 40-50, Levier 2 → 20-30, Levier 3 → 15-25. Le levier 1 est le seul 100% sous ton contrôle : c'est lui que tu exécutes personnellement, tous les jours.

---

## Ordre de marche pour Opus 4.8 (cette semaine)

1. Creator Score + notif push quotidienne (Axe 1A) — le cœur de la rétention.
2. Blur + 3 crédits + paywall contextuel + timer 48h (Axe 2) — la machine à cash.
3. Media Kit public auto-généré (Axe 3, levier 2) — la boucle d'acquisition.
4. Drop Quotidien (Axe 1B) — semaine 2.
5. Page Leaderboard publique (Axe 3, levier 3) — semaine 2-3.

Le AdSpy attire. Le Score retient. Le blur convertit. Les créateurs recrutent. Exécute dans cet ordre.
