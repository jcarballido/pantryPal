import { View, Text } from 'react-native'
import React from 'react'
import { ParsedNeededItemData } from '@/sharedTypes/ItemType'

interface Props {
  item: ParsedNeededItemData
}


export default function ShoppingListItem({item}:Props) {

  const { id, name,quantity,details } = item
  // const { name, quantity, ...rest } = value
  console.log('Details from shopping list item: ', details)
  return (
    <View>
      <Text>{name}</Text>
      <Text>{quantity}</Text>
    </View>
  )
}