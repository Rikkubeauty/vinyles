import { json, isAdmin, denied } from "../../lib/http.js";

// Vérifie la clé d'édition saisie dans la page.
export const onRequestGet = ({ request, env }) => (isAdmin(request, env) ? json({ ok: true }) : denied());
