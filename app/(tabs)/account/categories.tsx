import { View, Text, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import useItemStore from '@/stores/useItemStore'
import { useSQLiteContext } from 'expo-sqlite'
import { DbRecordStoredCategory } from '@/sharedTypes/ItemType'
import SavedCategory from '@/components/SavedCategory'

export default function categories() {

  const {savedCategories, setSavedCategories} = useItemStore()
  const [ deleteMode, setDeleteMode ] = useState<{status:boolean, category?:string}>({status:false})
  const [ itemsMarkedForDeletion, setItemsMarkedForDeletion ] = useState<string[]>([])

  const deleteItems = () => {
    console.log('Items to be deleted:', itemsMarkedForDeletion)
  }


  
  const db = useSQLiteContext()

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
              <SavedCategory item={item} deleteMode={deleteMode} setItemsMarkedForDeletion={setItemsMarkedForDeletion} itemsMarkedForDeletion={itemsMarkedForDeletion} />
            )
          }}
        />

      </View>     
    </View>
  )
}

/*
        { 
          savedCategories?.map( category => {
            return(
              deleteMode.status
              ? <View className='mr-4 justify-center '>
                  <Pressable className='' onPress={handleCheck}>
                    {
                      isChecked
                      ? <View className='size-8 border items-center justify-center bg-white rounded-lg'><Text>X</Text></View>
                      : <View className='size-8 bg-white rounded-lg'></View>
                    }
                  </Pressable>
                </View>
              : null
            )
          })
        }
*/