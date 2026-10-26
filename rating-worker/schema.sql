CREATE TABLE IF NOT EXISTS players (
  uid   TEXT PRIMARY KEY,
  name  TEXT NOT NULL,
  net   INTEGER NOT NULL DEFAULT 0,
  best  INTEGER NOT NULL DEFAULT 0,
  bestn TEXT NOT NULL DEFAULT '',
  lvl   INTEGER NOT NULL DEFAULT 1,
  hide  INTEGER NOT NULL DEFAULT 0,
  upd   INTEGER NOT NULL DEFAULT 0,
  flag  INTEGER NOT NULL DEFAULT 0,
  cos   TEXT NOT NULL DEFAULT '',
  allow INTEGER NOT NULL DEFAULT 0
);
-- Если таблица players уже была создана раньше: воркер сам добавит столбцы flag, cos, allow при первом запросе (вручную ничего выполнять не нужно).
CREATE INDEX IF NOT EXISTS idx_net  ON players(hide, net DESC);
CREATE INDEX IF NOT EXISTS idx_best ON players(hide, best DESC);

CREATE TABLE IF NOT EXISTS refs (
  invitee TEXT PRIMARY KEY,
  inviter TEXT NOT NULL,
  claimed INTEGER NOT NULL DEFAULT 0,
  ts      INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_ref_inviter ON refs(inviter, claimed);

CREATE TABLE IF NOT EXISTS clans (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  tag      TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name     TEXT NOT NULL UNIQUE COLLATE NOCASE,
  descr    TEXT NOT NULL DEFAULT '',
  link     TEXT NOT NULL DEFAULT '',
  joinmode INTEGER NOT NULL DEFAULT 0,
  minlvl   INTEGER NOT NULL DEFAULT 1,
  owner    TEXT NOT NULL,
  created  INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS members (
  uid    TEXT PRIMARY KEY,
  clan   INTEGER NOT NULL,
  joined INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_members_clan ON members(clan);
CREATE TABLE IF NOT EXISTS requests (
  uid  TEXT NOT NULL,
  clan INTEGER NOT NULL,
  ts   INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (uid, clan)
);

CREATE TABLE IF NOT EXISTS market (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  seller  TEXT NOT NULL,
  name    TEXT NOT NULL,
  price   INTEGER NOT NULL,
  status  INTEGER NOT NULL DEFAULT 0,
  buyer   TEXT,
  claimed INTEGER NOT NULL DEFAULT 0,
  ts      INTEGER NOT NULL DEFAULT 0,
  sold_ts INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_market_active ON market(status, price);
CREATE INDEX IF NOT EXISTS idx_market_seller ON market(seller, status, claimed);

CREATE TABLE IF NOT EXISTS museum (
  name  TEXT PRIMARY KEY COLLATE NOCASE,
  v     INTEGER NOT NULL DEFAULT 0,
  owner TEXT NOT NULL,
  ts    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_museum_v ON museum(v DESC);
CREATE INDEX IF NOT EXISTS idx_museum_owner ON museum(owner);

CREATE TABLE IF NOT EXISTS grants (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  uid     TEXT NOT NULL,
  amount  INTEGER NOT NULL,
  claimed INTEGER NOT NULL DEFAULT 0,
  ts      INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_grants_uid ON grants(uid, claimed);
