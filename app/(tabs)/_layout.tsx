import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
// import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui'
import MaterialIcons  from '@expo/vector-icons/MaterialIcons'

export default function TabsLayout() {

  return (
    <Tabs screenOptions={
      {
        tabBarStyle:{
          backgroundColor:'#A3C7C9',
          position:'absolute',
          bottom: 10,
          borderRadius: 999,
          minHeight:44,
          height:'auto',
          paddingVertical:10,
          width:'75%',
          marginHorizontal:'auto'        
        },
        tabBarActiveTintColor:'#1A3554',
        tabBarInactiveTintColor:'#505050',
        tabBarItemStyle:{
          marginHorizontal:8,
          marginVertical:'auto'
        },
        tabBarLabelPosition:'below-icon',
        tabBarShowLabel: false
      }
    }>
      <Tabs.Screen name='index' options={{ 
        headerShown: false, 
        title: 'Categories',
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialIcons name="category" size={24} color={color} />         
        )
        }}
       />
      <Tabs.Screen name='search' options={{ 
        title: 'Search',
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialIcons name="search" size={24} color={color} />         
        )
       }} 
      />
      <Tabs.Screen name='list' options={{ 
        title: 'Shopping List',
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialIcons name="format-list-bulleted" size={24} color={color} />         
        )
        }} 
      />
      <Tabs.Screen name='account' options={{
         title: 'Account',
         tabBarIcon: ({ focused, color, size }) => (
          <MaterialIcons name="account-circle" size={24} color={color} />         
        ) 
        }} 
      />
    </Tabs>
  )
}
// <Tabs>
//   <TabSlot />
//   <TabList className=' w-full border-4 border-blue-800 bg-red-600' >
//         <TabTrigger name='index' href='/' className='border-2 border-black'>
//           <Text>Categories</Text>
//         </TabTrigger>
//         <TabTrigger name='search' href='/search'>
//           <Text>Search</Text>
//         </TabTrigger>
//         <TabTrigger name='list' href='/list'>
//           <Text>List</Text>
//         </TabTrigger>
//         <TabTrigger name='account' href='/account'>
//           <Text>Account</Text>
//         </TabTrigger>

//   </TabList>
// </Tabs>