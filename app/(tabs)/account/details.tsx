import { View, Text } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'

export default function details() {

  const router = useRouter()
  const params = useLocalSearchParams()

  return (
    <View>

      <Text>details</Text>
    </View>
  )
}