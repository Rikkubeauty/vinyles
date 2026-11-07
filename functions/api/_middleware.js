// Sur une base D1 toute neuve, crée les tables au premier appel : rien à taper dans la console Cloudflare.
const SCHEMA = [
  "CREATE TABLE IF NOT EXISTS disques (id TEXT PRIMARY KEY, statut TEXT NOT NULL DEFAULT 'collection', data TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT (datetime('now')))",
  "CREATE TABLE IF NOT EXISTS reservations (disque_id TEXT PRIMARY KEY, nom TEXT NOT NULL, jeton TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')))",
];
let pret = null;

export async function onRequest({ env, next }) {
  if (env.DB) {
    pret ??= env.DB.batch(SCHEMA.map((s) => env.DB.prepare(s))).catch((e) => { pret = null; throw e; });
    try { await pret; } catch (e) {}
  }
  return next();
}
