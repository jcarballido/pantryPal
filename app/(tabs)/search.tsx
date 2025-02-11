import { View, Text, Pressable, StatusBar } from 'react-native'
import React, { useState } from 'react'
import CategorySearch from '@/components/CategorySearch'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import AddItemModal from '@/components/AddItemModal'

export default function search() {

  const bottomTabBarHeight = useBottomTabBarHeight()
  const [ visible, setVisible ] = useState({status:false})

  const showModal = () => {
    setVisible(prev => {return { status: !(prev.status) }})
  }

  return (
    <View className='flex-1 flex-col bg-primary-base max-w-screen'>
      <StatusBar barStyle='dark-content' />
      <AddItemModal visible={visible} setVisible={setVisible} />
      <View className='flex-0 flex-row  m-4 justify-between'>
        <Pressable className='bg-primary-action-base max-w-max min-w-12 min-h-12 p-2.5 rounded-xl flex flex-row items-center' onPress={showModal}>
          <Text className='text-zinc-200 '>Add Item</Text>
        </Pressable>
      </View>
      <CategorySearch defaultValue='Search All' customStyle='' /> 
      <View style={{marginBottom:bottomTabBarHeight+30}} className='flex-1 flex-col border-2 border-primary-action-base rounded-xl bg-white w-11/12 self-center'>
        
      </View>
    </View>
  )
}