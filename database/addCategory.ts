import { SQLiteDatabase } from "expo-sqlite";

export const addCategory = async(db:SQLiteDatabase, newCategory: string) => {
  try {
    if(newCategory === '') throw new Error('Category cannot be blank')
    await db.runAsync('INSERT INTO category (name) VALUES (?)',[newCategory])
  } catch (error) {
    throw error
  }
}