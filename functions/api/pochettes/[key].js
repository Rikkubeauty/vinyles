// Sert une pochette stockée dans R2.
export async function onRequestGet({ env, params }) {
  const key = String(params.key || "");
  if (key.includes("/") || key.startsWith("sauvegardes")) return new Response("Introuvable", { status: 404 });
  const obj = await env.POCHETTES.get(key);
  if (!obj) return new Response("Introuvable", { status: 404 });
  return new Response(obj.body, {
    headers: { "content-type": obj.httpMetadata?.contentType || "image/jpeg", "cache-control": "public, max-age=31536000, immutable" },
  });
}
