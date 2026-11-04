// Sert une pochette stockée dans R2.
export async function onRequestGet({ env, params }) {
  const obj = await env.POCHETTES.get(params.key);
  if (!obj) return new Response("Introuvable", { status: 404 });
  return new Response(obj.body, {
    headers: { "content-type": obj.httpMetadata?.contentType || "image/jpeg", "cache-control": "public, max-age=31536000, immutable" },
  });
}
