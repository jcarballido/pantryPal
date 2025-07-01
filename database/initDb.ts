import { DbRecordShoppingListItem, ParsedRecordShoppingListItem, DbRecordStoredItem, ParsedRecordStoredItem } from "@/sharedTypes/ItemType"
import { SQLiteDatabase } from "expo-sqlite"
import { V0_SCHEMA, V1_SCHEMA } from "./schemas"
import { CURRENT_VERSION } from "@/constants/dbVersion"

type MigrationFunction = (db: SQLiteDatabase, storedItems:DbRecordStoredItem[], storedShoppingList: DbRecordShoppingListItem[])=>Promise<void>

const MIGRATION_STEPS: Record<number, MigrationFunction> = {
  1: async(db, storedItems,storedShoppingList) => {
    await db.withExclusiveTransactionAsync(async(txn)=>{
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS new_item (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, amount TEXT NOT NULL, category TEXT NOT NULL, details TEXT, uid TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS new_shopping_list_item (id INTEGER PRIMARY KEY NOT NULL, name TEXT, quantity TEXT);
      `)
      if(storedItems && storedShoppingList){
        const parsedItems = parseStoredItems(storedItems)
        const parsedShoppingListItems = parseStoredShoppingListItems(storedShoppingList)
        for(const item of parsedItems){
          const {name,amount,category,uid,details} = item
          await txn.runAsync('INSERT INTO new_item (name, amount, category, uid, details) VALUES ($,$,$,$,$)',name, amount, category,uid,JSON.stringify(details))
        }
        for(const item of parsedShoppingListItems){
          const {name,details} = item
          await txn.runAsync('INSERT INTO new_shopping_list_item (name, details) VALUES ($,$)',name, JSON.stringify(details))
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
      await txn.execAsync(`PRAGMA user_version = 1`)
    })
    return
  },
  2: async(db, storedItems, storedShoppingList) => {
    await db.withExclusiveTransactionAsync( async(txn)=>{
      await txn.execAsync(`
        ALTER TABLE shopping_list_item
        ADD COLUMN details TEXT;
        PRAGMA user_version = 2;
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
        PRAGMA user_version = 3;
      `)
    })
  },
  4: async(db, storedItems) => {
    await db.withExclusiveTransactionAsync( async(txn) => {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL);
      `)
      if(storedItems){
        const parsedItems = parseStoredItems(storedItems)
        const categoriesFromParsedItems = parsedItems.map(item => item.category)
        const uniqueCategories = new Set(parsedItems)
        for(const item of uniqueCategories){
          const { category } = item
          await txn.runAsync('INSERT INTO category (name) VALUES (?)',category)
        }
      }
      await txn.execAsync(`PRAGMA user_version = 4;`)
    })    
  },
  5: async(db) => {
    await db.withExclusiveTransactionAsync( async(txn) => {
      await txn.execAsync(`
        CREATE TABLE temp_shopping_list_items_table (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          amount TEXT NOT NULL,
          details TEXT  
        );
        INSERT INTO temp_shopping_list_items_table SELECT * FROM shopping_list_item;
        DROP TABLE shopping_list_item;
        ALTER TABLE temp_shopping_list_items_table RENAME TO shopping_list_item;
        
      `)
      await txn.execAsync(`
        PRAGMA user_version = 5;  
      `)
    })
  }
}

const getAllStoredData = async(db: SQLiteDatabase) => {
  try {
    const storedItems: DbRecordStoredItem[] = await db.getAllAsync('SELECT * FROM item')  
    const storedShoppingList: DbRecordShoppingListItem[] = await db.getAllAsync('SELECT * FROM shopping_list_item')
    return {storedItems, storedShoppingList}    
  } catch (e) {
    throw e
  }
}

const parseStoredItems = (arr: DbRecordStoredItem[]): ParsedRecordStoredItem[] => {
  const parsedItems = arr.map( rawItem => {
    // const parsed = JSON.parse(rawItem.value)

    // const { name, category, amount, uid, ...rest } = parsed
    // const details =  {...rest}
    return { id:rawItem.id ,name:rawItem.name, category:rawItem.category, amount:rawItem.amount, uid:rawItem.uid, details: JSON.parse(rawItem.details) }
  }) 

  return parsedItems
}
const parseStoredShoppingListItems = (arr: DbRecordShoppingListItem[]):ParsedRecordShoppingListItem[] => {
  const parsedShoppingListItems = arr.map( rawItem => {
    // const parsed = JSON.parse(rawItem.value)
    const { id, name, amount, details } = rawItem
    return { name, amount, id, details: JSON.parse(details) }
  }) 

  return parsedShoppingListItems
}

export const migrateDB = async( db: SQLiteDatabase ) => {

  const userVersion = await db.getFirstAsync<{user_version: number}>('PRAGMA user_version')
  console.log('User Version found during migration init:', userVersion)
  // await db.runAsync('PRAGMA user_version = 0;')
  // const userVersion2 = await db.getFirstAsync<{user_version: number}>('PRAGMA user_version')
  // console.log('User Version found during migration init:', userVersion2)
  // await db.execAsync(V0_SCHEMA)

  let currentDbVersion = userVersion ? userVersion.user_version : 0

  if(currentDbVersion === 0) {
    try {
      await db.execAsync(V0_SCHEMA)
      console.log('Current version is 0. Schema v0 applied.')
    } catch (error) {
      console.log('Error applying schema v0:', error)
    }
  }else{
    console.log('Current version has been updated since v0. Migration will be evaluated.')
  }

  while(currentDbVersion <= CURRENT_VERSION){
    ++currentDbVersion 
    const migrationFn = MIGRATION_STEPS[currentDbVersion]
    if( migrationFn ) {
      try{
        console.log(`Migration function ${migrationFn} running...`)
        const storedData = await getAllStoredData(db)  
        console.log('Stored Data found:', storedData)    
        const { storedItems, storedShoppingList } = storedData
        await migrationFn(db, storedItems,storedShoppingList)
        console.log('Function complete.')
      } catch(e){
        console.log(`Error running migration function for version ${currentDbVersion}`,e)
        return
      } 
    }else{
      console.log(`Migration steps do not exist for version ${currentDbVersion}`)
      return
    }
  }
}


// export const migrateDB = async(db:SQLiteDatabase) => {
//   await db.execAsync(`PRAGMA user_version = 0;`)
//   const userVersion = await db.getFirstAsync<{user_version: number}>('PRAGMA user_version')
//   console.log('User Version found during migration init:', userVersion)
// }