import { View, Text, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import CategorySearch from '@/components/CategorySearch'
import useItemStore from '@/stores/useItemStore'
import { useSQLiteContext } from 'expo-sqlite'
import { NeededItem, ParsedNeededItemData, RawShoppingListItemData } from '@/sharedTypes/ItemType'
import ShoppingListItem from '@/components/ShoppingListItem'
import AddShoppingListItemModal from '@/components/AddShoppingListItemModal'

export default function list() {

  const { shoppingList, setShoppingList } = useItemStore()
  const db = useSQLiteContext()

  const [ visible, setVisible ] = useState<{status:boolean}>({status:false})

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


  return (
    <View className='flex-1 flex-col bg-primary-base max-w-screen'>
      <AddShoppingListItemModal visible={visible} setVisible={setVisible} />
      <Text className='self-center m-10'> Shopping List </Text>
      <Pressable className='bg-primary-action-base max-w-max min-w-12 min-h-12 p-2.5 rounded-xl flex flex-row items-center' onPress={showModal}>
        <Text className='text-zinc-200'>Add Item</Text>
      </Pressable>
      <View style={{marginBottom:bottomTabBarHeight+30}} className='flex-1 flex-col border-2 border-primary-action-base rounded-xl bg-white w-11/12 self-center'>
        <FlatList
          data={shoppingList}
          renderItem={({item})=>{
            return(
              <ShoppingListItem item={item} />
            )
          }}
        />
      </View>
    </View>  )
}