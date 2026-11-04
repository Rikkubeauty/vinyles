import { json, isAdmin } from "../../../lib/http.js";

// POST : quelqu'un de la famille réserve un souhait (« Je l'offre »). Pas besoin de clé.
export async function onRequestPost({ request, env, params }) {
  const b = await request.json().catch(() => ({}));
  const nom = String(b.nom || "").trim().slice(0, 40);
  if (!nom) return json({ erreur: "Indique ton prénom." }, 400);
  const row = await env.DB.prepare("SELECT statut FROM disques WHERE id = ?1").bind(params.id).first();
  if (!row || row.statut !== "souhait") return json({ erreur: "Ce disque n'est pas dans la liste de souhaits." }, 404);
  const jeton = crypto.randomUUID();
  const r = await env.DB.prepare(
    "INSERT INTO reservations (disque_id, nom, jeton, created_at) VALUES (?1, ?2, ?3, datetime('now')) ON CONFLICT(disque_id) DO NOTHING"
  ).bind(params.id, nom, jeton).run();
  if (!r.meta.changes) return json({ erreur: "Quelqu'un l'a déjà réservé." }, 409);
  return json({ ok: true, jeton });
}

// DELETE : annulation par la personne qui a réservé (son jeton) ou par Eduardo (clé d'édition).
export async function onRequestDelete({ request, env, params }) {
  const jeton = request.headers.get("x-jeton") || "";
  const q = isAdmin(request, env)
    ? env.DB.prepare("DELETE FROM reservations WHERE disque_id = ?1").bind(params.id)
    : env.DB.prepare("DELETE FROM reservations WHERE disque_id = ?1 AND jeton = ?2").bind(params.id, jeton);
  const r = await q.run();
  if (!r.meta.changes) return json({ erreur: "Réservation introuvable." }, 404);
  return json({ ok: true });
}
