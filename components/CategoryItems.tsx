import { View, Text, FlatList } from 'react-native'
import React from 'react'
import data from '@/dummyData/data'
import CategoryItem from './CategoryItem'
import CategorySearch from './CategorySearch'

interface CategoryItemProps {
  category: string,
  classname: string
}

export default function CategoryItems(props:CategoryItemProps) {

  const selectedCategory = data.filter(item => item.category === props.category)
  
  return (
    <View className={props.classname}>
      <CategorySearch />
      <FlatList
        data={selectedCategory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return(
            <CategoryItem item={ item } />
          )
        }}
      />
    </View>
  )
}