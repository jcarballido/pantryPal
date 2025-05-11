import { View, Text, Modal, ScrollView, FlatList, TextInput, Pressable } from 'react-native'
import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import useItemStore from '@/stores/useItemStore';
import { useSQLiteContext } from 'expo-sqlite';
import { Controller, useForm } from 'react-hook-form';
import { ParsedRecordShoppingListItem } from '@/sharedTypes/ItemType';
import SaveModalInput, {CollectFormInput} from './SaveModalInput';
import DropdownInput from './DropdownInput';
import RequiredInput from './RequiredInput';
import { addShoppingListItems } from '@/database/addItems';

interface Props{
  saveModalVisible: {status: boolean};
  setSaveModalVisible: React.Dispatch<SetStateAction<{status: boolean}>>;
  setSaveMode: React.Dispatch<SetStateAction<{status:boolean}>>;
  itemsMarkedForSaving: ParsedRecordShoppingListItem[];
  setItemsMarkedForSaving: React.Dispatch<SetStateAction<ParsedRecordShoppingListItem[]>>;
  setClearChecks: React.Dispatch<SetStateAction<boolean>>
}

interface ParentFormData {
  category:string;
  [key: string] : string
}

const SaveModal = ({saveModalVisible, setSaveModalVisible, itemsMarkedForSaving, setSaveMode, setItemsMarkedForSaving, setClearChecks}: Props) => {
  
  const { savedCategories, setSavedCategories, allStoredItems, addListItems,deleteFromShoppingList } = useItemStore()
  const db = useSQLiteContext()
  const { control, handleSubmit, reset,watch, formState:{ errors, touchedFields } } = useForm<ParentFormData>()
  const inputValues = watch()
  const itemsPreparedForSaving = useRef<ParsedRecordShoppingListItem[]>([])
  // const [itemsPreparedForSaving, setItemsPreparedForSaving] = useState<ParsedNeededItemData[]>([]) 
  
  const editItemForSaving = (data:{id: string;
    name: string;
    amount: string;
    details: {[key:string]:string}
  }) => {
    const index = itemsPreparedForSaving.current.findIndex( savedItem => savedItem.id === data.id )
    if(index !== -1){
      itemsPreparedForSaving.current[index] = data
    }else{
      itemsPreparedForSaving.current.push(data)
    }
    console.log('Items prepped for saving: ', itemsPreparedForSaving.current)
  }
  
  const collectedValues = useRef<Record<string,CollectFormInput | null>>({})
  
  const [ additionalDetails, setAdditionalDetails ] = useState<string[]>([])
  const [ newDetailName, setNewDetailName ] = useState('')
  // const [ itemsPreparedForSaving, setItemsPreparedForSaving ] = useState<ParsedNeededItemData[]>([])
  const [ calculatedWidth, setCalculatedWidth ] = useState<number|undefined>(undefined)
  const [ categorySet, setCategorySet ] = useState<boolean>(false)
  
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
    
  useEffect(()=>{
    const categories = allStoredItems.map(item => {
      return {id:item.id, name:item.category}
    })
    const uniqueCategories = [...new Set(categories)]
    setSavedCategories(uniqueCategories)
    console.log("Items marked for saving in SaveModal mount:", itemsMarkedForSaving)
  },[])

  useEffect(() => {
    const vals = watch((value,{name,type})=>{
      console.log('Value:',value)
      const categoryValue = value.category
      const newCategoryValue = value.newCategory
      const categoryEstablished = categoryValue !== undefined && (categoryValue !== 'New Category' || (newCategoryValue !== undefined && newCategoryValue !== ""))
          
      console.log('Category set? ', categoryEstablished)
      setCategorySet(categoryEstablished)
    })

    return () => vals.unsubscribe()
  },[watch])
    
  const handleSave = async() => {
    // console.log('Category:', inputValues['category'])
    // if(inputValues['newCategory']) console.log('New Category:', inputValues['newCategory'])
    // console.log('Items to store: ', itemsPreparedForSaving.current)
    const categoryInputValue = watch('category')
    const category = categoryInputValue === 'New Category' ?  inputValues['newCategory'] : inputValues['category']  
    console.log('Category value being watched: ', category)
    // console.log('New Category if listed: ', ca)
    // const allValues = itemsPreparedForSaving.current.map( item => {
    //   // const {id} = item
    //   const values = collectedValues.current[item.id]?.getFormData()
    //   // console.log('Values returned from')
    //   return {...values, category}
    // })
    // console.log('All values collected: ', allValues)
    console.log('Items marked for saving:', itemsMarkedForSaving)
    const allValues = itemsMarkedForSaving.flatMap( shoppingListItem => {
      const values = collectedValues.current[shoppingListItem.id]?.getFormData()
      return values ? {...values, category:category} : []
    })
    try {
      addShoppingListItems(db,allValues, addListItems, itemsMarkedForSaving,deleteFromShoppingList)
    } catch (error) {
      console.log('Error attempting to save items:', error)
      return
    }
    setItemsMarkedForSaving([])
    setSaveModalVisible({status:false})
    setSaveMode({status:false})          
  }

  return (
    <Modal visible={saveModalVisible.status} onRequestClose={
      ()=>{
        setSaveModalVisible({status: false})
        setItemsMarkedForSaving([])
        setSaveMode({status:false})
        setClearChecks(true)
      }
    }>
      <Controller
        name='category'
        control={control}
        rules={{
          required: true
        }}
        render={ ({field:{ value, onChange }}) => (
          <DropdownInput styles='' value={value} setCalculatedWidth={setCalculatedWidth} onChange={onChange} savedCategories={savedCategories} />
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
        />
      }
      <FlatList
        data={itemsMarkedForSaving}
        renderItem={({item}) => {
          return(
            <SaveModalInput 
            item={item} 
            editItemForSaving={editItemForSaving} 
            ref={(el) => {
              collectedValues.current[item.id] = el
            }}
          />
          )
        }}
      />
      {categorySet && <View className='border-4 border-green-500'>
        <Pressable onPress={handleSave}>
          <Text>
            Save
          </Text>
        </Pressable>
      </View>}
    </Modal>
  )
}

export default SaveModal