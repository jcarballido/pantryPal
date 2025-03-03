import React, { useState } from 'react'
import { Tabs } from 'expo-router'
import MaterialIcons  from '@expo/vector-icons/MaterialIcons'
import { Platform } from 'react-native'
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite'
import { ParsedItemData } from '@/sharedTypes/ItemType'


const initializeDB =  async (db: SQLiteDatabase) => {
  try{
    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS item (id INTEGER PRIMARY KEY NOT NULL, value TEXT);
    CREATE VIRTUAL TABLE IF NOT EXISTS item_fts USING fts5(name, item_id);
    CREATE TABLE IF NOT EXISTS shopping_list_item (id INTEGER PRIMARY KEY NOT NULL, value TEXT);
    CREATE VIRTUAL TABLE IF NOT EXISTS shopping_list_item_fts USING fts5(name, item_id);    
    `);

    console.log('DB initialized')
  }catch(e){
    console.log('Error initializing:', e)
  }
}


export default function TabsLayout() {

  return (
    <SQLiteProvider databaseName='test.db' onInit={Platform.OS === 'android'||'ios'? initializeDB:undefined}>
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