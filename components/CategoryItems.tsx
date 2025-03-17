import { View, Text, FlatList } from 'react-native'
import React, { SetStateAction, useEffect, useState } from 'react'
// import data from '@/dummyData/data'
import CategoryItem from './CategoryItem'
import CategorySearch from './CategorySearch'
import { ParsedItemData } from '@/sharedTypes/ItemType';
import useItemStore from '@/stores/useItemStore';

interface CategoryItemProps {
  selectedCategory: string | null;
  classname: string;
  // storedItems: ParsedItemData[],
  editModalVisible: { status: boolean; itemId?:number };
  setEditModalVisible: React.Dispatch<SetStateAction<{ status: boolean; itemId?:number }>>;
  deleteMode: { status: boolean, category?: string };
  setItemsMarkedForDeletion: React.Dispatch<SetStateAction<number[]>>,
  itemsMarkedForDeletion: number[],
  categorySpecificItems:ParsedItemData[],
  setCategorySpecificItems:React.Dispatch<SetStateAction<ParsedItemData[]>>;
  filteredCategorySpecificItems:ParsedItemData[];
  setFilteredCategorySpecificItems: React.Dispatch<SetStateAction<ParsedItemData[]>>
}

export default function CategoryItems({selectedCategory, classname, editModalVisible, setEditModalVisible, deleteMode, setItemsMarkedForDeletion, itemsMarkedForDeletion, categorySpecificItems, setCategorySpecificItems, filteredCategorySpecificItems, setFilteredCategorySpecificItems}:CategoryItemProps) {

  const { allStoredItems } = useItemStore() 
  
  useEffect(() => {
    if(selectedCategory !== null) {
      const filteredItems:ParsedItemData[] = allStoredItems.filter(item => {
        // console.log('Item being filtered:', item)
        // if(!item.newCategory){
          // return item.value.category === selectedCategory
        // }else{
          return item.category === selectedCategory
        // }
      })
      // console.log('Filtered Items:', filteredItems)
      setCategorySpecificItems([...filteredItems])
    } 
  },[selectedCategory,allStoredItems])
  
  if(filteredCategorySpecificItems.length > 0){
    return (
      <View className={classname}>
        <FlatList
          data={filteredCategorySpecificItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return(
              <CategoryItem item={ item }  setEditModalVisible={setEditModalVisible} deleteMode={deleteMode} setItemsMarkedForDeletion={setItemsMarkedForDeletion} itemsMarkedForDeletion={itemsMarkedForDeletion} />
            )
          }}
          className='flex flex-col'
        />
      </View>
    )
  }else{
    return (
      <View className={classname}>
        <FlatList
          data={categorySpecificItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return(
              <CategoryItem item={ item }  setEditModalVisible={setEditModalVisible} deleteMode={deleteMode} setItemsMarkedForDeletion={setItemsMarkedForDeletion} itemsMarkedForDeletion={itemsMarkedForDeletion} />
            )
          }}
          className='flex flex-col'
        />
      </View>
    )
  }
}