import { View, Text, FlatList } from 'react-native'
import React, { SetStateAction, useEffect, useState } from 'react'
// import data from '@/dummyData/data'
import CategoryItem from './CategoryItem'
import CategorySearch from './CategorySearch'
import { ParsedItemData } from '@/sharedTypes/ItemType';

interface CategoryItemProps {
  selectedCategory: string | null;
  classname: string;
  storedItems: ParsedItemData[],
  editModalVisible: { status: boolean; itemId?:number };
  setEditModalVisible: React.Dispatch<SetStateAction<{ status: boolean; itemId?:number }>>
}

export default function CategoryItems({selectedCategory, classname, storedItems, editModalVisible, setEditModalVisible}:CategoryItemProps) {

  const [ categorySpecificItems, setCategorySpecificItems ] = useState<ParsedItemData[]>([])
  useEffect(() => {
    if(selectedCategory !== null) {
      const filteredItems:ParsedItemData[] = storedItems.filter(item => {
        if(!item.value.newCategory){
          return item.value.category === selectedCategory
        }else{
          return item.value.newCategory === selectedCategory
        }
      })
      setCategorySpecificItems([...filteredItems])
    } 
  },[selectedCategory,storedItems])
  
  return (
    <View className={classname}>
      <FlatList
        data={categorySpecificItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return(
            <CategoryItem item={ item }  setEditModalVisible={setEditModalVisible} />
          )
        }}
        className='flex flex-col'
      />
    </View>
  )
}