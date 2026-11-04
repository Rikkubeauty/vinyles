export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

// Les écritures demandent la clé d'édition (secret ADMIN_KEY) dans l'en-tête X-Cle.
export function isAdmin(request, env) {
  const key = request.headers.get("x-cle") || "";
  if (!env.ADMIN_KEY || key.length !== env.ADMIN_KEY.length) return false;
  let diff = 0;
  for (let i = 0; i < key.length; i++) diff |= key.charCodeAt(i) ^ env.ADMIN_KEY.charCodeAt(i);
  return diff === 0;
}
export const denied = () => json({ erreur: "Clé d'édition manquante ou incorrecte." }, 401);
