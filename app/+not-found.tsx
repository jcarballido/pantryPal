import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{headerShown: false}} />
      <View>
        <Text>NotFoundScreen</Text>
      </View>
    </>
  )
}