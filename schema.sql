CREATE TABLE IF NOT EXISTS players(
  id INTEGER PRIMARY KEY AUTOINCREMENT,          -- публичный ID игрока: 1 = 000,001
  key TEXT UNIQUE NOT NULL,                      -- tg:<id Telegram> или anon:<токен браузера>
  name TEXT DEFAULT '', state TEXT DEFAULT '{}',
  balance INTEGER DEFAULT 0, items_count INTEGER DEFAULT 0, spins INTEGER DEFAULT 0,
  banned INTEGER DEFAULT 0, ban_reason TEXT DEFAULT '',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP, last_seen TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS ops(                  -- команды админа, которые игра применит при следующей синхронизации
  id INTEGER PRIMARY KEY AUTOINCREMENT, player_id INTEGER NOT NULL, type TEXT NOT NULL,
  payload TEXT DEFAULT '{}', done INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS ops_pending ON ops(player_id, done);
CREATE TABLE IF NOT EXISTS admin_fail(ip TEXT, ts TEXT DEFAULT CURRENT_TIMESTAMP);
