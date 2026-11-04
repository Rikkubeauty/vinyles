import { json } from "../../../lib/http.js";

// Liste des souhaits déjà réservés par la famille (sans les jetons d'annulation).
export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare("SELECT disque_id, nom, created_at FROM reservations").all();
  return json(results);
}
