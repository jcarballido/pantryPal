import { View, Text, Pressable } from 'react-native'
import React, { SetStateAction, useState } from 'react'

interface Props{
  item:{id:string,name:string};
  deleteMode:{status:boolean};
  setItemsMarkedForDeletion:React.Dispatch<SetStateAction<string[]>>;
  itemsMarkedForDeletion:string[];
  reservedCategories:string[]
}

const SavedCategory = ({item, deleteMode, itemsMarkedForDeletion,setItemsMarkedForDeletion, reservedCategories}:Props) => {

  const [ isChecked, setIsChecked ] = useState(false)

    const handleCheck = () => {
      if(isChecked){
        const updatedArray = itemsMarkedForDeletion.filter( catId => catId !== item.id)
        setItemsMarkedForDeletion(updatedArray)
      }else{
        setItemsMarkedForDeletion(prev => [...prev, item.id])
      }
      setIsChecked(prev => !prev)
    }
    
  return (
    <View className='py-4 border-2 my-4'>
      <Text>{item.name}</Text>
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