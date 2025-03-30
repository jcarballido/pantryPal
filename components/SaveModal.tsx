import { View, Text, Modal } from 'react-native'
import React, { SetStateAction, useEffect, useState } from 'react'
import useItemStore from '@/stores/useItemStore';
import { useSQLiteContext } from 'expo-sqlite';
import { useForm } from 'react-hook-form';

interface Props{
  saveModalVisible: {status: boolean};
  setSaveModalVisible: React.Dispatch<SetStateAction<{status: boolean}>>;
  itemsMarkedForSaving: number[]
}

interface FormData {
  name:string;
  category:string;
  amount:string;
  [key: string] : string
}


const SaveModal = ({saveModalVisible, setSaveModalVisible, itemsMarkedForSaving}: Props) => {

  const { addItems } = useItemStore()
  const db = useSQLiteContext()
  const { control, handleSubmit, reset,watch, formState:{ errors, touchedFields } } = useForm<FormData>()
  const inputValues = watch()
  
  const [ additionalDetails, setAdditionalDetails ] = useState<string[]>([])
  const [ newDetailName, setNewDetailName ] = useState('')
  
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

  return (
    <Modal visible={saveModalVisible.status} onRequestClose={()=>setSaveModalVisible({status: false})}>
    </Modal>
  )
}

export default SaveModal