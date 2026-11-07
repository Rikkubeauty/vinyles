# Installer la discothèque sur un nouveau compte Cloudflare

Ce guide met le site en ligne sur **votre** compte GitHub et **votre** compte Cloudflare, avec une discothèque vide.
Compter une vingtaine de minutes. Tout se fait dans le navigateur, rien à installer.

## 1. Copier le dépôt sur GitHub

1. Ouvrir https://github.com/hugoflying/vinyles et cliquer sur **Fork** (ou demander à Hugo de transférer le dépôt).
2. Garder le nom `vinyles`.

## 2. Créer la base de données (D1)

1. Sur https://dash.cloudflare.com : **Storage & Databases → D1 SQL Database → Create**.
2. Nom : `vinyles`. Valider.
3. Sur la page de la base, copier le **Database ID** (une suite comme `c6c5b8e4-554b-…`).

Les tables se créent toutes seules au premier passage sur le site : aucune commande SQL à taper.

## 3. Créer le stockage des pochettes (R2)

1. **Storage & Databases → R2 Object Storage**. La première fois, Cloudflare demande d'activer R2 (gratuit jusqu'à 10 Go, une carte bancaire peut être demandée).
2. **Create bucket**, nom exact : `vinyles-pochettes`. Valider.

## 4. Mettre votre base dans le dépôt

1. Sur GitHub, dans votre copie du dépôt, ouvrir `wrangler.toml` puis le crayon (Edit).
2. Remplacer la valeur de `database_id` par le Database ID copié à l'étape 2.
3. **Commit changes**.

## 5. Créer le site sur Cloudflare Pages

1. **Workers & Pages → Create → Pages → Connect to Git**, autoriser GitHub, choisir le dépôt `vinyles`.
2. Framework preset : **None**. Build command : vide. Build output directory : `.` (un point).
3. **Save and Deploy**. Le site reçoit une adresse du type `vinyles-xxx.pages.dev`.

## 6. Régler les deux secrets

Dans **Workers & Pages → vinyles → Settings → Variables and Secrets**, ajouter (type **Secret**, environnement Production) :

| Nom | Valeur |
| --- | --- |
| `ADMIN_KEY` | Un mot de passe au choix. C'est la clé du cadenas pour ajouter, modifier et supprimer des disques. |
| `DISCOGS_TOKEN` | Un jeton personnel Discogs, à créer sur https://www.discogs.com/settings/developers (« Generate new token »). |

Puis **Deployments → … → Retry deployment** pour que les secrets soient pris en compte.

## 7. Vérifier

1. Ouvrir l'adresse du site : la discothèque s'affiche, vide.
2. Cliquer sur le cadenas et entrer la clé `ADMIN_KEY`.
3. Ajouter un disque avec le bouton + : il doit rester après rechargement de la page.

Si un message parle de la base ou du stockage, vérifier les noms exacts (`vinyles` et `vinyles-pochettes`) et le `database_id` de `wrangler.toml`.
