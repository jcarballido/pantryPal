import { View, Text, TextInput } from 'react-native'
import React, { SetStateAction, useEffect, useState } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useSQLiteContext } from 'expo-sqlite';
import Fuse from 'fuse.js'
import { ParsedItemData } from '@/sharedTypes/ItemType';

interface Props{
  defaultValue: string;
  customStyle?: string;
  categorySpecificItems:ParsedItemData[],
  setCategorySpecificItems:React.Dispatch<SetStateAction<ParsedItemData[]>>
}

export default function CategorySearch({defaultValue, customStyle, categorySpecificItems, setCategorySpecificItems}: Props) {

  const db = useSQLiteContext()
  
  const [ value, setValue ] = useState(defaultValue)
  const [ isFocused, setIsFocused ] = useState(false)

  const handleFocus = () => {
    setIsFocused( true )
  } 

  const handleBlur = () => {
    setIsFocused(false)
    if(value === '') {
      setValue(defaultValue)
    }
  }

  useEffect(() => {
      if (value.trim().length > 0) {
        console.log('Value:',value)
        // searchDatabase(value);
        const result = searchCategoryItems(value)
        console.log('Result from search', result)
      }

   ; // Cleanup on unmount
  }, [value]);

  // const searchDatabase = async(term: string) => {
  //   try{
  //     const searchResult = await db.getAllAsync(`SELECT name FROM item_fts WHERE name MATCH ? LIMIT 10;`,[`${term}*`]);
  //     console.log('Search result:',searchResult)
  //   }catch(e){
  //     console.log('Error from search:',e )
  //   }
  // };

  // interface fuseOptionsInterface {
  //   keys: string[]
  // }

  const searchCategoryItems = (value:string) => {
    const fuseOptions = {
      keys:[ "value.name" ]
    }
    const fuse = new Fuse(categorySpecificItems,fuseOptions)
    return fuse.search(value)
  }
  
  return (
    <View className={`w-1/2 min-h-[44] shrink flex-row justify-center bg-white rounded-full max-h-max items-center my-2 px-2 mx-4 ${isFocused? 'border-2 border-purple-600':''}`}>
      <MaterialIcons name='search' />
      <TextInput placeholder={value} onChangeText={setValue} className=' bg-transparent w-full border-none outline-none ring-0' onFocus={handleFocus} onBlur={handleBlur} />
    </View>
  )
}