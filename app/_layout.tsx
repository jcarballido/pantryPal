import React from 'react'
import { Stack } from 'expo-router'
import '../global.css'
import useAuthStore from '@/stores/useAuthStore'

export default function RootLayout() {

  return (
    <Stack>
      <Stack.Screen name="(protected)" options={{
        headerShown: false
      }} />
      <Stack.Screen name="(auth)/login" options={{
        headerShown: false
      }} />
      <Stack.Screen name="(auth)/signUp" options={{
        headerShown: false,
      }} />

    </Stack>
  )
}