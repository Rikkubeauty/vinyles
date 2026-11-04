import { json, isAdmin, denied } from "../../lib/http.js";

// Discogs limite les serveurs Cloudflare (adresses partagées) : la recherche se fait depuis le navigateur.
// Le jeton n'est donné qu'à celui qui a la clé d'édition (il en a besoin pour ajouter un disque).
export async function onRequestGet({ request, env }) {
  if (!isAdmin(request, env)) return denied();
  const jeton = (env.DISCOGS_TOKEN || "").trim();
  if (!jeton) return json({ erreur: "Le jeton Discogs n'est pas configuré sur Cloudflare." }, 500);
  return json({ jeton });
}
