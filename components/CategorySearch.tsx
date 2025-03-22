import { View, Text, TextInput, Pressable } from 'react-native'
import React, { SetStateAction, useEffect, useState } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useSQLiteContext } from 'expo-sqlite';
import Fuse from 'fuse.js'
import { ParsedItemData } from '@/sharedTypes/ItemType';

interface Props{
  defaultValue: string;
  customStyle?: string;
  categorySpecificItems:ParsedItemData[],
  setCategorySpecificItems:React.Dispatch<SetStateAction<ParsedItemData[]>>;
  filteredCategorySpecificItems:ParsedItemData[];
  setFilteredCategorySpecificItems: React.Dispatch<SetStateAction<ParsedItemData[]>>
}

export default function CategorySearch({defaultValue, customStyle, categorySpecificItems, setCategorySpecificItems, filteredCategorySpecificItems, setFilteredCategorySpecificItems}: Props) {

  const db = useSQLiteContext()
  
  const [ value, setValue ] = useState('')
  const [ isFocused, setIsFocused ] = useState(false)

  const handleFocus = () => {
    setIsFocused( true )
  } 

  const handleBlur = () => {
    setIsFocused(false)
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (value.trim().length > 0 && value !== '') {
        console.log('Value:',value)
        const result = searchCategoryItems(value)
        console.log('Result from search:')
        console.log(JSON.stringify(result,null,2))
        setFilteredCategorySpecificItems( () => {
          const searchResults = categorySpecificItems.filter( item => result.includes(item.id) )
          return searchResults
        })
      }
      if(value === ''){
        setFilteredCategorySpecificItems([])
      }
    },500)

    return () => clearTimeout(debounce)
  }, [value]);

  const searchCategoryItems = (value:string) => {
    const fuseOptions = {
      keys:[ "name" ]
    }
    const fuse = new Fuse(categorySpecificItems,fuseOptions)
    return fuse.search(value).map( results => results.item.id)
  }

  const clearSearch = () => {
    setValue('')
    setFilteredCategorySpecificItems([])
  };
  
  return (
    <View className='flex flex-row items-center'>
      <View className={`w-1/2 min-h-[44] shrink flex flex-row justify-center bg-white rounded-full max-h-max items-center my-2 px-2 mx-4 ${isFocused? 'border-2 border-purple-600':''}`}>
        <MaterialIcons name='search' />
        <TextInput value={value} placeholder='Search Category' onChangeText={setValue} className='bg-transparent w-full border-none outline-none ring-0' onFocus={handleFocus} onBlur={handleBlur} />
      </View>
      <Pressable onPress={clearSearch}>
        <Text>
          Clear
        </Text>
      </Pressable>
    </View>
  )
}