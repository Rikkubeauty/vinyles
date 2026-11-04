import { json } from "../../../lib/http.js";

// Liste publique de la discothèque (collection + souhaits).
export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare("SELECT data FROM disques ORDER BY updated_at DESC").all();
  return json(results.map((r) => JSON.parse(r.data)));
}
