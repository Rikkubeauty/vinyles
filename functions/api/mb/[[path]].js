import { json } from "../../../lib/http.js";

// Relais vers MusicBrainz : il demande un User-Agent identifiable et 1 requête par seconde.
const ALLOWED = [/^release$/, /^release\/[0-9a-f-]{36}$/];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function onRequestGet({ request, params }) {
  const path = (params.path || []).join("/");
  if (!ALLOWED.some((re) => re.test(path))) return json({ erreur: "Chemin non autorisé." }, 404);
  const url = new URL("https://musicbrainz.org/ws/2/" + path);
  url.search = new URL(request.url).search;
  url.searchParams.set("fmt", "json");

  const call = () =>
    fetch(url, {
      headers: { "User-Agent": "DiscothequeEduardo/1.0 ( https://vinyles.pages.dev )", Accept: "application/json" },
      cf: { cacheTtlByStatus: { "200-299": 86400, "300-599": 0 } },
    });
  let r = await call();
  for (let i = 0; i < 2 && (r.status === 503 || r.status === 429); i++) {
    await sleep(1100 * (i + 1));
    r = await call();
  }
  const body = await r.text();
  if (r.ok)
    return new Response(body, {
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=86400" },
    });
  let message = "";
  try { message = JSON.parse(body).error || ""; } catch { message = body.slice(0, 200); }
  return new Response(JSON.stringify({ erreur: message || "MusicBrainz a répondu " + r.status, statut: r.status }), {
    status: r.status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
