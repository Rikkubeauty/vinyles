import { json, isAdmin, denied } from "../../lib/http.js";
import { exportComplet } from "../../lib/sauvegarde.js";

// GET /api/sauvegarde            → export complet maintenant (fichier JSON)
// GET /api/sauvegarde?liste      → liste des sauvegardes hebdomadaires
// GET /api/sauvegarde?semaine=X  → une sauvegarde hebdomadaire
export async function onRequestGet({ request, env }) {
  if (!isAdmin(request, env)) return denied();
  const u = new URL(request.url);
  if (u.searchParams.has("liste")) {
    const l = await env.POCHETTES.list({ prefix: "sauvegardes/" });
    return json(l.objects.map((o) => ({ semaine: o.key.slice(12, -5), taille: o.size, date: o.uploaded })).reverse());
  }
  const sem = u.searchParams.get("semaine");
  let body, nom;
  if (sem) {
    if (!/^\d{4}-S\d{2}$/.test(sem)) return json({ erreur: "Semaine invalide." }, 400);
    const o = await env.POCHETTES.get(`sauvegardes/${sem}.json`);
    if (!o) return json({ erreur: "Pas de sauvegarde pour cette semaine." }, 404);
    body = o.body; nom = `discotheque-${sem}.json`;
  } else {
    body = JSON.stringify(await exportComplet(env), null, 2); nom = `discotheque-${new Date().toISOString().slice(0, 10)}.json`;
  }
  return new Response(body, {
    headers: { "content-type": "application/json; charset=utf-8", "content-disposition": `attachment; filename="${nom}"`, "cache-control": "no-store" },
  });
}
