import { DbRecordStoredCategory } from "@/sharedTypes/ItemType"
import { SQLiteDatabase } from "expo-sqlite"

export const updateDbCategories = async (db:SQLiteDatabase,itemsToEdit: (DbRecordStoredCategory&{newName:string})[]) => {
  try {
    await Promise.all(itemsToEdit.map( async item => {
      await db.runAsync('UPDATE category SET name = ? WHERE id = ?', [item.newName,item.id])
      await db.runAsync('UPDATE item SET category = ? WHERE category = ?', [item.newName,item.name])
    }))
  } catch (error) {
    console.log('Error updating categories:', error)
    throw error
  }
}