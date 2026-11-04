// Sauvegarde hebdomadaire de la base dans R2 (sauvegardes/AAAA-Sxx.json), faite au premier enregistrement de la semaine.
export function semaine(d = new Date()) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const jour = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - jour);
  const debut = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const n = Math.ceil(((t - debut) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-S${String(n).padStart(2, "0")}`;
}
export async function exportComplet(env) {
  const { results } = await env.DB.prepare("SELECT data FROM disques ORDER BY updated_at DESC").all();
  return { discotheque: "Eduardo", exporte: new Date().toISOString(), disques: results.map((r) => JSON.parse(r.data)) };
}
export async function sauvegardeHebdo(env) {
  if (!env.POCHETTES) return;
  const cle = `sauvegardes/${semaine()}.json`;
  if (await env.POCHETTES.head(cle)) return;
  const data = await exportComplet(env);
  await env.POCHETTES.put(cle, JSON.stringify(data), { httpMetadata: { contentType: "application/json" } });
}
