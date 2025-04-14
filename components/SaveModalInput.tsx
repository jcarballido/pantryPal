import { View, Text, TextInput } from 'react-native'
import React, { Dispatch, forwardRef, SetStateAction, useEffect, useImperativeHandle, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ParsedNeededItemData } from '@/sharedTypes/ItemType'
import AdditionalInput from './AdditionalInput'

interface FormData {
  // data: ParsedNeededItemData
  id: string;
  name: string;
  amount: string;
  details: {[key:string]:string}
}

interface Props{
  item: ParsedNeededItemData;
  editItemForSaving: (data: {id: string;
    name: string;
    amount: string;
    details: {[key:string]:string}
  }) => void;
  // setItemsPreparedForSaving: React.Dispatch<SetStateAction<ParsedNeededItemData[]>>;
}

export interface CollectFormInput{
  getFormData: () => {id:string,name:string,amount:string, details:{[key:string]:string}};
}

const SaveModalInput = forwardRef<CollectFormInput,Props>( ({item, editItemForSaving}, ref) => {

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
    if(item){
      console.log('Item detected.')
      // console.log('Item passed in:', editModalVisible.item)
      const { name, amount, details } = item
      if(details){
        const detailNames = Object.keys(details)      
        console.log(`Details in item ${item.name}: `, detailNames)
        setAdditionalDetails([...detailNames])
      }
      reset(item)
      // setItemsPreparedForSaving(prev => [...prev,item])
    }
  },[])
  // useEffect(()=>{
  //   const sub = watch(data => {
  //     const input = watch()
  //     console.log('')
  //     // // Structure the object to save
  //     // const name = data.name?data.name:''
  //     // const quantity = data.quantity ? data.quantity:''
  //     // const id = data.id? data.id:''
  //     // const details:{[key:string]:string} = {}
  //     // console.log('Additional details: ',additionalDetails)
  //     // // if(additionalDetails.length > 0) {
  //     //   additionalDetails.map( (detail:string) => {
  //     //   console.log(`Detail in additonal details for item ${item.name}: `,detail)
  //     //   console.log('Value of detail: ', data.details?.detail)
  //     //   if(data.details) details[detail] = data.details[`${detail}`] as string
  //     //   })
  //     // // }
  //     // editItemForSaving({id,quantity,name,details})
      
  //   })
  //   return () => sub.unsubscribe()
  // },[watch])

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
  
  // useEffect(()=>{
  //   reset(item)
  // },[])

  // useEffect(() => {
  //   console.log(`Input Values for item id ${item.id}: `, inputValues )
  // }, [inputValues])

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

  const capture = watch()

  useImperativeHandle(ref, () => ({
      getFormData: () => {
        const capture = watch()
        // console.log(`Captured values from item ${item.name}:`, capture)
        return {...capture}
      }
  }))


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
        name='amount'
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
})

export default SaveModalInput