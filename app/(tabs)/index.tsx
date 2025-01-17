import { View, Text, Pressable, ScrollView, StatusBar, Modal } from 'react-native'
import React, { useState } from 'react'
import data from '../../dummyData/data'
import CategoryItems from '@/components/CategoryItems'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import CategorySearch from '@/components/CategorySearch'

import AddItemModal from '@/components/AddItemModal'

export default function index() {

  const [ visible, setVisible ] = useState({ status: false })

  const categories: string[] = Array.from(new Set(data.map(item => item.category)))
  categories.sort((a,b) => a.localeCompare(b))

  const [ selectedCategory, setSelectedCategory ] = useState(categories[0])
  const barHeight = useBottomTabBarHeight()

  const showModal = () => {
    setVisible(prev => {return { status: !(prev.status) }})
  }

  return (
    <View className='flex-1 flex-col bg-primary-base max-w-screen' >
      <StatusBar barStyle='dark-content' />
      <AddItemModal visible={visible} setVisible={setVisible} />
      <View className='flex-0 flex-row justify-between m-4'>
        <Pressable className='bg-primary-action-base max-w-max min-w-12 min-h-12 p-2.5 rounded-xl flex flex-row items-center' onPress={showModal}>
          <Text className='text-zinc-200 '>Add Item</Text>
        </Pressable>
        <Pressable className='max-w-max bg-secondary-action-base rounded-xl min-w-12 min-h-12 p-2.5 flex flex-row items-center '>
          <Text className='text-black '>Search All</Text>
        </Pressable>
      </View>
      <ScrollView horizontal={true} className='flex-grow-0 flex-row p-2 gap-4 border-2 border-secondary-action-active mx-1 rounded-lg'>
        { categories.map( (category, index) => {
          return(
            <Pressable key={ index } className={`min-w-12 min-h-[44] rounded-xl ${category == selectedCategory? 'bg-tertiary-action-active drop-shadow-xl':'bg-tertiary-action-base'} flex-0 flex-row h-max items-center px-2 mr-2`} onPress={()=>setSelectedCategory(category)}>
              <Text className='m-1'>{ category }</Text>
            </Pressable> 
          )
        })}
      </ScrollView>
      <CategorySearch defaultValue='Search Category'/>
      <View style={{paddingBottom:barHeight}} className={`flex-1 flex-col`}>
        <CategoryItems category={selectedCategory} classname='flex-col' />
      </View>
    </View>
  )
}