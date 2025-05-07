import { View, Text, Pressable, TextInput } from 'react-native'
import React, { SetStateAction, useEffect, useState } from 'react'
import { DbRecordStoredCategory } from '@/sharedTypes/ItemType';

interface Props{
  item:{id:string,name:string};
  deleteMode:{status:boolean};
  setItemsMarkedForDeletion:React.Dispatch<SetStateAction<string[]>>;
  itemsMarkedForDeletion:string[];
  reservedCategories:string[];
  setItemsEdited: React.Dispatch<SetStateAction<DbRecordStoredCategory[]>>;
  editMode:{status:boolean}
}

const SavedCategory = ({item, deleteMode, itemsMarkedForDeletion,setItemsMarkedForDeletion, reservedCategories, editMode, setItemsEdited}:Props) => {

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
    setItemsEdited(prev => {
      const check = prev.map((prevItem:DbRecordStoredCategory) => {
        console.log('PrevItem Id:', prevItem.id)
        console.log('item.id', item.id)
        console.log('Equal IDs:', prevItem.id === item.id)

        return prevItem.id === item.id
      })
      console.log('Previous items edited:', prev)
      
      if(check.includes(false)){
        console.log('This item is not in the array, adding',{name:value})
        return [...prev,{id:item.id,name:value}]
      }else{
        console.log('This item is in the array, updating to:',value)
        const newArray = prev.map(prevItem => {
          console.log('PrevItem Id:', prevItem.id)
          console.log('item.id', item.id)
          console.log('Equal IDs:', prevItem.id === item.id)

          if(prevItem.id === item.id){
            console.log('PrevItem Id:', prevItem.id)
            console.log('item.id', item.id)
            console.log('Equal IDs:', prevItem.id === item.id)
            return {id:item.id, name:value}
          }  
          else {
            console.log('Item not found')
            console.log('PrevItem Id:', prevItem.id)
            console.log('item.id', item.id)
            console.log('Equal IDs:', prevItem.id === item.id)
 
            return prevItem
          }
        })
        console.log('array after the update:', newArray)
        return newArray
      }
    })
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