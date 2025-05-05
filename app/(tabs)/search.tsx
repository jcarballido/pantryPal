import { View, Text, Pressable, StatusBar, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
// import CategorySearch from '@/components/CategorySearch'
import GlobalSearch from '@/components/GlobalSearch'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import AddItemModal from '@/components/AddItemModal'
import useItemStore from '@/stores/useItemStore'
import { ParsedRecordStoredItem } from '@/sharedTypes/ItemType'
import CategoryItem from '@/components/CategoryItem'
import EditItemModal from '@/components/EditItemModal'

export default function search() {

  const { allStoredItems } = useItemStore()


  
  const bottomTabBarHeight = useBottomTabBarHeight()
  const [ visible, setVisible ] = useState({status:false})
  const [ searchResult, setSearchResult ] = useState<ParsedRecordStoredItem[]>([])
  const [ editModeVisible, setEditModeVisible] = useState<{status: boolean, item?:ParsedRecordStoredItem}>({status:false})
  const [ deleteMode, setDeleteMode ] = useState<{status:boolean, category?:string}>({status:false})
  const [ itemsMarkedForDeletion, setItemsMarkedForDeletion ] = useState<number[]>([])
  const [ storedCategories, setStoredCategories ] = useState<string[]>([])

  useEffect(() => {
    const categories: string[] = Array.from(new Set(allStoredItems.map(item => {
      // if(item.category === 'New Category' && typeof(item.newCategory) === 'string') return item.value.newCategory
      return item.category
    })))
    categories.sort((a,b) => a.localeCompare(b))
    setStoredCategories([...categories])    
  },[allStoredItems])

  const showModal = () => {
    setVisible(prev => {return { status: !(prev.status) }})
  }

  return (
    <View className='flex-1 flex-col bg-primary-base max-w-screen'>
      <AddItemModal visible={visible} setVisible={setVisible} storedCategories={storedCategories} />
      <EditItemModal editModalVisible={editModeVisible} setEditModalVisible={setEditModeVisible} storedCategories={storedCategories}  />
      <StatusBar barStyle='dark-content' />
      <View className='flex-0 flex-row  m-4 justify-between'>
        <Pressable className='bg-primary-action-base max-w-max min-w-12 min-h-12 p-2.5 rounded-xl flex flex-row items-center' onPress={showModal}>
          <Text className='text-zinc-200'>Add Item</Text>
        </Pressable>
      </View>
      <GlobalSearch setSearchResult={setSearchResult} /> 
      <View style={{marginBottom:bottomTabBarHeight+30}} className='flex-1 flex-col border-2 border-primary-action-base rounded-xl bg-white w-11/12 self-center'>
        <FlatList 
          data={searchResult.length > 0 ? searchResult : allStoredItems }
          renderItem={({ item }) => {
            return(
              <CategoryItem item={item} setEditModalVisible={setEditModeVisible} deleteMode={deleteMode} setItemsMarkedForDeletion={setItemsMarkedForDeletion} itemsMarkedForDeletion={itemsMarkedForDeletion} />
            )
          }}
        />
      </View>
    </View>
  )
}