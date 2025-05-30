import { View, Text, Modal, ScrollView, Pressable } from 'react-native'
import React, { SetStateAction, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import RequiredInput from './RequiredInput';
import AddAdditionalInput from '@/components/AddAdditionalInput'
import AdditionalInput from './AdditionalInput';
import { useSQLiteContext } from 'expo-sqlite';
import {  ParsedRecordShoppingListItem, DbRecordShoppingListItem } from '@/sharedTypes/ItemType';
import useItemStore from '@/stores/useItemStore';

interface Props{
  visible: {status: boolean};
  setVisible: React.Dispatch<SetStateAction<{status:boolean}>>
}
interface FormData extends Pick<ParsedRecordShoppingListItem,'name'|'amount'|'details'>{}

// interface DataFormatted {
//   name: string;
//   amount: string;
//   details:{[key: string]: string} 
// }


export default function  AddShoppingListItemModal({visible, setVisible}: Props) {
 
  const requiredInputNames:('name'|'amount')[] = ['name','amount']
  
  const { control, handleSubmit, reset, watch } = useForm<FormData>()
  const inputValues = watch()
  const [ additionalDetails, setAdditionalDetails ] = useState<string[]>([])
  const [ newDetailName, setNewDetailName ] = useState('')
  const [ calculatedWidth, setCalculatedWidth ] = useState<number|undefined>(undefined)
  const [ requiredFieldsEmpty, setRequiredFieldsEmpty ] = useState<boolean>(true)
  const db = useSQLiteContext()  
  const { addToShoppingList } = useItemStore()  
  
  useEffect(() => {
    const areRequiredFieldsEmpty = requiredInputNames.some(field => inputValues[field] === undefined || inputValues[field].trim() === ''   )
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

  const insertNewItem = async(formattedData:FormData) => {
    await db.withExclusiveTransactionAsync( async(txn) => {
      // await txn.runAsync('INSERT INTO item(value) VALUES (?) RETURNING *',JSON.stringify(dataFormatted))
      const returnData = await txn.runAsync('INSERT INTO shopping_list_item(name, amount,details) VALUES(?,?,?) RETURNING *',formattedData.name,formattedData.amount,JSON.stringify(formattedData.details))
      const lastInsertId = returnData.lastInsertRowId
      const getLastInsertedRowIdData: DbRecordShoppingListItem[] = await txn.getAllAsync('SELECT * FROM shopping_list_item WHERE id = ?;',[lastInsertId])
      const { id, name, amount, details } = getLastInsertedRowIdData[0]
      const parsedData: ParsedRecordShoppingListItem = {id,name,amount, details:JSON.parse(details)}
      // console.log('Parsed Data:', parsedData)
      // await txn.runAsync('INSERT INTO item_fts (name, item_id) VALUES (?,?)', name, id) 
      addToShoppingList(parsedData)
      // setSavedItems((prevArray):ParsedItemData[] => {
      //   const addLastInsertedRow: ParsedItemData[] = [...prevArray, parsedData]
      //   return addLastInsertedRow
      // })
    })
  }


  const onSubmit: SubmitHandler<FormData> = async(data) => {
    const { name, amount, details } = data
    const dataFormatted = {name, amount, details}
    // console.log('Formatted Data:', dataFormatted)
    try{
      await insertNewItem(dataFormatted)
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
          name='amount'
          control={control}
          render={({field: { onChange, onBlur,value }}) => (<RequiredInput label='Quantity' placeholderText='Quantity' onChange={onChange} onBlur={onBlur} value={value}  />) }
        />
        {
          additionalDetails.map( detail => {
            return(
              <Controller
              key={`${detail}`}
              name={`details.${detail}`}
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