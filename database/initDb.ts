import { NeededItem, ParsedNeededItemData, RawItemData, RawShoppingListItemData } from "@/sharedTypes/ItemType"
import { SQLiteDatabase } from "expo-sqlite"
import { V0_SCHEMA, V1_SCHEMA } from "./schemas"
import { CURRENT_VERSION } from "@/constants/dbVersion"

type MigrationFunction = (db: SQLiteDatabase, storedItems:RawItemData[], storedShoppingList: RawShoppingListItemData[])=>Promise<void>

const MIGRATION_STEPS: Record<number, MigrationFunction> = {
  1: async(db, storedItems,storedShoppingList) => {
    await db.withExclusiveTransactionAsync(async(txn)=>{
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS new_item (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, amount TEXT NOT NULL, category TEXT NOT NULL, details TEXT, uid TEXT NOT NULL);
        CREATE VIRTUAL TABLE IF NOT EXISTS item_fts USING fts5(name, item_id);
        CREATE TABLE IF NOT EXISTS new_shopping_list_item (id INTEGER PRIMARY KEY NOT NULL, name TEXT, quantity TEXT);
        CREATE VIRTUAL TABLE IF NOT EXISTS shopping_list_item_fts USING fts5(name, item_id);    
      `)
      const parsedItems = parseStoredItems(storedItems)
      const parsedShoppingListItems = parseStoredShoppingListItems(storedShoppingList)
      for(const item of parsedItems){
        const {name,amount,category,uid,details} = item
        await txn.runAsync('INSERT INTO new_item (name, amount, category, uid, details) VALUES ($,$,$,$,$)',name, amount, category,uid,details)
      }
      for(const item of parsedShoppingListItems){
        const {name,details} = item
        await txn.runAsync('INSERT INTO new_shopping_list_item (name, details) VALUES ($,$)',name, details)
      }
      await txn.execAsync(`
        DROP TABLE IF EXISTS item;
        DROP TABLE IF EXISTS shopping_list_item;
        ALTER TABLE new_item
        RENAME to item;
        ALTER TABLE new_shopping_list_item
        RENAME to shopping_list_item;
      `)
      await txn.execAsync(`PRAGMA user_version = ${CURRENT_VERSION}`)
    })
    return
  } 
}

const getAllStoredData = async(db: SQLiteDatabase) => {
  try {
    const storedItems: RawItemData[] = await db.getAllAsync('SELECT * FROM item')  
    const storedShoppingList: RawShoppingListItemData[] = await db.getAllAsync('SELECT * FROM shopping_list_item')
    return {storedItems, storedShoppingList}    
  } catch (e) {
    throw e
  }
}

const parseStoredItems = (arr: RawItemData[]): { name: string, category: string, amount:string, uid: string, details: string }[] => {
  const parsedItems = arr.map( rawItem => {
    const parsed = JSON.parse(rawItem.value)
    const { name, category, amount, uid, ...rest } = parsed
    const details =  {...rest}
    return { id:rawItem.id ,name, category, amount, uid, details: JSON.stringify(details) }
  }) 

  return parsedItems
}
const parseStoredShoppingListItems = (arr: RawShoppingListItemData[]): { name: string, quantity: string, details: string }[] => {
  const parsedShoppingListItems = arr.map( rawItem => {
    // const parsed = JSON.parse(rawItem.value)
    const { name, quantity, ...rest } = JSON.parse(rawItem.value)
    const details =  {...rest}
    return { name, quantity, details: JSON.stringify(details) }
  }) 

  return parsedShoppingListItems
}

export const migrateDB = async( db: SQLiteDatabase ) => {

  const userVersion = await db.getFirstAsync<{user_version: number}>('PRAGMA user_version')

  let currentDbVersion = userVersion ? userVersion.user_version : 0

  if(currentDbVersion === CURRENT_VERSION) {
    console.log('DB is current; initialized.')  
    return
  }

  const storedData = await getAllStoredData(db)      
  const { storedItems, storedShoppingList } = storedData

  while(currentDbVersion <= CURRENT_VERSION){
    if(currentDbVersion == 0 && storedItems.length === 0 && storedShoppingList.length === 0){
      try{
        await db.withExclusiveTransactionAsync( async(txn) => {
          await txn.execAsync(V1_SCHEMA);    
          await txn.execAsync(`PRAGMA user_version = ${CURRENT_VERSION}`)
        })
        console.log('DB original version was v0. No data stored; v1 schema  was applied.')
        return
      }catch(e){
        console.log(`Error migrating to the latest schema - v${CURRENT_VERSION}:`, e)
        console.log('Schema set to original - v0.')
        await db.execAsync(V0_SCHEMA)    
        return      
      }
    }
    ++currentDbVersion 
    const migrationFn = MIGRATION_STEPS[currentDbVersion]
    if( migrationFn ) {
      try{
        console.log(`Migration function ${migrationFn} running...`)
        await migrationFn(db, storedItems,storedShoppingList)
        console.log('Function complete.')
        return
      } catch(e){
        console.log(`Error running migration function for version ${currentDbVersion}`)
        return
      } 
    }else{
      console.log(`Migration steps do not exist for version ${currentDbVersion}`)
      return
    }
  }
}

/*
await db.execAsync( `
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXIST new_item (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, amount TEXT NOT NULL, category TEXT NOT NULL, details TEXT, uid TEXT NOT NULL);
          CREATE VIRTUAL TABLE IF NOT EXISTS item_fts USING fts5(name, item_id);
          CREATE TABLE IF NOT EXISTS new_shopping_list_item (id INTEGER PRIMARY KEY NOT NULL, name TEXT, quantity TEXT);
          CREATE VIRTUAL TABLE IF NOT EXISTS shopping_list_item_fts USING fts5(name, item_id);    
        `)
*/