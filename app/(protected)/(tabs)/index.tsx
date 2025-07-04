import { View, Text, Pressable, ScrollView, StatusBar, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import CategoryItems from '@/components/CategoryItems'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import CategorySearch from '@/components/CategorySearch'
import { ParsedRecordStoredItem, DbRecordStoredItem } from '@/sharedTypes/ItemType'
import AddItemModal from '@/components/AddItemModal'
import { useSQLiteContext } from 'expo-sqlite'
import EditItemModal from '@/components/EditItemModal'
import useItemStore from '@/stores/useItemStore'
import { Redirect } from 'expo-router'
import * as WebBrowser from "expo-web-browser";
import useAuthStore from '@/stores/useAuthStore'
import { supabase } from '@/utilities/supabase'

WebBrowser.maybeCompleteAuthSession(); // required for web only

export default function index() {

  const {sessionData, user, setSession, setUser, clearSession, clearUser} = useAuthStore() 

  console.log('Landed on index')
  console.log('Session data in  index: ', sessionData)
  console.log('User in index ', user)
  const loggedIn = false

  
  const { allStoredItems, setStoredItems, deleteStoredItems,savedCategories, setSavedCategories, setReservedCategories } = useItemStore()
  
  const db = useSQLiteContext()
  const [ visible, setVisible ] = useState({ status: false }) 
  const [ editModalVisible, setEditModalVisible ] = useState({ status: false }) 
  const [ storedCategories, setStoredCategories ] = useState<string[]>([])
  const [ selectedCategory, setSelectedCategory ] = useState< string|null >(null)
  const [ deleteMode, setDeleteMode ] = useState<{status:boolean, category?:string}>({status:false})
  const [ itemsMarkedForDeletion, setItemsMarkedForDeletion ] = useState<number[]>([])
  const [ categorySpecificItems, setCategorySpecificItems ] = useState<ParsedRecordStoredItem[]>([])
  const [ filteredCategorySpecificItems, setFilteredCategorySpecificItems ] = useState<ParsedRecordStoredItem[]>([])
  
  if(!user){
    console.log('loggedIn = false, being routed to sign up page')
    return <Redirect href='/(auth)/signUp' />
  }
  useEffect(() => {
    const fetchData = async() => {
      const allItems:DbRecordStoredItem[] = await db.getAllAsync('SELECT * FROM item')
      const allCategories:{id:string, name:string}[] = await db.getAllAsync('SELECT * FROM category')
      // console.log('All items stored:', allItems)
      const parsedItems: ParsedRecordStoredItem[] = allItems.map((item) => {
        return {id:(item['id']),uid:item.uid,name:item.name, category:item.category, amount:item.amount,details:JSON.parse(item.details)}
      })
      setSavedCategories(allCategories)
      setStoredItems(parsedItems)
    }
    fetchData()
  },[])

  useEffect(() => {
    const categories: string[] = Array.from(new Set(allStoredItems.map(item => {
      return item.category
    })))
    categories.sort((a,b) => a.localeCompare(b))
    setStoredCategories([...categories])
    if(allStoredItems.length > 1 && selectedCategory === null ) setSelectedCategory(categories[0])
    const numItemsByCateogry = allStoredItems.filter(item => item.category === selectedCategory).length
    if(numItemsByCateogry === 0 && storedCategories !== null && selectedCategory !== null) {
      const indexOfCurrentCategory = storedCategories.indexOf(selectedCategory)
      const lengthOfStoredCategories = storedCategories.length
      if(indexOfCurrentCategory !== lengthOfStoredCategories-1) setSelectedCategory(storedCategories[indexOfCurrentCategory+1])
      else setSelectedCategory(storedCategories[0])
    }
    setReservedCategories(categories)
  }, [allStoredItems, ])

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

  const handleConsoleLog = async() => {
    // const allItems = db.getAllSync('SELECT * FROM item')
    // const allShoppingItems = db.getAllSync('SELECT * FROM shopping_list_item')    
    // console.log('All items in stored item db', allItems)
    // console.log('All items in stored shopping list db', allShoppingItems)
    const tables2:{name:string}[] = await db.getAllAsync("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ;")  
    console.log('All tables:', tables2)
    // tables2.forEach( table =>{
    //   console.log('All tables:',tables2)
    // } )
  }

  const handleSignOut = async () => {

      console.log('Signing Out...')
      const {error} = await supabase.auth.signOut()
      if(error) console.log('Error signing out:', error)
      clearSession()
      clearUser()
      console.log('SUccessfully signed out.')
      return
  }

  const handleDeleteFTSData = () => {
    db.runSync('DELETE FROM item_fts')
  }

  const getAllDbTables = async () => {
    console.log('Select All tables button pressed')
    try {
      console.log('Getting initial tables')
      const tables2:{name:string}[] = await db.getAllAsync("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ;")  
      console.log('Attempting to drop...')
      tables2.forEach( table =>{
        console.log('Table being dropped:', table)
        db.runSync(`DROP TABLE IF EXISTS ${table.name};`)
      } )
      console.log('Tables dropped...')
      console.log('Attempting to get all tables again...')

      const tables3:{name:string}[] = await db.getAllAsync("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ;")  
      console.log("All tables recieved:", tables3)
      tables3.forEach( table =>{
        console.log('Table:',table)
      } )
    } catch (error) {
      console.log('Error attempting to get or drop:', error)      
    }
  } 

  const resetSchema = async() => {
  await db.execAsync(`PRAGMA user_version = 0`)
  const userVersion = await db.getFirstAsync<{user_version: number}>('PRAGMA user_version')
  console.log('User version after reset: ', userVersion)
  }

  return (
    <View className='flex-1 flex-col bg-primary-base max-w-screen' >
      <StatusBar barStyle='dark-content' />
      <AddItemModal visible={visible} setVisible={setVisible} savedCategories={savedCategories}/>
      <EditItemModal editModalVisible={editModalVisible} setEditModalVisible={setEditModalVisible} savedCategories={savedCategories}/>
      <View className='flex-0 flex-row justify-between m-4'>
        <Pressable className='bg-primary-action-base max-w-max min-w-12 min-h-12 p-2.5 rounded-xl flex flex-row items-center' onPress={showModal}>
          <Text className='text-text '>Add Item</Text>
        </Pressable>
        <Pressable className='max-w-max bg-secondary-action-base rounded-xl min-w-12 min-h-12 p-2.5 flex flex-row items-center '>
          <Text className='text-white '>Search All</Text>
        </Pressable>
        <Pressable onPress={handleSignOut}>
          <Text>Sign Out</Text>
        </Pressable>
        {/* <Pressable onPress={handleConsoleLog}>
          <Text>Console Log All</Text>
        </Pressable> */}
        {/* <Pressable onPress={handleDeleteFTSData}>
          <Text>Delete All FTS data</Text>
        </Pressable> */}
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
      <Pressable onPress={getAllDbTables}><Text>Select All tables</Text></Pressable>
      <Pressable onPress={resetSchema}><Text>Reset Schema to 0</Text></Pressable>

      <View style={{paddingBottom:barHeight+30}} className={`flex-1 flex-col`}>
        <CategoryItems selectedCategory={selectedCategory} classname='flex-col' editModalVisible={editModalVisible} setEditModalVisible={setEditModalVisible} deleteMode={deleteMode} setItemsMarkedForDeletion={setItemsMarkedForDeletion} itemsMarkedForDeletion={itemsMarkedForDeletion} categorySpecificItems={categorySpecificItems} setCategorySpecificItems={setCategorySpecificItems} filteredCategorySpecificItems={filteredCategorySpecificItems} setFilteredCategorySpecificItems={setFilteredCategorySpecificItems}/>
      </View>
    </View>
  )
}