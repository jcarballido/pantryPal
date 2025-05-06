import { View, Text, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import useItemStore from '@/stores/useItemStore'
import { useSQLiteContext } from 'expo-sqlite'
import { DbRecordStoredCategory } from '@/sharedTypes/ItemType'
import SavedCategory from '@/components/SavedCategory'
import { deleteCategories } from '@/database/deleteCategories'

export default function categories() {

  const {savedCategories, setSavedCategories, deleteCategory, reservedCategories} = useItemStore()
  const [ deleteMode, setDeleteMode ] = useState<{status:boolean, category?:string}>({status:false})
  const [ itemsMarkedForDeletion, setItemsMarkedForDeletion ] = useState<string[]>([])
  const db = useSQLiteContext()

  const deleteItems = () => {
    console.log('Items to be deleted:', itemsMarkedForDeletion)
    //Delete from db
    //Delete from zustand store; re-fetch stored categories
    const itemsToDelete: string[] = savedCategories.filter(cat => itemsMarkedForDeletion.includes(cat.id)).map(cat => cat.id)
    deleteCategories(db,itemsToDelete, deleteCategory)
  }

  useEffect(() => {
    const fetchData = async() => {
      const allSavesCategories:DbRecordStoredCategory[] = await db.getAllAsync('SELECT * FROM category')
      setSavedCategories(allSavesCategories)
    }
    fetchData()
  },[])
  
  const bottomTabBarHeight = useBottomTabBarHeight()
  
  const enableDelete = () => {
    setDeleteMode({status:true})
  }

  return (
    <View className='bg-[#F8F4EB] flex-1 items-center px-[20] pt-10'>
      <View style={{ marginBottom:bottomTabBarHeight + 15 }} className='rounded-xl w-full flex flex-col '>
        {
          deleteMode.status 
          ? <Pressable className='m-4 border-2 border-red-700 ' onPress={deleteItems}>
              <Text>Confirm</Text>
            </Pressable>
          : <Pressable className='m-4 border-2 border-red-700 ' onPress={enableDelete}>
              <Text>Delete</Text>
            </Pressable>


        }
        <FlatList
          data={savedCategories}
          keyExtractor={item => item.id }
          renderItem={({item}) => {
            return(
              <SavedCategory item={item} deleteMode={deleteMode} setItemsMarkedForDeletion={setItemsMarkedForDeletion} itemsMarkedForDeletion={itemsMarkedForDeletion} reservedCategories={reservedCategories} />
            )
          }}
        />

      </View>     
    </View>
  )
}
