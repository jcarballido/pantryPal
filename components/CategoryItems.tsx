import { View, Text } from 'react-native'
import React from 'react'

interface CategoryItemProps {
  category: string
}

export default function CategoryItems({ category }:CategoryItemProps) {
  return (
    <View>
      <Text>CategoryItems</Text>
    </View>
  )
}