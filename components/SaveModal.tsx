import { View, Text, Modal, ScrollView, FlatList, TextInput, Pressable } from 'react-native'
import React, { SetStateAction, useEffect, useState } from 'react'
import useItemStore from '@/stores/useItemStore';
import { useSQLiteContext } from 'expo-sqlite';
import { Controller, useForm } from 'react-hook-form';
import { ParsedNeededItemData } from '@/sharedTypes/ItemType';
import SaveModalInput from './SaveModalInput';
import DropdownInput from './DropdownInput';
import RequiredInput from './RequiredInput';

interface Props{
  saveModalVisible: {status: boolean};
  setSaveModalVisible: React.Dispatch<SetStateAction<{status: boolean}>>;
  itemsMarkedForSaving: ParsedNeededItemData[]
}

interface FormData {
  category:string;
  [key: string] : string
}

const SaveModal = ({saveModalVisible, setSaveModalVisible, itemsMarkedForSaving}: Props) => {

  const { addItems, savedCategories, setSavedCategories, allStoredItems } = useItemStore()
  const db = useSQLiteContext()
  const { control, handleSubmit, reset,watch, formState:{ errors, touchedFields } } = useForm<FormData>()
  const inputValues = watch()
  
  const [ additionalDetails, setAdditionalDetails ] = useState<string[]>([])
  const [ newDetailName, setNewDetailName ] = useState('')
  const [ itemsPreparedForSaving, setItemsPreparedForSaving ] = useState<ParsedNeededItemData[]>([])
  const [ calculatedWidth, setCalculatedWidth ] = useState<number|undefined>(undefined)
  
  const handleAddingNewField = () => {
    if(newDetailName === '') return
    setAdditionalDetails(prevArr => [ ...prevArr, newDetailName ])
    setNewDetailName('')
  }

  const handleNewDetailRemoval = (detailString:string) => {
    setAdditionalDetails( prevArr => {
      const copy = [...prevArr]
      const test = copy.filter( detail => JSON.stringify(detail) !== JSON.stringify(detailString) )
      return test
    })
  }
   
  // useEffect(()=>{
  //   console.log('Items marked for saving:', itemsMarkedForSaving)
  // },[itemsMarkedForSaving])

  //START HERE...

  useEffect(()=>{
    const categories = allStoredItems.map(item => {
      return item.category
    })
    const uniqueCategories = [...new Set(categories)]
    setSavedCategories(uniqueCategories)
  },[])

  const consoleLogItemsToSave = () => {
    console.log('Items to be saved:', savedCategories)
  }

  const handlePress = () => {
    console.log('Items to store:', itemsPreparedForSaving)
    console.log('Category:', inputValues['category'])
    if(inputValues['newCategory']) console.log('New Category:', inputValues['newCategory'])
    
  }

  // const insertNewItem = async(formattedData:DataFormatted) => {
  //   await db.withExclusiveTransactionAsync( async(txn) => {
  //     // await txn.runAsync('INSERT INTO item(value) VALUES (?) RETURNING *',JSON.stringify(dataFormatted))
  //     const returnData = await txn.runAsync('INSERT INTO shopping_list_item(name, quantity,details) VALUES(?,?,?) RETURNING *',formattedData.name,formattedData.quantity,JSON.stringify(formattedData.details))
  //     const lastInsertId = returnData.lastInsertRowId
  //     const getLastInsertedRowIdData: RawShoppingListItemData[] = await txn.getAllAsync('SELECT * FROM shopping_list_item WHERE id = ?;',[lastInsertId])
  //     const { id, name, quantity, details } = getLastInsertedRowIdData[0]
  //     const parsedData: ParsedNeededItemData = {id,name,quantity, details:JSON.parse(details)}
  //     console.log('Parsed Data:', parsedData)
  //     await txn.runAsync('INSERT INTO item_fts (name, item_id) VALUES (?,?)', name, id) 
  //     addToShoppingList(parsedData)
  //     // setSavedItems((prevArray):ParsedItemData[] => {
  //     //   const addLastInsertedRow: ParsedItemData[] = [...prevArray, parsedData]
  //     //   return addLastInsertedRow
  //     // })
  //   })
  // }
  
  
  // const onSubmit: SubmitHandler<FormData> = async(data) => {
  //   const { name, quantity, details } = data
  //   const dataFormatted:DataFormatted = {name, quantity, details}
  //   console.log('Formatted Data:', dataFormatted)
  //   try{
  //     await insertNewItem(dataFormatted)
  //   }catch(e){
  //     console.log('Error inserting data:', e)
  //   }
  //   reset()
  // }

  // Show each item and data from shopping list to be added
  // Display which category to save item to

  return (
    <Modal visible={saveModalVisible.status} onRequestClose={()=>setSaveModalVisible({status: false})}>
      <Controller
        name='category'
        control={control}
        rules={{
          required: true
        }}
        render={ ({field:{ value, onChange }}) => (
          <DropdownInput styles='' value={value} setCalculatedWidth={setCalculatedWidth} onChange={onChange} storedCategories={savedCategories} />
        )}
      />
      { inputValues['category'] === 'New Category' && 
        <Controller
          name='newCategory'
          control={control}
          rules={{
            required: true
          }}
          render={( { field:{ onChange, onBlur, value }} ) => (
            <RequiredInput label='New Category' allowableWidth={calculatedWidth} placeholderText='Category A, Fridge, Left Cabinet Above Sink' onChange={onChange} onBlur={onBlur} value={value} />
          ) }
        />
      }
      <FlatList
        data={itemsMarkedForSaving}
        renderItem={({item}) => {
          return(
            <SaveModalInput item={item} setItemsPreparedForSaving={setItemsPreparedForSaving} />
          )
        }}
      />
      <View className='border-4 border-green-500'>
        <Pressable onPress={handlePress}>
          <Text>
            Log
          </Text>
        </Pressable>
      </View>
    </Modal>
  )
}

export default SaveModal