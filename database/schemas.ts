export const V0_SCHEMA = `
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS item (id INTEGER PRIMARY KEY NOT NULL, value TEXT);
  CREATE VIRTUAL TABLE IF NOT EXISTS item_fts USING fts5(name, item_id);
  CREATE TABLE IF NOT EXISTS shopping_list_item (id INTEGER PRIMARY KEY NOT NULL, value TEXT);
  CREATE VIRTUAL TABLE IF NOT EXISTS shopping_list_item_fts USING fts5(name, item_id);    
`;

// export const V1_SCHEMA = `
//   PRAGMA journal_mode = WAL;
//   CREATE TABLE IF NOT EXISTS item (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, amount TEXT NOT NULL, category TEXT NOT NULL, details TEXT);
//   CREATE VIRTUAL TABLE IF NOT EXISTS item_fts USING fts5(name, item_id);
//   CREATE TABLE IF NOT EXISTS shopping_list_item (id INTEGER PRIMARY KEY NOT NULL, name TEXT, quantity TEXT);
//   CREATE VIRTUAL TABLE IF NOT EXISTS shopping_list_item_fts USING fts5(name, item_id);    
// `;

export const V1_SCHEMA = `
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS new_item (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, amount TEXT NOT NULL, category TEXT NOT NULL, details TEXT, uid TEXT NOT NULL);
  CREATE VIRTUAL TABLE IF NOT EXISTS item_fts USING fts5(name, item_id);
  CREATE TABLE IF NOT EXISTS new_shopping_list_item (id INTEGER PRIMARY KEY NOT NULL, name TEXT, quantity TEXT);
  CREATE VIRTUAL TABLE IF NOT EXISTS shopping_list_item_fts USING fts5(name, item_id);    
  DROP TABLE IF EXISTS item;
  DROP TABLE IF EXISTS shopping_list_item;
  ALTER TABLE new_item
  RENAME to item;
  ALTER TABLE new_shopping_list_item
  RENAME to shopping_list_item;

`

export const V2_SCHEMA = `
  PRAGMA journal_mode = WAL;
  ALTER TABLE shopping_list_item
  ADD COLUMN detail TEXT; 
`

export const V3_SCHEMA = `
  PRAGMA journal_mode = WAL;
  ALTER TABLE shopping_list_item
  RENAME COLUMN quantity TO amount; 
`
export const V4_SCHEMA = `
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS categories (id PRIMARY INTEGER KEY NOT NULL, category TEXT NOT NULL)
`