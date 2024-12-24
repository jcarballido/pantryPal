import { View, Text, Pressable, FlatList, ScrollView } from 'react-native'
import React, { useState } from 'react'
import data from '../../dummyData/data'
import CategoryItems from '@/components/CategoryItems'
import { getTabBarHeight } from '@react-navigation/bottom-tabs/lib/typescript/commonjs/src/views/BottomTabBar'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

export default function index() {

  const categories: string[] = Array.from(new Set(data.map(item => item.category)))
  categories.sort((a,b) => a.localeCompare(b))

  const [ selectedCategory, setSelectedCategory ] = useState(categories[0])
  // const tabBarHeight = `mb-[${useBottomTabBarHeight()}]`
  const barHeight = useBottomTabBarHeight()


  return (
    <View className='flex-1 flex-col border-2 bg-primary-base ' >
      <View className='flex-1 flex-row max-h-max justify-between m-4'>
        <Pressable className='bg-primary-action-base max-w-max min-w-12 min-h-12 p-2.5 rounded-xl flex flex-row items-center'>
          <Text className='text-zinc-200 '>Add Item</Text>
        </Pressable>
        <Pressable className='max-w-max bg-secondary-action-base rounded-xl min-w-12 min-h-12 p-2.5 flex flex-row items-center '>
          <Text className='text-black '>Search All</Text>
        </Pressable>
      </View>
        <ScrollView horizontal={true} className='flex-1 flex-row justify-between max-h-max p-4 gap-2'>
          { categories.map( (category, index) => {
            return(
              <Pressable key={ index } className={`mx-2 min-w-12 min-h-12 rounded-xl ${category == selectedCategory? 'bg-tertiary-action-active drop-shadow-xl':'bg-tertiary-action-base'} flex flex-row items-center px-2`} onPress={()=>setSelectedCategory(category)}>
                <Text className='m-1'>{ category }</Text>
              </Pressable> 
            )
          })}
        </ScrollView>
      <View style={{paddingBottom:barHeight}} className={`flex-1 flex-col`}>
        <CategoryItems category={selectedCategory} classname='flex-1 flex-col' />
      </View>
    </View>
  )
}