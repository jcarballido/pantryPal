import { SQLiteDatabase } from "expo-sqlite"
import { DbRecordStoredCategory } from "@/sharedTypes/ItemType"

export const deleteCategories = async(db:SQLiteDatabase, itemsToDelete: string[], deleteCategory: (deleteArray:string[]) => void) => {
  try{
    await db.withExclusiveTransactionAsync( async(txn) => {
      await Promise.all(itemsToDelete.map(async (id) => {
        await txn.runAsync('DELETE FROM category WHERE id=?',[id])
      }))
      deleteCategory(itemsToDelete)
    })
    
  }catch(e){
    console.log('Error from attempting to delete categorie(s):', e)
  }
}