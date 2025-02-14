import { View, Text, Modal, ScrollView, Pressable } from 'react-native'
import React, { SetStateAction, useEffect, useState } from 'react'
import RequiredInput from './RequiredInput';
import DropdownInput from './DropdownInput';
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import AdditionalInput from './AdditionalInput'
import AddAdditionalInput from './AddAdditionalInput';
import { ParsedItemData } from '@/sharedTypes/ItemType';

interface EditItemModalProps{
  editModalVisible: { status:boolean; item?: ParsedItemData };
  setEditModalVisible: React.Dispatch<SetStateAction<{status: boolean, item?: ParsedItemData}>>;
  storedCategories: string[];
  // parsedItemData: ParsedItemData
}

interface FormData {
  name:string;
  category:string;
  amount:string;
  [key: string] : string
}

export default function EditItemModal({ editModalVisible, setEditModalVisible, storedCategories }: EditItemModalProps) {

  const requiredInputNames = [ 'name','category','amount' ]


  const { control, handleSubmit, reset, watch, formState:{ errors, touchedFields } } = useForm<FormData>()
  const [ additionalDetails, setAdditionalDetails ] = useState<string[]>([])
  const [ newDetailName, setNewDetailName ] = useState('')
  const [ calculatedWidth, setCalculatedWidth ] = useState<number|undefined>(undefined)
  const [ requiredFieldsEmpty, setRequiredFieldsEmpty ] = useState<boolean>(true)
  
  
  const inputValues = watch()

  const handleAddingNewField = () => {
    if(newDetailName === '') return
    setAdditionalDetails(prevArr => [ ...prevArr, newDetailName ])
    setNewDetailName('')
  }

  
  useEffect(() => {
    const areRequiredFieldsEmpty = requiredInputNames.some(field => inputValues[field] === undefined || inputValues[field].trim() === '' || (inputValues['category'] === 'New Category' && inputValues['newCategory'] === '') || (inputValues['category'] === 'New Category' && inputValues['newCategory'] === undefined))
    setRequiredFieldsEmpty(areRequiredFieldsEmpty)
  },[inputValues])

  useEffect(()=>{
    if(editModalVisible.item){
      console.log('Item passed in:', editModalVisible.item)
      reset(editModalVisible.item.value)
    }
  },[editModalVisible])
  
  const handleNewDetailRemoval = (detailString:string) => {
    setAdditionalDetails( prevArr => {
      const copy = [...prevArr]
      const test = copy.filter( detail => JSON.stringify(detail) !== JSON.stringify(detailString) )
      return test
    })
  }

  const onSubmit: SubmitHandler<FormData> = async(data) => {
    console.log('Data being submitted:', data)
    try{
    }catch(e){
      console.log('Error inserting data:', e)
    }
    reset()
  }

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
            Add
          </Text>
        </Pressable>
        <Pressable className='items-center rounded-xl min-w-[100px] border-2' onPress={() => {
            setEditModalVisible({status:false})
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