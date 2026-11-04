import { json } from "../../../lib/http.js";

// Relais vers l'API Discogs : le jeton (secret DISCOGS_TOKEN) reste côté Cloudflare.
const ALLOWED = [/^database\/search$/, /^releases\/\d+$/, /^masters\/\d+$/];

export async function onRequestGet({ request, env, params }) {
  const path = (params.path || []).join("/");
  if (!ALLOWED.some((re) => re.test(path))) return json({ erreur: "Chemin non autorisé." }, 404);
  if (!env.DISCOGS_TOKEN) return json({ erreur: "Le jeton Discogs n'est pas configuré sur Cloudflare." }, 500);
  const url = new URL("https://api.discogs.com/" + path);
  url.search = new URL(request.url).search;
  url.searchParams.delete("token");
  const r = await fetch(url, {
    headers: {
      Authorization: "Discogs token=" + env.DISCOGS_TOKEN,
      "User-Agent": "DiscothequeEduardo/1.0",
      Accept: "application/vnd.discogs.v2.discogs+json",
    },
    cf: { cacheTtl: 3600, cacheEverything: true },
  });
  return new Response(r.body, {
    status: r.status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
