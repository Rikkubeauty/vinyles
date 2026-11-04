# La discothèque d’Eduardo

Une discothèque de vinyles en Cover Flow 3D : les pochettes défilent, le vinyle sort de son carton au survol, et chaque disque s'ouvre sur sa fiche (date, lieu d'enregistrement, compositeurs, crédits, anecdotes, faces A/B).

- **Écoute** : extraits de 30 s et lecteur complet Deezer (morceaux entiers si tu es connecté à Deezer).
- **Ajouter un disque** (bouton en haut à droite) : tape un titre, un artiste, un EAN ou un code-barres, ou scanne le code-barres avec la caméra (Chrome, Edge, Android). Les pressages Discogs s'affichent pendant la frappe ; un clic ajoute le disque avec sa fiche complète. Il faut ton jeton personnel Discogs (https://www.discogs.com/settings/developers), qui reste dans ton navigateur.

- **Mode liste** : bascule « Pochettes / Liste » pour voir la collection en tableau triable, modifier toutes les infos d'un disque (pochette, morceaux, notes…), supprimer un ou plusieurs disques, ou créer un disque à la main.
- **Liste de souhaits** : « Ma collection / Mes souhaits » en haut ; choisis l'étagère au moment d'ajouter, puis « Je l'ai ! » pour passer un souhait dans la collection.

## En ligne sur Cloudflare

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
