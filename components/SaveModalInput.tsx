import { View, Text, TextInput } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ParsedNeededItemData } from '@/sharedTypes/ItemType'
import AdditionalInput from './AdditionalInput'

interface Props{
  item: ParsedNeededItemData;
  setItemsPreparedForSaving: React.Dispatch<SetStateAction<ParsedNeededItemData[]>>;
}

interface FormData {
  id: string;
  name: string;
  quantity: string;
  details: {[key:string]:string}
}

const SaveModalInput = ({item, setItemsPreparedForSaving}:Props) => {

  const requiredInputNames:('name'|'quantity')[] = ['name', 'quantity']

  const { control, handleSubmit, reset,watch, formState:{ errors, touchedFields } } = useForm<FormData>()
  const [ requiredFieldsEmpty, setRequiredFieldsEmpty ] = useState<boolean>(true)
  const [ additionalDetails, setAdditionalDetails ] = useState<string[]>([])
  const [ calculatedWidth, setCalculatedWidth ] = useState<number|undefined>(undefined)
  
  const inputValues = watch()

  useEffect(() => {
    const areRequiredFieldsEmpty = requiredInputNames.some(field => inputValues[field] === undefined || inputValues[field].trim() === '')
    setRequiredFieldsEmpty(areRequiredFieldsEmpty)
  },[inputValues])
  
  useEffect(()=>{
    reset(item)
  },[])

  useEffect(()=>{
    if(item){
      // console.log('Item passed in:', editModalVisible.item)
      const { name, quantity, details } = item
      if(details){
        const detailNames = Object.keys(details)      
        setAdditionalDetails([...detailNames])
      }
      reset(item)
    }
  },[item])
  

  const handleNewDetailRemoval = (detailString:string) => {
    setAdditionalDetails( prevArr => {
      const copy = [...prevArr]
      const test = copy.filter( detail => JSON.stringify(detail) !== JSON.stringify(detailString) )
      return test
    })
  } 


  return(
    <View className='border-4'>
      <Text>Name</Text>
      <Controller
        name='name'
        control={control}
        render={({field:{name, onChange, onBlur, value}}) => {
          return(
            <View className='border-2 border-red-600'>
              <TextInput>{value}</TextInput>
            </View>
          )
        }}
      />
      <Text>Quantity</Text>
      <Controller
        name='quantity'
        control={control}
        render={({field:{name, onChange, onBlur, value}}) => {
          return(
            <View className='border-2 border-red-600'>
              <TextInput>{value}</TextInput>
            </View>
          )
        }}
      />
      {
        additionalDetails.map( detail => {
          return(
            <Controller
            name={`details.${detail}`}
            control={control}
            render={( { field:{ onChange, onBlur, value }} ) => (
              <AdditionalInput detail={detail} handleNewDetailRemoval={handleNewDetailRemoval} allowableWidth={calculatedWidth} onChange={onChange} onBlur={onBlur} value={value} />
            ) }
          />
          )
        })
      }
    </View>
  )
}

export default SaveModalInput