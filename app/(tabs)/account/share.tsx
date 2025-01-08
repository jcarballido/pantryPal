import { View, Text } from 'react-native'
import React from 'react'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

export default function share() {
  
  const bottomTabBarHeight = useBottomTabBarHeight()

  const details = ['test1', 'test2']
  
  return (
    <View className='bg-[#F8F4EB] flex-1 items-center px-[20] pt-10'>
      <View style={{ marginBottom:bottomTabBarHeight + 15 }} className='rounded-xl w-full gap-[20] bg-[#E3E8EC]'>
        { 
          details.map( item => {
            return(
              <View>
                <Text>Test</Text>
              </View>
            )
          } 
        )}
      </View>     
    </View>
  )
}