import { SQLiteDatabase } from "expo-sqlite"

export const updateShoppingListItem = async(db:SQLiteDatabase,id:string,name:string,amount:string) => {
  try {
    await db.withExclusiveTransactionAsync(async(txn) => {
      await txn.runAsync('UPDATE shopping_list_item SET name = ?, amount = ? WHERE id = ?', [name,amount,id])
    })
  } catch (error) {
    console.log('Error from updating shopping list:', error)
  }
}