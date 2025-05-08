import { View, Text, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import useItemStore from '@/stores/useItemStore'
import { useSQLiteContext } from 'expo-sqlite'
import { DbRecordStoredCategory } from '@/sharedTypes/ItemType'
import SavedCategory from '@/components/SavedCategory'
import { deleteCategories } from '@/database/deleteCategories'
import { updateDbCategories } from '@/database/updateCategories'

export default function categories() {

  const {savedCategories, setSavedCategories, deleteCategory, reservedCategories} = useItemStore()
  const [ deleteMode, setDeleteMode ] = useState<{status:boolean, category?:string}>({status:false})
  const [ editMode, setEditMode] = useState<{status:boolean}>({status:false})
  const [ itemsEdited, setItemsEdited ] = useState<(DbRecordStoredCategory&{newName: string})[]>([])
  const [ itemsMarkedForDeletion, setItemsMarkedForDeletion ] = useState<string[]>([])
  const db = useSQLiteContext()

  const deleteItems = () => {
    console.log('Items to be deleted:', itemsMarkedForDeletion)
    const itemsToDelete: string[] = savedCategories.filter(cat => itemsMarkedForDeletion.includes(cat.id)).map(cat => cat.id)
    deleteCategories(db,itemsToDelete, deleteCategory)
  }
  
  const editItems = async() => {
    // Edit db
    // Edit zustand store
    try {
      await updateDbCategories(db,itemsEdited)
      const data: DbRecordStoredCategory[] = await db.getAllAsync('SELECT * FROM category')
      console.log('Date recieved from data:', data)
      setSavedCategories(data)      
    } catch (error) {
        console.log('Error updating categories:', error)
    }
    console.log('Items to edit:', itemsEdited)
  }

  const enableMode = (type:'delete'|'edit') => {
    const setMode = type === 'delete' ? setDeleteMode:setEditMode
    setMode({status:true})
  }

  useEffect(() => {
    const fetchData = async() => {
      const allSavesCategories:DbRecordStoredCategory[] = await db.getAllAsync('SELECT * FROM category')
      setSavedCategories(allSavesCategories)
    }
    fetchData()
  },[])
  
  const bottomTabBarHeight = useBottomTabBarHeight()

  return (
    <View className='bg-[#F8F4EB] flex-1 items-center px-[20] pt-10'>
      <View style={{ marginBottom:bottomTabBarHeight + 15 }} className='rounded-xl w-full flex flex-col '>
        {
          deleteMode.status 
          ? <Pressable className='m-4 border-2 border-red-700 ' onPress={deleteItems}>
              <Text>Confirm Deletion</Text>
            </Pressable>
          : <Pressable className='m-4 border-2 border-red-700 ' onPress={() => enableMode('delete')}>
              <Text>Delete</Text>
            </Pressable>
        }
        {
          editMode.status 
          ? <Pressable className='m-4 border-2 border-red-700 ' onPress={editItems}>
              <Text>Confirm Edits</Text>
            </Pressable>
          : <Pressable className='m-4 border-2 border-red-700 ' onPress={()=>enableMode('edit')}>
              <Text>Edit</Text>
            </Pressable>
        }
        <FlatList
          data={savedCategories}
          keyExtractor={item => item.id }
          renderItem={({item}) => {
            return(
              <SavedCategory item={item} deleteMode={deleteMode} setItemsMarkedForDeletion={setItemsMarkedForDeletion} itemsMarkedForDeletion={itemsMarkedForDeletion} reservedCategories={reservedCategories} editMode={editMode} setItemsEdited={setItemsEdited} itemsEdited={itemsEdited} />
            )
          }}
        />

      </View>     
    </View>
  )
}
