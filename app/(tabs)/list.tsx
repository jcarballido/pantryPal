import { View, Text, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import CategorySearch from '@/components/CategorySearch'
import useItemStore from '@/stores/useItemStore'
import { useSQLiteContext } from 'expo-sqlite'
import { NeededItem, ParsedNeededItemData, RawShoppingListItemData } from '@/sharedTypes/ItemType'
import ShoppingListItem from '@/components/ShoppingListItem'
import AddShoppingListItemModal from '@/components/AddShoppingListItemModal'
import SaveModal from '@/components/SaveModal'

export default function list() {

  const { shoppingList, setShoppingList, deleteFromShoppingList } = useItemStore()
  const db = useSQLiteContext()

  const [ visible, setVisible ] = useState<{status:boolean}>({status:false})
  const [ saveModalVisible, setSaveModalVisible ] = useState<{status:boolean}>({status:false})
  const [ deleteMode, setDeleteMode ] = useState<{status:boolean}>({status:false})
  const [ saveMode, setSaveMode ] = useState<{status:boolean}>({status:false})
  const [ itemsMarkedForDeletion, setItemsMarkedForDeletion ] = useState<number[]>([])
  const [ itemsMarkedForSaving, setItemsMarkedForSaving  ] = useState<ParsedNeededItemData[]>([])
  
  const enableDelete = () => {
    setDeleteMode({status:true})
  }

  useEffect(() => {
    const fetchData = async() => {
      const allShoppingListItems: RawShoppingListItemData[] = await db.getAllAsync('SELECT * FROM shopping_list_item')
      const parsedItems: ParsedNeededItemData[] = allShoppingListItems.map((item) => {
        console.log('type of item id:', typeof(item.id))
        return {id:(item['id']),name:item.name,quantity:item.quantity,details:JSON.parse(item.details)}
      })
      setShoppingList(parsedItems)
    }
    fetchData()
  },[])

  const bottomTabBarHeight = useBottomTabBarHeight()
  const showModal = () => {
    setVisible(prev => {return { status: !(prev.status) }})
  }

  const disableDelete = () => {
    setDeleteMode({status:false})
  }

  const disableSave = () => {
    setSaveMode({status:false})
  }

  const enableSave = () => {
    setSaveMode({status: true})
  }

  const handleSave = async() => {
    setSaveModalVisible({status: true})
  }

  const handleDelete =  async() => {
    const placeHolders = itemsMarkedForDeletion.map(id => {return '?'}).join()

    try {
      await db.runAsync(`DELETE FROM shopping_list_item WHERE id IN (${placeHolders})`,itemsMarkedForDeletion)
      deleteFromShoppingList(itemsMarkedForDeletion)
      // setSavedItems( prev => {
      //   const filteredPrevState = prev.filter((item:ParsedItemData) => !itemsMarkedForDeletion.includes(parseInt(item.id)))
      //   return filteredPrevState
      // })
      setItemsMarkedForDeletion([])
      setDeleteMode({status:false})
      // console.log('Selected Category:', selectedCategory)
      // console.log('Number of items in category:', numItemsByCateogry)
      // console.log('Stored Categories:', storedCategories)
    } catch (e) {
      console.log('Error processing delelte:', e)
    }
  }

  return (
    <View className='flex-1 flex-col bg-primary-base max-w-screen'>
      <AddShoppingListItemModal visible={visible} setVisible={setVisible} />
      <SaveModal saveModalVisible={saveModalVisible} setSaveModalVisible={setSaveModalVisible} itemsMarkedForSaving={itemsMarkedForSaving} />
      <View className='flex items-center justify-center mr-4'>
        {
          deleteMode.status
          ? 
            <View className='flex flex-row gap-5'>
              <Text onPress={handleDelete}>Confirm</Text>
              <Pressable onPress={disableDelete}><Text>Cancel</Text></Pressable>
            </View>
          : <Pressable onPress={enableDelete}>
              <Text>Delete</Text>
            </Pressable>
        }
        {
          saveMode.status
          ? 
            <View className='flex flex-row gap-5'>
              <Text onPress={handleSave}>Confirm</Text>
              <Pressable onPress={disableSave}><Text>Cancel</Text></Pressable>
            </View>
          : <Pressable onPress={enableSave}>
              <Text>Save</Text>
            </Pressable>
        }
      </View>
      <Text className='self-center m-10'> Shopping List </Text>
      <Pressable className='bg-primary-action-base max-w-max min-w-12 min-h-12 p-2.5 rounded-xl flex flex-row items-center' onPress={showModal}>
        <Text className='text-zinc-200'>Add Item</Text>
      </Pressable>
      <View style={{marginBottom:bottomTabBarHeight+30}} className='flex-1 flex-col border-2 border-primary-action-base rounded-xl bg-white w-11/12 self-center'>
        <FlatList
          data={shoppingList}
          renderItem={({item})=>{
            return(
              <ShoppingListItem item={item} saveMode={saveMode} setItemsMarkedForSaving={setItemsMarkedForSaving} itemsMarkedForSaving={itemsMarkedForSaving} deleteMode={deleteMode} setItemsMarkedForDeletion={setItemsMarkedForDeletion} itemsMarkedForDeletion={itemsMarkedForDeletion}/>
            )
          }}
        />
      </View>
    </View>  )
}