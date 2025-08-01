import React, { use, useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import '../global.css'
import useAuthStore from '@/stores/useAuthStore'
import { Text, View } from 'react-native'

export default function RootLayout() {

  const router = useRouter()
  const { user, loading,initializeSession } = useAuthStore()

  useEffect(() => {
    try{
      initializeSession()
    }catch(e){
      console.log('Error initializing session:', e)
    }
  },[])

  return (
    <Stack>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(protected)" options={{
          headerShown: false
        }} />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" options={{
          headerShown: false
        }} />
      </Stack.Protected>
    </Stack>
  )
}