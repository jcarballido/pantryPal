import { ParsedRecordStoredItem, ParsedRecordShoppingListItem, DbRecordStoredItem } from "@/sharedTypes/ItemType"
import { SQLiteDatabase } from "expo-sqlite"
import { nanoid } from "nanoid"

export const addItems = async(db:SQLiteDatabase, newItem:Omit<ParsedRecordStoredItem,'id'|'uid'>, addStoredItems:(item: ParsedRecordStoredItem) => void) => { 
  try{
    const generatedId = nanoid(10)
    const {name,amount,category,details} = newItem
    await db.withExclusiveTransactionAsync( async(txn) => {
      const returnData = await txn.runAsync('INSERT INTO item(name,category,amount, uid, details) VALUES(?,?,?,?,?) RETURNING *',[name, category, amount, generatedId,JSON.stringify(details)])
      const lastInsertId = returnData.lastInsertRowId
      const getLastInsertedRowIdData: DbRecordStoredItem[] = await txn.getAllAsync('SELECT * FROM item WHERE id = ?;',[lastInsertId])
      const item = getLastInsertedRowIdData[0]
      const parsedData: ParsedRecordStoredItem = {id:item.id, amount: item.amount, category: item.category, name: item.name, uid:item.uid, details:JSON.parse(item.details)}
      console.log('Parsed Data:', parsedData)
      await txn.runAsync('INSERT OR IGNORE INTO category (name) VALUES (?)', category)
      await txn.runAsync('INSERT INTO item_fts (name, item_id) VALUES (?,?)', name, item.id) 
      addStoredItems(parsedData)
  })}catch(e){
    console.log('Error inserting item: ', e)
  }
}

export const addShoppingListItems = async(db:SQLiteDatabase, shoppingListItemsToAdd:Omit<ParsedRecordStoredItem,'uid'>[],addListItems:(items: ParsedRecordStoredItem[])=>void, itemsMarkedForSaving: ParsedRecordShoppingListItem[], deleteFromShoppingList: (itemsArray:number[]) => void ) => {
  try{
    await db.withExclusiveTransactionAsync( async(txn) => {
      const storedData = await Promise.all(
        shoppingListItemsToAdd.map(async(listItem) => {
        const generatedId = nanoid(10)
        const {name,amount,category,details} = listItem
        const returnData = await txn.runAsync('INSERT INTO item(name,category,amount, uid, details) VALUES(?,?,?,?,?) RETURNING *',[name, category, amount, generatedId,JSON.stringify(details)])
        const lastInsertId = returnData.lastInsertRowId
        const getLastInsertedRowIdData: DbRecordStoredItem[] = await txn.getAllAsync('SELECT * FROM item WHERE id = ?;',[lastInsertId])
        const item = getLastInsertedRowIdData[0]
        const parsedData: ParsedRecordStoredItem = {id:item.id, amount: item.amount, category: item.category, name: item.name, uid:item.uid, details:JSON.parse(item.details)}
        console.log('Parsed Data:', parsedData)
        return parsedData
      }))
      addListItems(storedData)
      const placeHolders = itemsMarkedForSaving.map(_=> '?').join()
      const savedItemIds = itemsMarkedForSaving.map( savedItem => parseInt(savedItem.id) )
      await txn.runAsync(`DELETE FROM shopping_list_item WHERE id IN (${placeHolders})`,savedItemIds)
      deleteFromShoppingList(savedItemIds)
      // itemsMarkedForSaving
  })}catch(e){
    console.log('Error in addShoppingListItem: ',e)
    throw e
  }
} 
