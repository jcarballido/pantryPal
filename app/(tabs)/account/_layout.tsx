import { View, Text, Button, Pressable } from 'react-native'
import React from 'react'
import { Stack, useRouter } from 'expo-router'

export default function AccountStack() {
  return (
    <Stack
      screenOptions={{
        headerStyle:{ backgroundColor:'#F8F4EB' },
      }}
    >
      <Stack.Screen name='index' options={{headerShown:false}}/>
      <Stack.Screen name='changePassword' options={{ headerTitle:'Change Password' }}/>
      <Stack.Screen name='details' options={{ headerTitle:'Details' }}/>
      <Stack.Screen name='share' options={{ headerTitle:'Share Inventory' }} />
    </Stack>
  )
}