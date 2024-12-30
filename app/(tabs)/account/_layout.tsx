import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function AccountStack() {
  return (
    <Stack screenOptions={{
      headerTransparent: true,
      headerBackVisible:true
    }} >
      <Stack.Screen name='index' />
      <Stack.Screen name='changePassword' />
      <Stack.Screen name='details' options={{title:'Detalles'}}/>
      <Stack.Screen name='share' />
    </Stack>
  )
}