import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { ItemData } from '@/sharedTypes/ItemType'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

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

  const bodyText = 'text-dark-charcoal-gray'
  const subtleText = 'text-zinc-400 font-sm mb-2 flex-1 '
  const headerText = 'text-primary-action-base text-xl'
  
  return (
    <View className=' mx-2 overflow-clip  border-2 border-primary-action-base rounded-xl mb-4'>
      <View className={`bg-white p-2 flex flex-row ${show.status? '':''}`}>
        <View className='flex-1'>
          <Text className={headerText}>{name}</Text>
          <Text className={subtleText}>Item ID: {id}</Text>
          <Text className={bodyText}>Amount: {amount}</Text>
        </View>
        <View className='flex-0 flex-col'>
          <View className='flex-1 flex-row mb-2'>
            <Pressable className='bg-primary-action-base min-w-[44] min-h-[44] max-h-[60] rounded-lg flex  justify-center items-center mr-8 py-4'>
              <MaterialIcons name='edit' size={24} color={'white'} />
              <Text className='font-sm text-white font-bold'>Edit</Text>
            </Pressable>
            <Pressable className='min-w-[44] flex justify-center items-center min-h-[44] max-h-[60] rounded-lg border-2 border-red-300 py-4'>
              <MaterialIcons name='flag' size={24} color='#333333' />
              Flag
            </Pressable>
          </View>
          {
            Object.keys(rest).length > 0
            ? <Pressable className={`flex items-center justify-center min-w-[44] h-[44] border-2 border-light-cool-gray rounded-lg ${show.status? 'bg-light-cool-gray':'bg-transparent'}`} onPress={()=>setShow(previousShow => {return {status:!previousShow.status}})} > 
                <Text>Details</Text>
              </Pressable>
            : null
          }
        </View>
      </View>
      <View className={`${show.status?'bg-light-cool-gray p-2':''} `}>
        { show.status && descriptors.map( descriptor => {
          return(
            <View className=''>
              <Text className={bodyText}>{descriptor[0]}</Text>
              <Text className={bodyText}>{descriptor[1]}</Text>
            </View>
          )})
        }
      </View>
    </View>
    )
}