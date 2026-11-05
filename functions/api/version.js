import { json } from "../../lib/http.js";

// Empreinte légère de la base : les appareils la consultent toutes les quelques secondes
// et ne rechargent la collection que si elle a changé (ajout, modification ou suppression ailleurs).
export async function onRequestGet({ env }) {
  const r = await env.DB.prepare("SELECT COUNT(*) AS n, MAX(updated_at) AS m, SUM(LENGTH(data)) AS s FROM disques").first();
  return json({ v: `${r?.n || 0}|${r?.m || ""}|${r?.s || 0}` });
}
