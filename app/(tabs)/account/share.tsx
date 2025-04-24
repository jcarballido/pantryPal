import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import useItemStore from '@/stores/useItemStore'

export default function share() {
  // Manage categories; add, delete, update
  // Manage who to share inventory with

  const {allStoredItems} = useItemStore()
  const [ storedCategories, setStoredCategories ] = useState<string[]>([])
  

  useEffect(() => {
    const categories: string[] = Array.from(new Set(allStoredItems.map(item => {
      // if(item.category === 'New Category' && typeof(item.newCategory) === 'string') return item.value.newCategory
      return item.category
    })))
    categories.sort((a,b) => a.localeCompare(b))
    setStoredCategories([...categories])
  }, [allStoredItems])
  
  const bottomTabBarHeight = useBottomTabBarHeight()
  
  return (
    <View className='bg-[#F8F4EB] flex-1 items-center px-[20] pt-10'>
      <View style={{ marginBottom:bottomTabBarHeight + 15 }} className='rounded-xl w-full gap-[20] bg-[#E3E8EC]'>
        { 
          storedCategories?.map( category => {
            return(
              <Text>{category}</Text>
            )
          })
        }
      </View>     
    </View>
  )
}