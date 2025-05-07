import { SQLiteDatabase } from "expo-sqlite"

export const updateDbCategories = async (db:SQLiteDatabase,itemsToEdit: {id:string, name:string}[]) => {
  try {
    await Promise.all(itemsToEdit.map( async item => {
      await db.runAsync('UPDATE category SET name = ? WHERE id = ?', [item.name,item.id])
    }))
  } catch (error) {
    throw error
  }
}