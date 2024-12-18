import { View, Text, Pressable, FlatList, ScrollView } from 'react-native'
import React, { useState } from 'react'
import data from '../../dummyData/data'
import CategoryItems from '@/components/CategoryItems'

export default function index() {

  const categories: string[] = Array.from(new Set(data.map(item => item.category)))
  categories.sort((a,b) => a.localeCompare(b))

  const [ selectedCategory, setSelectedCategory ] = useState(categories[0])

  return (
    <View className='flex-1 flex-col border-2 border-green-400 ' >
      <View className='flex-1 flex-row max-h-max justify-between border-2 border-blue-700 m-4'>
        <Pressable className='bg-purple-700 max-w-max rounded-xl'>
          <Text className='text-zinc-200'>+ Add Item</Text>
        </Pressable>
        <Pressable className='max-w-max bg-blue-600 rounded-xl'>
          <Text className='text-black '>Search All</Text>
        </Pressable>
      </View>
        <ScrollView horizontal={true} className='flex-1 flex-row justify-between border-2 border-blue-300 max-h-max p-4 bg-amber-200'>
          { categories.map( (category, index) => {
            return(
              <Pressable key={ index } className='mx-2 bg-gray-300 drop-shadow-xl rounded-xl' onPress={()=>setSelectedCategory(category)}>
                <Text className='m-1'>{ category }</Text>
              </Pressable> 
            )
          })}
        </ScrollView>
      <View className='flex-1 flex-col'>
        <CategoryItems category={selectedCategory} classname='flex-1 flex-col border-red-700 border-2' />
      </View>
    </View>
  )
}