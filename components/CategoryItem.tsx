import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { ItemData } from '@/sharedTypes/ItemType'

interface CategoryItemProps {
  item: ItemData
}

export default function CategoryItem(props: CategoryItemProps) {

  const [ show, setShow ] = useState({status:false})
  const {name,id,amount, category, ...rest} = props.item
  
  const descriptors:(string|number)[][] = []

  for (const key in rest){
    const value = rest[key]
    descriptors.push([key,value])
  }
  
  return (
      <View className='border-2 border-amber-600'>
        <View className='border-2 border-cyan-500'>
          <Text>{name}</Text>
          <Text>{id}</Text>
          <Text>{amount}</Text>
          {
            Object.keys(rest).length > 0
            ? <Pressable onPress={()=>setShow(previousShow => {return {status:!previousShow.status}})} > 
                <Text>Details</Text>
              </Pressable>
            : null
          }
        </View>
        { show.status && descriptors.map( descriptor => {
          return(
            <View className={``}>
              <Text>{descriptor[0]}</Text>
              <Text>{descriptor[1]}</Text>
            </View>
          )
        }) }
      </View>
    )
}