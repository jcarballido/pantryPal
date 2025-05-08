import { View, Text, Pressable, TextInput } from 'react-native'
import React, { SetStateAction, useEffect, useState } from 'react'
import { DbRecordStoredCategory } from '@/sharedTypes/ItemType';

interface Props{
  item:{id:string,name:string};
  deleteMode:{status:boolean};
  setItemsMarkedForDeletion:React.Dispatch<SetStateAction<string[]>>;
  itemsMarkedForDeletion:string[];
  reservedCategories:string[];
  itemsEdited: (DbRecordStoredCategory&{newName: string})[];
  setItemsEdited: React.Dispatch<SetStateAction<(DbRecordStoredCategory&{newName: string})[]>>;
  editMode:{status:boolean}
}

const SavedCategory = ({item, deleteMode, itemsMarkedForDeletion,setItemsMarkedForDeletion, reservedCategories, editMode, setItemsEdited, itemsEdited}:Props) => {

  const [ isChecked, setIsChecked ] = useState(false)
  const [ value, updateText ] = useState(item.name)

  const handleCheck = () => {
    if(isChecked){
      const updatedArray = itemsMarkedForDeletion.filter( catId => catId !== item.id)
      setItemsMarkedForDeletion(updatedArray)
    }else{
      setItemsMarkedForDeletion(prev => [...prev, item.id])
    }
    setIsChecked(prev => !prev)
  }

  useEffect(()=>{
    const exists = itemsEdited.some((editedItem:DbRecordStoredCategory) => editedItem.id === item.id )
    if( !exists && item.name !== value ) {
      console.log('This item is not in the array, adding',{name:value})
      setItemsEdited(prevEditedItems => [...prevEditedItems,{id:item.id, name:item.name,newName:value}])
    }else{
      console.log('This item is in the array, updating to:',value)
      const newArray: ((DbRecordStoredCategory&{newName:string})|null)[] = itemsEdited.map(editedItem => {
        if(editedItem.id !== item.id) return editedItem
        return item.name === value ? null : {id:item.id, name:item.name, newName:value}
      })
      const filteredNewArray:(DbRecordStoredCategory&{newName:string})[] = newArray.filter(updatedItem => updatedItem !== null)
      console.log('array after the update:', newArray)
      setItemsEdited(filteredNewArray)
    }
  },[value])
    
  return (
    <View className='py-4 border-2 my-4'>
      {
        editMode.status
        ? <TextInput onChangeText={updateText} value={value} />
        : <Text>{item.name}</Text>
      }
      { 
        deleteMode.status
        ? reservedCategories.includes(item.name)
          ? <View className='mr-4 justify-center '>
              <Pressable className='bg-gray-600' onPress={()=> console.log('Category is reserved')} >
                {
                  isChecked
                  ? <View className='size-8 border items-center justify-center bg-white rounded-lg'><Text>X</Text></View>
                  : <View className='size-8 bg-white rounded-lg'></View>
                }
              </Pressable>
            </View>
          : <View className='mr-4 justify-center '>
              <Pressable className='' onPress={handleCheck} >
                {
                  isChecked
                  ? <View className='size-8 border items-center justify-center bg-white rounded-lg'><Text>X</Text></View>
                  : <View className='size-8 bg-white rounded-lg'></View>
                }
              </Pressable>
            </View>
        : null
      }
    </View>
  )
}

export default SavedCategory