export const V0_SCHEMA = `
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS item (id INTEGER PRIMARY KEY NOT NULL, value TEXT);
  CREATE VIRTUAL TABLE IF NOT EXISTS item_fts USING fts5(name, item_id);
  CREATE TABLE IF NOT EXISTS shopping_list_item (id INTEGER PRIMARY KEY NOT NULL, value TEXT);
  CREATE VIRTUAL TABLE IF NOT EXISTS shopping_list_item_fts USING fts5(name, item_id);    
`;

export const V1_SCHEMA = `
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS item (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, amount TEXT NOT NULL, category TEXT NOT NULL, details TEXT);
  CREATE VIRTUAL TABLE IF NOT EXISTS item_fts USING fts5(name, item_id);
  CREATE TABLE IF NOT EXISTS shopping_list_item (id INTEGER PRIMARY KEY NOT NULL, name TEXT, quantity TEXT);
  CREATE VIRTUAL TABLE IF NOT EXISTS shopping_list_item_fts USING fts5(name, item_id);    
`;