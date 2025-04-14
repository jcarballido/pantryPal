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
      if(storedItems && storedShoppingList){
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
  },
  2: async(db, storedItems, storedShoppingList) => {
    await db.withExclusiveTransactionAsync( async(txn)=>{
      await txn.execAsync(`
        ALTER TABLE shopping_list_item
        ADD COLUMN details TEXT;
        PRAGMA user_version = ${CURRENT_VERSION};
      `)
    })
    return
  },
  3: async(db) => {
    await db.withExclusiveTransactionAsync( async(txn) => {
      await txn.execAsync(`
        PRAGMA journal_mode = WAL;
        ALTER TABLE shopping_list_item
        RENAME COLUMN quantity TO amount;   
        PRAGMA user_version = ${CURRENT_VERSION};
      `)
    })
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
    // const parsed = JSON.parse(rawItem.value)

    // const { name, category, amount, uid, ...rest } = parsed
    // const details =  {...rest}
    return { id:rawItem.id ,name:rawItem.name, category:rawItem.category, amount:rawItem.amount, uid:rawItem.uid, details: rawItem.details }
  }) 

  return parsedItems
}
const parseStoredShoppingListItems = (arr: RawShoppingListItemData[]): { name: string, amount: string, details: string }[] => {
  const parsedShoppingListItems = arr.map( rawItem => {
    // const parsed = JSON.parse(rawItem.value)
    const { name, amount, details } = rawItem
    return { name, amount, details: JSON.parse(details) }
  }) 

  return parsedShoppingListItems
}

export const migrateDB = async( db: SQLiteDatabase ) => {

  // await db.execAsync(`PRAGMA user_version = ${CURRENT_VERSION}`)
  // console.log('Current Version set to v0')
  // await db.execAsync(V0_SCHEMA)    
  // const tables = await db.getFirstAsync("SELECT sql FROM sqlite_master WHERE type='table'")  
  // console.log('Current tables:', tables)

  const userVersion = await db.getFirstAsync<{user_version: number}>('PRAGMA user_version')


  let currentDbVersion = userVersion ? userVersion.user_version : 0

  if(!CURRENT_VERSION) {
    await db.execAsync(V0_SCHEMA)
    console.log('Current version is 0. Schema v0 applied.')
    return
  }else{
    console.log('Current version has been updated since v0. Migration will be evaluated.')
  }

  // if(currentDbVersion !== 0 && currentDbVersion === CURRENT_VERSION) {
  //   console.log(`DB is current at version ${currentDbVersion}; initialized.`)
  //   const tables = await db.getFirstAsync("SELECT sql FROM sqlite_master WHERE type='table'")  
  //   console.log('Current tables:', tables)
  //   return
  // }

  const storedData = await getAllStoredData(db)      
  const { storedItems, storedShoppingList } = storedData

  while(currentDbVersion <= CURRENT_VERSION){
    // if(currentDbVersion == 0 && storedItems.length === 0 && storedShoppingList.length === 0){
    //   try{
    //     await db.withExclusiveTransactionAsync( async(txn) => {
    //       console.log('Current version determined as v0.')
    //       // const dbList = await txn.getFirstAsync('PRAGMA database_list')
    //       //   const tables = await db.getFirstAsync("SELECT sql FROM sqlite_master WHERE type='table'")  
    //       //   console.log('v0 tables:', tables)
    //       await txn.execAsync(V1_SCHEMA);    
    //       // const tables2 = await db.getFirstAsync("SELECT sql FROM sqlite_master WHERE type='table'")  
    //       // console.log('v1 tables:',tables2)
    //       await txn.execAsync(`PRAGMA user_version = ${CURRENT_VERSION}`)
    //     })
    //     console.log('DB original version was v0. No data stored; v1 schema  was applied.')
    //     return
    //   }catch(e){
    //     console.log(`Error migrating to the latest schema - v${CURRENT_VERSION}:`, e)
    //     console.log('Schema set to original - v0.')
    //     await db.execAsync(V0_SCHEMA)    
    //     return      
    //   }
    // }
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
      // const tables = await db.getAllAsync("SELECT sql FROM sqlite_master WHERE type='table'")  
      // console.log('v0 tables:', tables)
      console.log(`Migration steps do not exist for version ${currentDbVersion}`)
      return
    }
  }
}
