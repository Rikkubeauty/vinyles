-- Déjà appliqué sur la base D1 « vinyles ». Gardé ici pour référence.
CREATE TABLE IF NOT EXISTS disques (
  id TEXT PRIMARY KEY,
  statut TEXT NOT NULL DEFAULT 'collection',
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Souhaits réservés par la famille (« Je l'offre »)
CREATE TABLE IF NOT EXISTS reservations (
  disque_id TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  jeton TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
