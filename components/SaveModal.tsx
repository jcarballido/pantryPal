import { View, Text, Modal, ScrollView, FlatList } from 'react-native'
import React, { SetStateAction, useEffect, useState } from 'react'
import useItemStore from '@/stores/useItemStore';
import { useSQLiteContext } from 'expo-sqlite';
import { Controller, useForm } from 'react-hook-form';
import { ParsedNeededItemData } from '@/sharedTypes/ItemType';

interface Props{
  saveModalVisible: {status: boolean};
  setSaveModalVisible: React.Dispatch<SetStateAction<{status: boolean}>>;
  itemsMarkedForSaving: ParsedNeededItemData[]
}

interface FormData {
  name:string;
  amount:string;
  [key: string] : string
}


const SaveModal = ({saveModalVisible, setSaveModalVisible, itemsMarkedForSaving}: Props) => {

  const requiredInputNames = ['name', 'quantity']
  const { addItems } = useItemStore()
  const db = useSQLiteContext()
  const { control, handleSubmit, reset,watch, formState:{ errors, touchedFields } } = useForm<FormData>()
  const inputValues = watch()
  
  const [ additionalDetails, setAdditionalDetails ] = useState<string[]>([])
  const [ newDetailName, setNewDetailName ] = useState('')
  const [ requiredFieldsEmpty, setRequiredFieldsEmpty ] = useState<boolean>(true)
  
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

  useEffect(() => {
    const areRequiredFieldsEmpty = requiredInputNames.some(field => inputValues[field] === undefined || inputValues[field].trim() === '' || (inputValues['category'] === 'New Category' && inputValues['newCategory'] === '') || (inputValues['category'] === 'New Category' && inputValues['newCategory'] === undefined))
    setRequiredFieldsEmpty(areRequiredFieldsEmpty)
  },[inputValues])

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
      <FlatList
        data={itemsMarkedForSaving}
        renderItem={({item}) => {
          return(
            <View>
              {item.name}
            </View>
          )
        }}
      />
    </Modal>
  )
}

export default SaveModal