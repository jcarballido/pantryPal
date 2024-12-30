import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

export default function test() {
  return (
    <View>
      <Text>test</Text>
      <Link href={'/account'}>Go to index</Link>
    </View>
  )
}
