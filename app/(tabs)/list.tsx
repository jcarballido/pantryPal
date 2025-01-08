import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import CategorySearch from '@/components/CategorySearch'

export default function list() {

  const bottomTabBarHeight = useBottomTabBarHeight()

  return (
    <View className='flex-1 flex-col bg-primary-base max-w-screen'>
      <Text className='self-center m-10'> Shopping List </Text>
      <View style={{marginBottom:bottomTabBarHeight+30}} className='flex-1 flex-col border-2 border-primary-action-base rounded-xl bg-white w-11/12 self-center'>
        
      </View>
    </View>  )
}