import { json } from "../../../lib/http.js";

// Relais vers l'API Discogs : le jeton (secret DISCOGS_TOKEN) reste côté Cloudflare.
const ALLOWED = [/^database\/search$/, /^releases\/\d+$/, /^masters\/\d+$/];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function onRequestGet({ request, env, params }) {
  const path = (params.path || []).join("/");
  if (!ALLOWED.some((re) => re.test(path))) return json({ erreur: "Chemin non autorisé." }, 404);
  const token = (env.DISCOGS_TOKEN || "").trim();
  if (!token) return json({ erreur: "Le jeton Discogs n'est pas configuré sur Cloudflare (secret DISCOGS_TOKEN)." }, 500);
  const url = new URL("https://api.discogs.com/" + path);
  url.search = new URL(request.url).search;
  url.searchParams.delete("token");

  const call = () =>
    fetch(url, {
      headers: {
        Authorization: "Discogs token=" + token,
        "User-Agent": "DiscothequeEduardo/1.0 +https://vinyles.pages.dev",
        Accept: "application/vnd.discogs.v2.discogs+json",
      },
      // Seules les réponses réussies sont mises en cache : une erreur ne doit jamais rester collée.
      cf: { cacheTtlByStatus: { "200-299": 3600, "300-599": 0 } },
    });

  let r = await call();
  for (let i = 0; i < 2 && r.status === 429; i++) {
    await sleep(1200 * (i + 1));
    r = await call();
  }

  const body = await r.text();
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": r.ok ? "public, max-age=3600" : "no-store",
    "x-discogs-statut": String(r.status),
  };
  const restant = r.headers.get("x-discogs-ratelimit-remaining");
  if (restant) headers["x-discogs-restant"] = restant;
  if (r.ok) return new Response(body, { status: 200, headers });

  let message = "";
  try { message = JSON.parse(body).message || ""; } catch { message = body.slice(0, 200); }
  return new Response(JSON.stringify({ erreur: message || "Discogs a répondu " + r.status, statut: r.status }), {
    status: r.status,
    headers,
  });
}
