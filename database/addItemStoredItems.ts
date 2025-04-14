import { ParsedItemData, ParsedNeededItemData, RawItemData } from "@/sharedTypes/ItemType"
import useItemStore from "@/stores/useItemStore"
import { SQLiteDatabase } from "expo-sqlite"
import { nanoid } from "nanoid"

export const addItemStoredItems = async(db:SQLiteDatabase, name:string, amount: string,newCategory:string|undefined, category:string, rest:{ [key:string]:string }, addItems:(item: ParsedItemData) => void) => { 
  try{
    const generatedId = nanoid(10)

    await db.withExclusiveTransactionAsync( async(txn) => {
      // const { name, category, amount, newCategory, ...rest } = data
      // const name = data.get("name")
      // const amount = data.get("amount")
      // const category = data.get("category")
      // const name = data.get("name")

      console.log('Formatted Data: ', name, category, newCategory, amount, rest)
      // const { name, category, amount, details } = formattedData
      // const dataFormatted = {}
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
      // setSavedItems((prevArray):ParsedItemData[] => {
      //   const addLastInsertedRow: ParsedItemData[] = [...prevArray, parsedData]
      //   return addLastInsertedRow
      // })
  })}catch(e){
    console.log('Error inserting item: ', e)
  }
}

export const addShoppingListItems = async(db:SQLiteDatabase, arr:{name:string, amount: string, category:string, details:{ [key:string]:string }}[],addShoppingListItems:(items:ParsedNeededItemData[])=>void) => {
  try{
    const generatedId = nanoid(10)

    await db.withExclusiveTransactionAsync( async(txn) => {
      // const { name, category, amount, newCategory, ...rest } = data
      // const name = data.get("name")
      // const amount = data.get("amount")
      // const category = data.get("category")
      // const name = data.get("name")

      // console.log('Formatted Data: ', name, category, newCategory, amount, rest)
      // const { name, category, amount, details } = formattedData
      // const dataFormatted = {}
      // let mergedCategory 
      // if(newCategory){
      //   console.log('New Category entered:', newCategory)
      //   mergedCategory = newCategory
      // }else{
      //   mergedCategory = category
      // }
      const returnData = await txn.runAsync('INSERT INTO item(name,category,amount, uid, details) VALUES(?,?,?,?,?) RETURNING *',[name, category, amount, generatedId,JSON.stringify(details)])
      const lastInsertId = returnData.lastInsertRowId
      const getLastInsertedRowIdData: RawItemData[] = await txn.getAllAsync('SELECT * FROM item WHERE id = ?;',[lastInsertId])
      const item = getLastInsertedRowIdData[0]
      const parsedData: ParsedItemData = {id:item.id, amount: item.amount, category: item.category, name: item.name, details}
      console.log('Parsed Data:', parsedData)
      await txn.runAsync('INSERT INTO item_fts (name, item_id) VALUES (?,?)', name, item.id) 
      // addItems(parsedData)
      // setSavedItems((prevArray):ParsedItemData[] => {
      //   const addLastInsertedRow: ParsedItemData[] = [...prevArray, parsedData]
      //   return addLastInsertedRow
      // })
  })}catch(e){
    console.log('Error inserting item: ', e)
  }
} 
