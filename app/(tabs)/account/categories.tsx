import { View, Text, Pressable, FlatList, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import useItemStore from '@/stores/useItemStore'
import { useSQLiteContext } from 'expo-sqlite'
import { DbRecordStoredCategory, DbRecordStoredItem, ParsedRecordStoredItem } from '@/sharedTypes/ItemType'
import SavedCategory from '@/components/SavedCategory'
import { deleteCategories } from '@/database/deleteCategories'
import { updateDbCategories } from '@/database/updateCategories'
import { create } from 'zustand'
import { addCategory } from '@/database/addCategory'

export default function categories() {

  const {savedCategories, setSavedCategories, deleteCategory, reservedCategories, setStoredItems} = useItemStore()
  const [ deleteMode, setDeleteMode ] = useState<{status:boolean, category?:string}>({status:false})
  const [ editMode, setEditMode] = useState<{status:boolean}>({status:false})
  const [ createMode, setCreateMode ] = useState<{status:boolean}>({status:false})
  const [ itemsEdited, setItemsEdited ] = useState<(DbRecordStoredCategory&{newName: string})[]>([])
  // const [resetItemsEdited, setResetItemsEdited] = useState<boolean>(false)
  const [ itemsMarkedForDeletion, setItemsMarkedForDeletion ] = useState<string[]>([])
  const [ newCategory,updateNewCategory ] = useState<string>('')
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
      const categoryData: DbRecordStoredCategory[] = await db.getAllAsync('SELECT * FROM category')
      const rawStoredItemData:DbRecordStoredItem[] = await db.getAllAsync('SELECT * FROM item')
      const parsedStoredItemData: ParsedRecordStoredItem[] = rawStoredItemData.map( (rawItem: DbRecordStoredItem) => {
        const parsedDetails = JSON.parse(rawItem.details)
        return {...rawItem,details:parsedDetails}
      }) 
      setSavedCategories(categoryData)
      setStoredItems(parsedStoredItemData)
    } catch (error) {
        console.log('Error updating categories:', error)
    }
    console.log('Items to edit:', itemsEdited)
  }

  const enableMode = (type:'delete'|'edit') => {
    const setMode = type === 'delete' ? setDeleteMode:setEditMode
    setMode({status:true})
  }

  interface SetModeInterface {
    (status:'on'|'off',type:'delete'|'edit'|'create'):void
  }

  const setMode:SetModeInterface = (status,type) => {
    const setMode = type === 'delete' 
      ? setDeleteMode
      : type=== 'create'
        ? setCreateMode
        : setEditMode
    if(status === 'on'){
      setMode({status:true})
    }else{
      setMode({status:false})
      setItemsEdited([])
      setItemsMarkedForDeletion([])
    }
  }

  const addNewCategory = async() => {
    // add to category table
    // pull all categories and update zustand
    try {
      await addCategory(db, newCategory)
      const categories:DbRecordStoredCategory[] = await db.getAllAsync('SELECT * FROM category')
      setSavedCategories(categories)
    } catch (error) {
      return console.log('Error adding new category:', error)      
    }
    
    setCreateMode({status:false})
    
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
    <View className='bg-[#F8F4EB] flex flex-col flex-1 items-center px-[20] pt-10'>
      <View style={{ marginBottom:bottomTabBarHeight + 15 }} className='rounded-xl w-full flex flex-col flex-1'>
        {
          deleteMode.status 
          ? <Pressable className='m-4 border-2 border-red-700 ' onPress={deleteItems}>
              <Text>Confirm Deletion</Text>
            </Pressable>
          : editMode.status
            ? <Pressable className='m-4 border-2 border-red-700 ' onPress={() => setMode('off','edit')}>
                <Text>Cancel</Text>
              </Pressable>
            : <Pressable className='m-4 border-2 border-red-700 ' onPress={editMode.status || createMode.status ? null:() => setMode('on','delete')}>
            <Text>Delete</Text>
          </Pressable>
        
        }
        {
          editMode.status 
          ? <Pressable className='m-4 border-2 border-red-700 ' onPress={editItems}>
              <Text>Confirm Edits</Text>
            </Pressable>
          : deleteMode.status
            ? <Pressable className='m-4 border-2 border-red-700 ' onPress={ () => setMode('off','delete')}>
                <Text>Cancel</Text>
              </Pressable>
            : <Pressable className='m-4 border-2 border-red-700 ' onPress={deleteMode.status || createMode.status ? null:() => setMode('on','edit')}>
                <Text>Edit</Text>
              </Pressable>
          // <Pressable className='m-4 border-2 border-red-700 ' onPress={()=>enableMode('edit')}>
          //     <Text>Edit</Text>
          //   </Pressable>
        }
        {
          createMode.status 
          ? <Pressable className='m-4 border-2 border-red-700 ' onPress={()=> setMode('off','create')}>
              <Text>Cancel</Text>
            </Pressable>
          : <Pressable className='m-4 border-2 border-red-700 ' onPress={deleteMode.status || editMode.status ? null:() => setMode('on','create')}>
              <Text>Add</Text>
            </Pressable>
        }
        <View style={{marginBottom:bottomTabBarHeight+30}} className='flex-1 flex-col border-2 border-primary-action-base rounded-xl bg-white w-11/12 self-center'>
          <FlatList
            data={savedCategories}
            keyExtractor={item => item.id }
            renderItem={({item}) => {
              return(
                <SavedCategory item={item} deleteMode={deleteMode} setItemsMarkedForDeletion={setItemsMarkedForDeletion} itemsMarkedForDeletion={itemsMarkedForDeletion} reservedCategories={reservedCategories} editMode={editMode} setItemsEdited={setItemsEdited} itemsEdited={itemsEdited} />
              )
            }}
          />
        {
          createMode.status && 
          <View >
            <TextInput onChangeText={updateNewCategory} value={newCategory} className='border-2 '/>
            <Pressable onPress={addNewCategory}>
              <Text>
                Confirm
              </Text>
            </Pressable>
            <Pressable onPress={()=> setMode('off','create')}>
              <Text>
                Cancel
              </Text>
            </Pressable>
          </View>          
        }
        </View>
      </View>     
    </View>
  )
}
