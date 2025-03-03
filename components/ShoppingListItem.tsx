import { View, Text } from 'react-native'
import React from 'react'
import { ParsedNeededItemData } from '@/sharedTypes/ItemType'

interface Props {
  item: ParsedNeededItemData
}


export default function ShoppingListItem({item}:Props) {

  const { id, value } = item
  const { name, quantity, ...rest } = value

  return (
    <View>
      <Text>{name}</Text>
    </View>
  )
}