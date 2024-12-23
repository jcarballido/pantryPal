import { View, Text } from 'react-native'
import React from 'react'
// import { Tabs } from 'expo-router'
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui'

export default function TabsLayout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList className=' w-full border-4 border-blue-800 bg-red-600' >
            <TabTrigger name='index' href='/' className='border-2 border-black'>
              <Text>Categories</Text>
            </TabTrigger>
            <TabTrigger name='search' href='/search'>
              <Text>Search</Text>
            </TabTrigger>
            <TabTrigger name='list' href='/list'>
              <Text>List</Text>
            </TabTrigger>
            <TabTrigger name='account' href='/account'>
              <Text>Account</Text>
            </TabTrigger>

      </TabList>
    </Tabs>
  )
}
    // <Tabs>
    //   <Tabs.Screen name='index' options={{ headerShown: false, title: 'Categories' }} />
    //   <Tabs.Screen name='search' options={{ title: 'Search' }} />
    //   <Tabs.Screen name='list' options={{ title: 'Shopping List' }} />
    //   <Tabs.Screen name='account' options={{ title: 'Account' }} />
    // </Tabs>