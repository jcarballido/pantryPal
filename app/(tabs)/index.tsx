import { View, Text, Pressable, ScrollView, StatusBar, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
// import data from '../../dummyData/data'
import CategoryItems from '@/components/CategoryItems'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import CategorySearch from '@/components/CategorySearch'
import { ItemData, RawItemData, ParsedItemData } from '@/sharedTypes/ItemType'
import AddItemModal from '@/components/AddItemModal'
import { useSQLiteContext } from 'expo-sqlite'
import EditItemModal from '@/components/EditItemModal'
import useItemStore from '@/stores/useItemStore'

export default function index() {

  const { allStoredItems, setStoredItems, deleteStoredItems } = useItemStore()

  const db = useSQLiteContext()

  const [ visible, setVisible ] = useState({ status: false }) 
  const [ editModalVisible, setEditModalVisible ] = useState({ status: false }) 
  // const [ allStoredItems, setSavedItems ] = useState<ParsedItemData[]>([])
  const [ storedCategories, setStoredCategories ] = useState<string[]>([])
  const [ selectedCategory, setSelectedCategory ] = useState< string|null >(null)
  const [ deleteMode, setDeleteMode ] = useState<{status:boolean, category?:string}>({status:false})
  const [ itemsMarkedForDeletion, setItemsMarkedForDeletion ] = useState<number[]>([])
  const [ categorySpecificItems, setCategorySpecificItems ] = useState<ParsedItemData[]>([])
  const [ filteredCategorySpecificItems, setFilteredCategorySpecificItems ] = useState<ParsedItemData[]>([])

  useEffect(() => {
    const fetchData = async() => {
      const allItems:RawItemData[] = await db.getAllAsync('SELECT * FROM item')
      const parsedItems: ParsedItemData[] = allItems.map((item) => {
        return {id:(item['id']),value:JSON.parse(item.value)}
      })
      setStoredItems(parsedItems)
    }
    fetchData()
  },[])

  useEffect(() => {
    const categories: string[] = Array.from(new Set(allStoredItems.map(item => {
      if(item.value.category === 'New Category' && typeof(item.value.newCategory) === 'string') return item.value.newCategory
      return item.value.category
    })))
    categories.sort((a,b) => a.localeCompare(b))
    setStoredCategories([...categories])
    if(allStoredItems.length > 1 && selectedCategory === null ) setSelectedCategory(categories[0])
    const numItemsByCateogry = allStoredItems.filter(item => item.value.category === selectedCategory).length
    if(numItemsByCateogry === 0 && storedCategories !== null && selectedCategory !== null) {
      const indexOfCurrentCategory = storedCategories.indexOf(selectedCategory)
      const lengthOfStoredCategories = storedCategories.length
      if(indexOfCurrentCategory !== lengthOfStoredCategories-1) setSelectedCategory(storedCategories[indexOfCurrentCategory+1])
      else setSelectedCategory(storedCategories[0])
    }

    // console.log('All stored items:', allStoredItems)
  }, [allStoredItems])

  const barHeight = useBottomTabBarHeight()

  const showModal = () => {
    setVisible(prev => {return { status: !(prev.status) }})
  }

  const enableDelete = () => {
    setDeleteMode({status:true, category:`${selectedCategory}`})
  }

  const disableDelete = () => {
    setDeleteMode({status:false})
  }

  const handleDelete =  async() => {
    const placeHolders = itemsMarkedForDeletion.map(id => {return '?'}).join()

    try {
      await db.runAsync(`DELETE FROM item WHERE id IN (${placeHolders})`,itemsMarkedForDeletion)
      deleteStoredItems(itemsMarkedForDeletion)
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

  const handleConsoleLog = () => {
    const allItems = db.getAllSync('SELECT * FROM item_fts')
    console.log('All items in fts db', allItems)
  }

  const handleDeleteFTSData = () => {
    db.runSync('DELETE FROM item_fts')
  }

  return (
    <View className='flex-1 flex-col bg-primary-base max-w-screen' >
      <StatusBar barStyle='dark-content' />
      <AddItemModal visible={visible} setVisible={setVisible} storedCategories={storedCategories}/>
      <EditItemModal editModalVisible={editModalVisible} setEditModalVisible={setEditModalVisible} storedCategories={storedCategories}/>
      <View className='flex-0 flex-row justify-between m-4'>
        <Pressable className='bg-primary-action-base max-w-max min-w-12 min-h-12 p-2.5 rounded-xl flex flex-row items-center' onPress={showModal}>
          <Text className='text-text '>Add Item</Text>
        </Pressable>
        <Pressable className='max-w-max bg-secondary-action-base rounded-xl min-w-12 min-h-12 p-2.5 flex flex-row items-center '>
          <Text className='text-white '>Search All</Text>
        </Pressable>
        <Pressable onPress={handleConsoleLog}>
          <Text>Console Log All</Text>
        </Pressable>
        <Pressable onPress={handleDeleteFTSData}>
          <Text>Delete All FTS data</Text>
        </Pressable>
      </View>
      <ScrollView horizontal={true} className='flex-grow-0 flex-row p-2 gap-4 border-2 border-secondary-action-active mx-1 rounded-lg '>
        { storedCategories.map( (category, index) => {
          return(
            <Pressable key={ index } className={`min-w-12 min-h-[44] rounded-xl ${category == selectedCategory? 'bg-accent drop-shadow-xl':'bg-tertiary-action-base'} flex-0 flex-row h-max items-center px-2 mr-2`} onPress={()=>setSelectedCategory(category)}>
              <Text className='m-1'>{ category }</Text>
            </Pressable> 
          )
        })}
      </ScrollView>
      <View className='flex flex-row justify-between'>
        <CategorySearch defaultValue='Search Category' categorySpecificItems={categorySpecificItems} setCategorySpecificItems={setCategorySpecificItems} filteredCategorySpecificItems={filteredCategorySpecificItems} setFilteredCategorySpecificItems={setFilteredCategorySpecificItems}/>
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
        </View>
        </View>
      <View style={{paddingBottom:barHeight+30}} className={`flex-1 flex-col`}>
        <CategoryItems selectedCategory={selectedCategory} classname='flex-col' editModalVisible={editModalVisible} setEditModalVisible={setEditModalVisible} deleteMode={deleteMode} setItemsMarkedForDeletion={setItemsMarkedForDeletion} itemsMarkedForDeletion={itemsMarkedForDeletion} categorySpecificItems={categorySpecificItems} setCategorySpecificItems={setCategorySpecificItems} filteredCategorySpecificItems={filteredCategorySpecificItems} setFilteredCategorySpecificItems={setFilteredCategorySpecificItems}/>
      </View>
    </View>
  )
}