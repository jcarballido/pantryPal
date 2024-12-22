import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
// import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui'

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name='index' options={{ headerShown: false, title: 'Categories' }} />
      <Tabs.Screen name='search' options={{ title: 'Search' }} />
      <Tabs.Screen name='list' options={{ title: 'Shopping List' }} />
      <Tabs.Screen name='account' options={{ title: 'Account' }} />
    </Tabs>
  )
}