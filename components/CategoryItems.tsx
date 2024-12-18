import { View, Text, FlatList } from 'react-native'
import React from 'react'
import data from '@/dummyData/data'

interface CategoryItemProps {
  category: string,
  classname: string
}

export default function CategoryItems({ category,classname }:CategoryItemProps) {

  const selectedCategory = data.filter(item => item.category === category)
  
  return (
    <View className={classname}>
      <FlatList
        data={selectedCategory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return(
            <View>
              <Text>{item.name}</Text>
            </View>
          )
        }}
      />
    </View>
  )
}