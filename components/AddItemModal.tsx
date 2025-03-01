import { View, Text, Modal, Pressable, ScrollView, Button, LayoutChangeEvent } from 'react-native'
import React, { useEffect, useState } from 'react'
import RequiredInput from './RequiredInput'
import AddAdditionalInput from './AddAdditionalInput'
import AdditionalInput from './AdditionalInput'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { Picker } from '@react-native-picker/picker'
import DropdownInput from './DropdownInput'
import { useSQLiteContext } from 'expo-sqlite'
import { ParsedItemData, RawItemData } from '@/sharedTypes/ItemType'
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
import useItemStore from '@/stores/useItemStore'

type Props = {
  visible:{
    status: boolean
  };
  setVisible: React.Dispatch<React.SetStateAction<{ status: boolean }>>;
  // setSavedItems: React.Dispatch<React.SetStateAction<ParsedItemData[]>>;
  storedCategories: string[]
  // setSuccessfulSubmission: boolean
}

interface FormData {
  name:string;
  category:string;
  amount:string;
  [key: string] : string
}

interface DataFormatted {
  name: string;
  amount: string;
  category: string;
  [key:string]: string 
}

export default function AddItemModal({ visible, setVisible, storedCategories }:Props) {

  const { addItems } = useItemStore()

  const requiredInputNames = [ 'name','category','amount' ]

  const { control, handleSubmit, reset,watch, formState:{ errors, touchedFields } } = useForm<FormData>()
  const inputValues = watch()

  const db = useSQLiteContext()

  const [ calculatedWidth, setCalculatedWidth ] = useState<number|undefined>(undefined)
  const [ additionalDetails, setAdditionalDetails ] = useState<string[]>([])
  // const [ newDetail, setNewDetail ] = useState('')
  const [ newDetailName, setNewDetailName ] = useState('')
  // const [ requiredFieldState, setRequiredFieldState ] = useState<{allTouched: boolean, anyEmptyRequiredFields:boolean}>({allTouched:false, anyEmptyRequiredFields:true})
  // const [ allTouched, setAllTouched ] = useState<boolean>(false)
  const [ requiredFieldsEmpty, setRequiredFieldsEmpty ] = useState<boolean>(true)
  // const [selectedLanguage, setSelectedLanguage] = useState();

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
    db.withExclusiveTransactionAsync( async(txn) => {
      // await txn.runAsync('INSERT INTO item(value) VALUES (?) RETURNING *',JSON.stringify(dataFormatted))
      const returnData = await txn.runAsync('INSERT INTO item(value) VALUES(?) RETURNING *',JSON.stringify(formattedData))
      const lastInsertId = returnData.lastInsertRowId
      const getLastInsertedRowIdData: RawItemData[] = await txn.getAllAsync('SELECT * FROM item WHERE id = ?;',[lastInsertId])
      const { id, value } = getLastInsertedRowIdData[0]
      const parsedData: ParsedItemData = {id, value:JSON.parse(value)}
      console.log('Parsed Data:', parsedData)
      await txn.runAsync('INSERT INTO item_fts (name, item_id) VALUES (?,?)', name, id) 
      addItems(parsedData)
      // setSavedItems((prevArray):ParsedItemData[] => {
      //   const addLastInsertedRow: ParsedItemData[] = [...prevArray, parsedData]
      //   return addLastInsertedRow
      // })
    })
  }

  const onSubmit: SubmitHandler<FormData> = async(data) => {
    const generatedId = nanoid(10)
    const { name, category, amount, newCategory, ...rest } = data
    console.log('Category + New Category: ', category, '+', newCategory)
    const dataFormatted:DataFormatted = {name, amount,category:'', uid:generatedId, ...rest}
    if(newCategory){
      dataFormatted['category'] = newCategory
    }else{
      dataFormatted['category'] = category
    }
    console.log('Formatted Data:', dataFormatted)
    try{
      await insertNewItem(dataFormatted, name)
    }catch(e){
      console.log('Error inserting data:', e)
    }
    reset()
  }

  const calculateWidth = ( event: LayoutChangeEvent ) => {
    const { width } = event.nativeEvent.layout
    setCalculatedWidth(Math.ceil(width))
    return
  }
  
  useEffect(() => {
    const areRequiredFieldsEmpty = requiredInputNames.some(field => inputValues[field] === undefined || inputValues[field].trim() === '' || (inputValues['category'] === 'New Category' && inputValues['newCategory'] === '') || (inputValues['category'] === 'New Category' && inputValues['newCategory'] === undefined))
    setRequiredFieldsEmpty(areRequiredFieldsEmpty)
  },[inputValues])

  return (
    <Modal visible={ visible.status } onRequestClose={() => {
      setVisible({status:false})
      reset()
      }  
    }>
      <View className='flex-row justify-center pt-10'>
        <Text className='text-2xl '>Add New Item</Text>   
      </View>
      <ScrollView className='flex-1 flex-col bg-primary-light-base font-bold mb-4'>
        <View className='flex flex-col p-3'>
          <Controller
            name='name'
            control={control}
            rules={{
              required: true,
            }}
            render={( { field:{ onChange, onBlur, value }} ) => (
              <RequiredInput label='Name' placeholderText='Milk, Eggs, Paper Towels' allowableWidth={calculatedWidth} onChange={onChange} onBlur={onBlur} value={value} />
            ) }
          />
          { touchedFields.name && (inputValues['name'] === '' || inputValues['name'] === undefined) && <Text>Name is a required field.</Text> }
          <Controller
            name='category'
            control={control}
            rules={{
              required: true
            }}
            render={ ({field:{ value, onChange }}) => (
              <DropdownInput styles='' value={value} onChange={onChange} setCalculatedWidth={setCalculatedWidth} storedCategories={storedCategories} />
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
            />}
          { (inputValues['category'] === 'New Category' && touchedFields.newCategory && (inputValues['newCategory']) === '' || (inputValues['category'] === 'New Category' && touchedFields.newCategory && inputValues['newCategory'] === undefined)) && <Text>Category is a required field.</Text> }
          <Controller
            name='amount'
            control={control}
            rules={{
              required: true
            }}
            render={( { field:{ onChange, onBlur, value }} ) => (
              <RequiredInput label='Amount' placeholderText='100%, 3/4, Almost empty, 12oz.' allowableWidth={calculatedWidth} onChange={onChange} onBlur={onBlur} value={value} />
            ) }
          />
          { touchedFields.amount && (inputValues['amount'] === '' || inputValues['amount'] === undefined) && <Text>Amount is a required field.</Text> }
          <Text className='text-xl mt-5 mb-4'>Additional Details</Text>
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
        </View>
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