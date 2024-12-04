import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name='index' options={{ title: 'Home' }} />
      <Tabs.Screen name='search' options={{ title: 'Search' }} />
      <Tabs.Screen name='list' options={{ title: 'Shopping List' }} />
      <Tabs.Screen name='account' options={{ title: 'Account' }} />
    </Tabs>
  )
}