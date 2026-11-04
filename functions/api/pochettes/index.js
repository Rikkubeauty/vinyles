import { json, isAdmin, denied } from "../../../lib/http.js";

// Reçoit une photo de pochette (JPEG/PNG/WebP, 3 Mo max) et la range dans R2.
export async function onRequestPost({ request, env }) {
  if (!isAdmin(request, env)) return denied();
  const type = request.headers.get("content-type") || "";
  if (!/^image\/(jpeg|png|webp)$/.test(type)) return json({ erreur: "Format d'image non pris en charge." }, 415);
  const body = await request.arrayBuffer();
  if (body.byteLength > 3_000_000) return json({ erreur: "Image trop lourde (3 Mo max)." }, 413);
  const key = crypto.randomUUID() + "." + type.split("/")[1].replace("jpeg", "jpg");
  await env.POCHETTES.put(key, body, { httpMetadata: { contentType: type } });
  return json({ url: "/api/pochettes/" + key });
}
