import { View, Text, TextInput } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ParsedNeededItemData } from '@/sharedTypes/ItemType'
import AdditionalInput from './AdditionalInput'

interface FormData {
  // data: ParsedNeededItemData
  id: string;
  name: string;
  quantity: string;
  details: {[key:string]:string}
}

interface Props{
  item: ParsedNeededItemData;
  editItemForSaving: (data: FormData) => void;
  // setItemsPreparedForSaving: React.Dispatch<SetStateAction<ParsedNeededItemData[]>>;
}


const SaveModalInput = ({item, editItemForSaving}:Props) => {

  const requiredInputNames:('name'|'quantity')[] = ['name', 'quantity']

  const { control, handleSubmit, reset,watch, formState:{ errors, touchedFields } } = useForm<FormData>()
  const [ requiredFieldsEmpty, setRequiredFieldsEmpty ] = useState<boolean>(true)
  const [ additionalDetails, setAdditionalDetails ] = useState<string[]>([])
  const [ calculatedWidth, setCalculatedWidth ] = useState<number|undefined>(undefined)
  
  // const inputValues = watch()

  // useEffect(() => {
  //   const areRequiredFieldsEmpty = requiredInputNames.some(field => inputValues[field] === undefined || inputValues[field].trim() === '')
  //   setRequiredFieldsEmpty(areRequiredFieldsEmpty)
  // },[inputValues])

  useEffect(()=>{
    const sub = watch(data => {
      console.log('Input values:', data)
        // console.log('Name: ', data.name)
        // console.log('Quantity: ',data.quantity)
        // console.log('Id: ', data.id)
        // for(const i in data.details){
        //   console.log(`Detail ${i}: `,data.details[i])
        // }
        additionalDetails.map( detail => {
          console.log('Detail stored in state: ', detail)
          if(data.details) console.log('Value of detail: ',data.details[detail])
      })  
    })

    return () => sub.unsubscribe()
  },[watch])

  // useEffect(()=>{
  //   if(item){
  //     // console.log('Item passed in:', editModalVisible.item)
  //     const { name, quantity, details } = item
  //     if(details){
  //       const detailNames = Object.keys(details)      
  //       setAdditionalDetails([...detailNames])
  //     }
  //     setItemsPreparedForSaving(prev=>[...prev,{id:item.id,name:inputValues['name'], quantity:inputValues['quantity'],details:details}])  
  //   }
  // },[inpu])
  
  useEffect(()=>{
    reset(item)
  },[])

  // useEffect(() => {
  //   console.log(`Input Values for item id ${item.id}: `, inputValues )
  // }, [inputValues])

  useEffect(()=>{
    if(item){
      // console.log('Item passed in:', editModalVisible.item)
      const { name, quantity, details } = item
      if(details){
        const detailNames = Object.keys(details)      
        setAdditionalDetails([...detailNames])
      }
      reset(item)
      // setItemsPreparedForSaving(prev => [...prev,item])
    }
  },[])
  // dispatchEvent

  const handleNewDetailRemoval = (detailString:string) => {
    setAdditionalDetails( prevArr => {
      const copy = [...prevArr]
      console.log('Item name: ', item.name)
      console.log('Previous additional detail array: ',prevArr)
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
              <TextInput onChangeText={onChange}>{value}</TextInput>
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
              <TextInput onChangeText={onChange}>{value}</TextInput>
            </View>
          )
        }}
      />
      {
        additionalDetails.map( detail => {
          return(
            <Controller
            key={detail}
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