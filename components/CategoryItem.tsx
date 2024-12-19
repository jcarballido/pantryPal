import { View, Text } from 'react-native'
import React from 'react'
import { ItemData } from '@/sharedTypes/ItemType'

interface CategoryItemProps {
  item: ItemData
}

export default function CategoryItem({ item }: CategoryItemProps) {
  return (
    <View>
      <Text>CategoryItem</Text>
    </View>
  )
}