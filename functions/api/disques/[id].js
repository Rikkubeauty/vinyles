import { json, isAdmin, denied } from "../../../lib/http.js";

// Crée ou remplace un disque.
export async function onRequestPut({ request, env, params }) {
  if (!isAdmin(request, env)) return denied();
  const d = await request.json().catch(() => null);
  if (!d || d.id !== params.id) return json({ erreur: "Disque invalide." }, 400);
  const data = JSON.stringify(d);
  if (data.length > 200_000) return json({ erreur: "Fiche trop lourde (pochette à envoyer à part)." }, 413);
  await env.DB.prepare(
    "INSERT INTO disques (id, statut, data, updated_at) VALUES (?1, ?2, ?3, datetime('now')) " +
      "ON CONFLICT(id) DO UPDATE SET statut = excluded.statut, data = excluded.data, updated_at = excluded.updated_at"
  ).bind(d.id, d.statut === "souhait" ? "souhait" : "collection", data).run();
  return json({ ok: true });
}

// Supprime un disque.
export async function onRequestDelete({ request, env, params }) {
  if (!isAdmin(request, env)) return denied();
  await env.DB.prepare("DELETE FROM disques WHERE id = ?1").bind(params.id).run();
  return json({ ok: true });
}
