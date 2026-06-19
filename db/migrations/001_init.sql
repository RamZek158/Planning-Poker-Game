CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT,
    name TEXT,
    picture TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    provider TEXT NOT NULL DEFAULT 'email',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique
    ON users (email);

CREATE TABLE IF NOT EXISTS game_settings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    voting_type TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_game_settings_user_id
    ON game_settings (user_id);

CREATE INDEX IF NOT EXISTS idx_game_settings_is_deleted
    ON game_settings (is_deleted);

CREATE INDEX IF NOT EXISTS idx_game_settings_last_activity
    ON game_settings (last_activity);
