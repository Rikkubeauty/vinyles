-- Déjà appliqué sur la base D1 « vinyles ». Gardé ici pour référence.
CREATE TABLE IF NOT EXISTS disques (
  id TEXT PRIMARY KEY,
  statut TEXT NOT NULL DEFAULT 'collection',
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
