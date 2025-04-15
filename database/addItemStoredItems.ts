import { ParsedItemData, ParsedNeededItemData, RawItemData } from "@/sharedTypes/ItemType"
import useItemStore from "@/stores/useItemStore"
import { SQLiteDatabase } from "expo-sqlite"
import { nanoid } from "nanoid"

export const addItemStoredItems = async(db:SQLiteDatabase, name:string, amount: string,newCategory:string|undefined, category:string, rest:{ [key:string]:string }, addItems:(item: ParsedItemData) => void) => { 
  try{
    const generatedId = nanoid(10)

    await db.withExclusiveTransactionAsync( async(txn) => {
      console.log('Formatted Data: ', name, category, newCategory, amount, rest)
      let mergedCategory 
      if(newCategory){
        console.log('New Category entered:', newCategory)
        mergedCategory = newCategory
      }else{
        mergedCategory = category
      }
      const returnData = await txn.runAsync('INSERT INTO item(name,category,amount, uid, details) VALUES(?,?,?,?,?) RETURNING *',[name, mergedCategory, amount, generatedId,JSON.stringify(rest)])
      const lastInsertId = returnData.lastInsertRowId
      const getLastInsertedRowIdData: RawItemData[] = await txn.getAllAsync('SELECT * FROM item WHERE id = ?;',[lastInsertId])
      const item = getLastInsertedRowIdData[0]
      const parsedData: ParsedItemData = {id:item.id, amount: item.amount, category: item.category, name: item.name, details:{...rest}}
      console.log('Parsed Data:', parsedData)
      await txn.runAsync('INSERT INTO item_fts (name, item_id) VALUES (?,?)', name, item.id) 
      addItems(parsedData)
  })}catch(e){
    console.log('Error inserting item: ', e)
  }
}

export const addShoppingListItems = async(db:SQLiteDatabase, arr:{name:string, amount: string, category:string, details:{ [key:string]:string }}[]) => {
  try{
    await db.withExclusiveTransactionAsync( async(txn) => {
      arr.map(async(listItem) => {
        const generatedId = nanoid(10)
        const {name,amount,category,details} = listItem
        await txn.runAsync('INSERT INTO item(name,category,amount, uid, details) VALUES(?,?,?,?,?) RETURNING *',[name, category, amount, generatedId,JSON.stringify(details)])
      })
  })}catch(e){
    console.log('Error inserting item: ', e)
  }
} 
