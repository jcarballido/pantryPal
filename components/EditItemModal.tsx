import { View, Text, Modal, ScrollView, Pressable } from 'react-native'
import React, { SetStateAction, useEffect, useState } from 'react'
import RequiredInput from './RequiredInput';
import DropdownInput from './DropdownInput';
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import AdditionalInput from './AdditionalInput'
import AddAdditionalInput from './AddAdditionalInput';
import { ItemData, ParsedItemData } from '@/sharedTypes/ItemType';
import { useSQLiteContext } from 'expo-sqlite';
import useItemStore from '@/stores/useItemStore';

interface EditItemModalProps{
  editModalVisible: { status:boolean; item?: ParsedItemData };
  setEditModalVisible: React.Dispatch<SetStateAction<{status: boolean, item?: ParsedItemData}>>;
  storedCategories: string[];
  // setSavedItems: React.Dispatch<SetStateAction<ParsedItemData[]>>
  // parsedItemData: ParsedItemData
}

interface DetailsInterface{
  [key:string]:string
}

interface FormData {
  name:string;
  category:string;
  amount:string;
  details: DetailsInterface ;
  newCategory?:string;
  uid:string;
  id:string;
}

// interface DataFormatted {
//   name: string;
//   amount: string;
//   category: string;
//   [key:string]: string 
// }

export default function EditItemModal({ editModalVisible, setEditModalVisible, storedCategories }: EditItemModalProps) {

  const { updateStoredItems } = useItemStore()

  const requiredInputNames:(keyof FormData)[] = [ 'name','category','amount' ]
  const db = useSQLiteContext()

  const { control, handleSubmit, reset, watch, formState:{ errors, touchedFields } } = useForm<FormData>()
  const [ additionalDetails, setAdditionalDetails ] = useState<string[]>([])
  const [ newDetailName, setNewDetailName ] = useState('')
  const [ calculatedWidth, setCalculatedWidth ] = useState<number|undefined>(undefined)
  const [ requiredFieldsEmpty, setRequiredFieldsEmpty ] = useState<boolean>(true)
  
  
  const inputValues = watch()
  // console.log('Input values:', inputValues)

  const handleAddingNewField = () => {
    if(newDetailName === '') return
    setAdditionalDetails(prevArr => {
      console.log('Prev arr:', prevArr )
      return [ ...prevArr, newDetailName ]})
    setNewDetailName('')
  }

  

  
  useEffect(() => {
    const areRequiredFieldsEmpty = requiredInputNames.some(field => inputValues[field] === undefined || inputValues['amount'].trim() === '' || (inputValues['category'] === 'New Category' && inputValues['newCategory'] === '') || (inputValues['category'] === 'New Category' && inputValues['newCategory'] === undefined))
    setRequiredFieldsEmpty(areRequiredFieldsEmpty)
  },[inputValues])

  useEffect(()=>{
    if(editModalVisible.item){
      // console.log('Item passed in:', editModalVisible.item)
      const { name, category, amount, uid, details } = editModalVisible.item
      const detailNames = Object.keys(details)      
      reset(editModalVisible.item)
      setAdditionalDetails([...detailNames])
    }
  },[editModalVisible.item])

  useEffect(()=>{
    if(editModalVisible.item){
      // reset(editModalVisible.item)
    }
  },[])
  
  const handleNewDetailRemoval = (detailString:string) => {
    setAdditionalDetails( prevArr => {
      const copy = [...prevArr]

      const test = copy.filter( detail => {
        // console.log('Detail:', detail)
        // console.log('Detial String:', detailString)
        return JSON.stringify(detail) !== JSON.stringify(detailString) 
      })
      // console.log('New detail removal result:', test)
      return test
    })
  }

  const updateData = async(formattedData:ItemData, name:string) => {
    // console.log('Data to save to db:', formattedData)
    const {name:itemName,amount,category,uid,details,id} = formattedData
    await db.withExclusiveTransactionAsync(async(txn) => {
      await txn.runAsync('UPDATE item SET amount = ?,category = ?, name = ?, uid = ?, details = ? WHERE id = ?',[amount,category,itemName,uid,JSON.stringify(details), JSON.stringify(editModalVisible.item?.id)])
      await txn.runAsync('UPDATE item_fts SET name = ? WHERE item_id = ?', [ name, `${editModalVisible.item?.id}` ])
    })
    if(editModalVisible.item) updateStoredItems({name,amount,category,uid,details, id})
    // updateStoredItems({id:JSON.stringify(editModalVisible.item?.id),value:formattedData})
    // setSavedItems(prev => {
    //   const updatedItemsArray = prev.map( item => {
    //     if(item.id === editModalVisible.item?.id){
    //       return { id: item.id, value: JSON.parse(JSON.stringify(formattedData)) }
    //     } else {return item}
    //   })
    //   return updatedItemsArray
    // })
    setEditModalVisible({ status: false })
  }

  const onSubmit: SubmitHandler<FormData> = async(data) => {
    const { name, category, amount, newCategory, uid, details,id } = data
    // console.log('Category + New Category: ', category, '+', newCategory)
    const detailObj:{[key:string]:string} = {}  
    const newDetails = additionalDetails.map(detailString => {
      detailObj[detailString] = details[detailString]
    })
    const dataFormatted:ItemData = {name, amount,category:'', uid , details:detailObj,id}
    if(newCategory){
      dataFormatted['category'] = newCategory
    }else{
      dataFormatted['category'] = category
    }
    console.log('Formatted Data:', dataFormatted)
    try{
      await updateData(dataFormatted, name)
    }catch(e){
      console.log('Error inserting data:', e)
    }
  }

  // console.log('Additional Details:', additionalDetails)

  return (
    <Modal visible={ editModalVisible.status } onRequestClose={() => {
      setEditModalVisible({status:false})
      reset()
      }  
    }>
      <Text>EditItemModal</Text>
      <ScrollView className='flex-1 flex-col bg-primary-light-base font-bold mb-4'>
        <View className='flex flex-col p-3'>
          <Controller 
            control={control}
            name='name'
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
                <RequiredInput label='New Category' allowableWidth={calculatedWidth} placeholderText='Category A, Fridge, Left Cabinet Above Sink' onChange={onChange} onBlur={onBlur} value={value || ''} />
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
            additionalDetails.map( (detail, index) => {
              return(
                <Controller
                  key={detail}
                  name={`details.${detail}`}
                  control={control}
                  render={( { field:{ onChange, onBlur, value }} ) => (
                    <AdditionalInput detail={detail} handleNewDetailRemoval={handleNewDetailRemoval} allowableWidth={calculatedWidth} onChange={onChange} onBlur={onBlur} value={value} />
                  )}
                />)
            })
          }
          <AddAdditionalInput allowableWidth={calculatedWidth} numberAddedDetails={additionalDetails.length} handleAddingNewField={handleAddingNewField} newDetailName={newDetailName} setNewDetailName={setNewDetailName} />
        </View>
      </ScrollView>
      <View className='py-10 flex-row justify-around'>
        <Pressable className='items-center bg-green-400 rounded-lg min-w-[100px] disabled:bg-gray-500 disabled:text-white' onPress={handleSubmit(onSubmit)} disabled={ requiredFieldsEmpty  }>
          <Text className='text-base px-6 py-3 '>
            Confirm
          </Text>
        </Pressable>
        <Pressable className='items-center rounded-xl min-w-[100px] border-2' onPress={() => {
            setEditModalVisible({status:false})
            reset()
          }
        }>
          <Text className='px-6 py-3' onPress={()=> setEditModalVisible({status:false})}>
            Cancel
          </Text>
        </Pressable>
      </View>
    </Modal>
  )
}