// Pochettes externes (Discogs, Cover Art Archive, Deezer) recopiées une fois dans R2 puis servies par le site :
// plus de pochette à moitié chargée quand le site d'origine limite ou coupe le téléchargement.
const HOSTS = ["i.discogs.com", "img.discogs.com", "coverartarchive.org", "e-cdns-images.dzcdn.net", "cdn-images.dzcdn.net", "cdns-images.dzcdn.net"];
const MAX = 5_000_000;

async function keyFor(url) {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(url));
  return "cache/" + [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function onRequestGet({ request, env }) {
  const u = new URL(request.url).searchParams.get("u") || "";
  let src;
  try { src = new URL(u); } catch (e) { return new Response("Adresse invalide", { status: 400 }); }
  if (src.protocol !== "https:" || !HOSTS.includes(src.hostname)) return new Response("Hôte non autorisé", { status: 400 });

  const key = await keyFor(src.href);
  const hit = await env.POCHETTES.get(key);
  if (hit) return new Response(hit.body, { headers: { "content-type": hit.httpMetadata?.contentType || "image/jpeg", "cache-control": "public, max-age=31536000, immutable" } });

  try {
    const r = await fetch(src.href, { headers: { "user-agent": "MaDiscotheque/1.0 (+https://github.com/hugoflying/vinyles)", accept: "image/*" } });
    const type = (r.headers.get("content-type") || "").split(";")[0];
    if (!r.ok || !type.startsWith("image/")) throw new Error("source " + r.status);
    const body = await r.arrayBuffer();
    const len = +r.headers.get("content-length") || 0;
    if (!body.byteLength || body.byteLength > MAX || (len && len !== body.byteLength)) throw new Error("image incomplète");
    await env.POCHETTES.put(key, body, { httpMetadata: { contentType: type } });
    return new Response(body, { headers: { "content-type": type, "cache-control": "public, max-age=31536000, immutable" } });
  } catch (e) {
    // en dernier recours, le navigateur va chercher l'image à la source
    return Response.redirect(src.href, 302);
  }
}
