import React, { useState } from 'react'
import { Tabs } from 'expo-router'
import MaterialIcons  from '@expo/vector-icons/MaterialIcons'
import { Platform } from 'react-native'
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite'
// import { ParsedRecordStoredItem, DbRecordStoredItem } from '@/sharedTypes/ItemType'
// import { CURRENT_VERSION } from '@/constants/dbVersion'
// import { V2_SCHEMA } from '@/database/schemas'
import { migrateDB } from '@/database/initDb'

// const initializeDB =  async (db: SQLiteDatabase) => {
//   try{
//     await db.execAsync(`
//     PRAGMA journal_mode = WAL;
//     CREATE TABLE IF NOT EXISTS item (id INTEGER PRIMARY KEY NOT NULL, value TEXT);
//     CREATE VIRTUAL TABLE IF NOT EXISTS item_fts USING fts5(name, item_id);
//     CREATE TABLE IF NOT EXISTS shopping_list_item (id INTEGER PRIMARY KEY NOT NULL, value TEXT);
//     CREATE VIRTUAL TABLE IF NOT EXISTS shopping_list_item_fts USING fts5(name, item_id);    
//     `);
//     console.log('DB initialized')
//   }catch(e){
//     console.log('Error initializing:', e)
//   }
// }

// type MigrationFunction = (db: SQLiteDatabase)=>Promise<void>

// const MIGRATION_STEPS: Record<number, MigrationFunction> = {
//   1: async(db) => {
//     // Currently... Db is 
//   } 
// }

// const initializeAndMigrateDB = async( db: SQLiteDatabase ) => {
//   // Bring in the current DB version
//   // Bring in the current user_version
//   const result = await db.getFirstAsync<{user_version: number}>('PRAGMA user_version')
//   let currentDbVersion = result ? result.user_version : 0
//   if(currentDbVersion == 0){
//     const storedItems: RawItemData[] = await db.getAllAsync(`
//       SELECT * FROM item  
//     `)

//     const storedShoppingList = await db.getAllAsync(`
//       SELECT * FROM shopping_list_item
//     `)

//     if(storedItems.length === 0 && storedShoppingList.length === 0) {
//       try{
//         await db.withExclusiveTransactionAsync( async(txn) => {
//           await txn.execAsync(V2_SCHEMA);    
//           await txn.execAsync(`PRAGMA user_version = ${CURRENT_VERSION}`)
//         })
//         console.log('DB initialized')
//       }catch(e){
//         console.log('Error migrating to the latest db version from version 0')
//       }
//     } else{
//       try{
//         await db.execAsync( `
//           PRAGMA journal_mode = WAL;
//           CREATE TABLE IF NOT EXIST new_item (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, amount TEXT NOT NULL, category TEXT NOT NULL, details TEXT, uid TEXT NOT NULL);
//           CREATE VIRTUAL TABLE IF NOT EXISTS item_fts USING fts5(name, item_id);
//           CREATE TABLE IF NOT EXISTS new_shopping_list_item (id INTEGER PRIMARY KEY NOT NULL, name TEXT, quantity TEXT);
//           CREATE VIRTUAL TABLE IF NOT EXISTS shopping_list_item_fts USING fts5(name, item_id);    
//         `)
//       }catch{
//         console.log('Error creating tables for current db version.')
//       }
//     }

//     if(storedItems.length > 0){
//       const parsedItems: {id:string, name: string, amount:string, category:string, uid:string, details:string}[] = storedItems.map( rawItem => {
//         const { name, amount, category, uid, ...rest } = JSON.parse(rawItem.value)
//         return {id: rawItem.id, name, amount, category, uid, details: JSON.stringify({...rest})}
//       }) 
//       const queryPlaceholders = parsedItems.map(item => '?').join()
//       try {
        
//       } catch (e) {
        
//       }
//     }
//   }
//   // Compare both; If user_version is behind, then begin migrations.
//   while(currentDbVersion < CURRENT_VERSION){
//     currentDbVersion += 1
//     const migratonFn = MIGRATION_STEPS[currentDbVersion]
//     if( migratonFn ) await migratonFn(db)
//     else console.log(`Migration steps do not exist for version ${currentDbVersion}`)
//   }

//   await db.execAsync(`PRAGMA user_version = ${CURRENT_VERSION}`)
// }


export default function TabsLayout() {

  return (
    <SQLiteProvider databaseName='main.db' onInit={Platform.OS === 'android'||'ios'? migrateDB:undefined}>
      <Tabs screenOptions={
        {
          tabBarStyle:{
            backgroundColor:'#A3C7C9',
            position:'absolute',
            bottom: 25,
            borderRadius:999,
            marginHorizontal:20,
            flex:1,
            display:'flex',
            flexDirection:'row',
            flexGrow:1,
          },
          tabBarActiveTintColor:'#1A3554',
          tabBarInactiveTintColor:'#505050',
          tabBarItemStyle:{
            display:'flex',
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            flex:1
          },
          tabBarShowLabel: false,
          headerStyle:{
            backgroundColor:'red'
          },
          headerShadowVisible:false,
          headerShown:false
        }
      }>
        
        <Tabs.Screen name='index' options={{ 
          title: 'Categories',
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons name="category" size={size} color={color} style={focused? {  backgroundColor:'#E0E4E8',borderRadius:999}:{}}/>         
          ),
        }}/>
        <Tabs.Screen name='search' options={{ 
          title: 'Search',
          tabBarIcon: ({ focused, color, size }) => (
              <MaterialIcons name="search" size={size} color={color} style={focused? {backgroundColor:'#E0E4E8', borderRadius:999}:{}} />         
          )
        }}/>
        <Tabs.Screen name='list' options={{ 
          title: 'Shopping List',
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons name="format-list-bulleted" size={size} color={color}  style={focused? {backgroundColor:'#E0E4E8', borderRadius:999}:{}}/>         
          )
        }}/>
        <Tabs.Screen name='account' options={{
          title: 'Account',
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons name="account-circle" size={24} color={color} style={focused? {backgroundColor:'#E0E4E8', borderRadius:999}:{}}/>         
          ) 
        }}/>
      </Tabs>
    </SQLiteProvider>
  )
}