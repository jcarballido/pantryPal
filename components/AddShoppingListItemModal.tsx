import { View, Text, Modal, ScrollView, Pressable } from 'react-native'
import React, { SetStateAction, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import RequiredInput from './RequiredInput';
import AddAdditionalInput from '@/components/AddAdditionalInput'
import AdditionalInput from './AdditionalInput';
import { useSQLiteContext } from 'expo-sqlite';
import { ParsedItemData, ParsedNeededItemData, RawItemData } from '@/sharedTypes/ItemType';
import useItemStore from '@/stores/useItemStore';

interface Props{
  visible: {status: boolean};
  setVisible: React.Dispatch<SetStateAction<{status:boolean}>>
}
interface FormData{
  name: string;
  quantity: string;
  [key:string]: string;
}
interface DataFormatted {
  name: string;
  quantity: string;
  [key:string]: string 
}


export default function  AddShoppingListItemModal({visible, setVisible}: Props) {
 
  const requiredInputNames = ['name','quantity']
  
  const { control, handleSubmit, reset, watch } = useForm<FormData>()
  const inputValues = watch()
  const [ additionalDetails, setAdditionalDetails ] = useState<string[]>([])
  const [ newDetailName, setNewDetailName ] = useState('')
  const [ calculatedWidth, setCalculatedWidth ] = useState<number|undefined>(undefined)
  const [ requiredFieldsEmpty, setRequiredFieldsEmpty ] = useState<boolean>(true)
  const db = useSQLiteContext()  
  const { addToShoppingList } = useItemStore()  

  useEffect(() => {
    const areRequiredFieldsEmpty = requiredInputNames.some(field => inputValues[field] === undefined || inputValues[field].trim() === '' || (inputValues['category'] === 'New Category' && inputValues['newCategory'] === '') || (inputValues['category'] === 'New Category' && inputValues['newCategory'] === undefined))
    setRequiredFieldsEmpty(areRequiredFieldsEmpty)
  },[inputValues])


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

  const insertNewItem = async(formattedData:{[key:string]:string},name:string) => {
    await db.withExclusiveTransactionAsync( async(txn) => {
      // await txn.runAsync('INSERT INTO item(value) VALUES (?) RETURNING *',JSON.stringify(dataFormatted))
      const returnData = await txn.runAsync('INSERT INTO shopping_list_item(value) VALUES(?) RETURNING *',JSON.stringify(formattedData))
      const lastInsertId = returnData.lastInsertRowId
      const getLastInsertedRowIdData: RawItemData[] = await txn.getAllAsync('SELECT * FROM shopping_list_item WHERE id = ?;',[lastInsertId])
      const { id, value } = getLastInsertedRowIdData[0]
      const parsedData: ParsedNeededItemData = {id, value:JSON.parse(value)}
      console.log('Parsed Data:', parsedData)
      await txn.runAsync('INSERT INTO item_fts (name, item_id) VALUES (?,?)', name, id) 
      addToShoppingList(parsedData)
      // setSavedItems((prevArray):ParsedItemData[] => {
      //   const addLastInsertedRow: ParsedItemData[] = [...prevArray, parsedData]
      //   return addLastInsertedRow
      // })
    })
  }


  const onSubmit: SubmitHandler<FormData> = async(data) => {
    const { name, quantity, ...rest } = data
    const dataFormatted:DataFormatted = {name, quantity, ...rest}
    console.log('Formatted Data:', dataFormatted)
    try{
      await insertNewItem(dataFormatted, name)
    }catch(e){
      console.log('Error inserting data:', e)
    }
    reset()
  }



  return (
    <Modal visible={visible.status} onRequestClose={()=>setVisible({status:false})}>
      <ScrollView>
        <Controller 
          name='name'
          control={control}
          render={({field: { onChange, onBlur,value }}) => (<RequiredInput label='Name' placeholderText='Name' onChange={onChange} onBlur={onBlur} value={value}  />) }
        />
        <Controller 
          name='quantity'
          control={control}
          render={({field: { onChange, onBlur,value }}) => (<RequiredInput label='Quantity' placeholderText='Quantity' onChange={onChange} onBlur={onBlur} value={value}  />) }
        />
        {
          additionalDetails.map( detail => {
            return(
              <Controller
              name={`${detail}`}
              control={control}
              render={( { field:{ onChange, onBlur, value }} ) => (
                <AdditionalInput detail={detail} handleNewDetailRemoval={handleNewDetailRemoval} allowableWidth={calculatedWidth} onChange={onChange} onBlur={onBlur} value={value} />
              ) }
            />
            )
          })
        }
        <AddAdditionalInput allowableWidth={calculatedWidth} numberAddedDetails={additionalDetails.length} handleAddingNewField={handleAddingNewField} newDetailName={newDetailName} setNewDetailName={setNewDetailName} />
      </ScrollView>
      <View className='py-10 flex-row justify-around'>
        <Pressable className='items-center bg-green-400 rounded-lg min-w-[100px] disabled:bg-gray-500 disabled:text-white' onPress={handleSubmit(onSubmit)} disabled={ requiredFieldsEmpty  }>
          <Text className='text-base px-6 py-3 '>
            Add
          </Text>
        </Pressable>
        <Pressable className='items-center rounded-xl min-w-[100px] border-2' onPress={() => {
            setVisible({status:false})
            reset()
          }
        }>
          <Text className='px-6 py-3'>
            Close
          </Text>
        </Pressable>
      </View>
    </Modal>
  )
}