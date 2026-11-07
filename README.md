# La discothèque d’Eduardo

Une discothèque de vinyles en Cover Flow 3D : les pochettes défilent, le vinyle sort de son carton au survol, et chaque disque s'ouvre sur sa fiche (date, lieu d'enregistrement, compositeurs, crédits, anecdotes, faces A/B).

- **Écoute** : extraits de 30 s et lecteur complet Deezer (morceaux entiers si tu es connecté à Deezer).
- **Ajouter un disque** (bouton en haut à droite) : tape un titre, un artiste, un EAN ou un code-barres, ou scanne le code-barres avec la caméra (Chrome, Edge, Android). Les pressages Discogs s'affichent pendant la frappe ; un clic ajoute le disque avec sa fiche complète. Il faut ton jeton personnel Discogs (https://www.discogs.com/settings/developers), qui reste dans ton navigateur.

- **Mode liste** : bascule « Pochettes / Liste » pour voir la collection en tableau triable, modifier toutes les infos d'un disque (pochette, morceaux, notes…), supprimer un ou plusieurs disques, ou créer un disque à la main.
- **Liste de souhaits** : « Ma collection / Mes souhaits » en haut ; choisis l'étagère au moment d'ajouter, puis « Je l'ai ! » pour passer un souhait dans la collection.

## En ligne sur Cloudflare

Pour installer le site sur un autre compte Cloudflare, suivre [INSTALLATION.md](INSTALLATION.md).

Le site tourne sur **Cloudflare Pages** :

- `index.html` : la page
- `functions/api/` : l'API (collection et souhaits dans la base D1 `vinyles`, photos de pochettes dans le bucket R2 `vinyles-pochettes`, relais Discogs)
- `wrangler.toml` : les liaisons vers la base et le bucket

Deux secrets à régler dans Cloudflare (Workers & Pages → vinyles → Settings → Variables and Secrets) :

- `DISCOGS_TOKEN` : ton jeton personnel Discogs, jamais visible dans la page
- `ADMIN_KEY` : la clé d'édition. Les visiteurs voient la discothèque ; avec la clé (cadenas en haut), tu ajoutes, modifies et supprimes.

Ouverte en fichier local, la page marche aussi, mais garde tout dans le navigateur et demande ton jeton Discogs.

## Sauvegarde

« Télécharger collection.json » dans le panneau d'ajout exporte toute la collection.


## Sauvegardes

À chaque modification, si la semaine n'a pas encore sa copie, toute la base est copiée dans R2 (`sauvegardes/AAAA-Sxx.json`).
Le bouton « Sauvegarde » de la vue Liste télécharge une copie immédiate (clé d'édition requise).
`GET /api/sauvegarde?liste` liste les copies hebdomadaires, `?semaine=2026-S45` en télécharge une.

## Liste de souhaits partagée

Le bouton Partager donne le lien `/?souhaits`. La famille peut y réserver un disque (« Je l'offre »).
Les réservations sont dans la table `reservations` (voir `schema.sql`) et ne sont jamais affichées en mode édition.
