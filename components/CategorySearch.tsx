import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

interface Props{
  defaultValue: string;
  customStyle?: string
}

export default function CategorySearch({defaultValue, customStyle}: Props) {
  
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
  
  return (
    <View className={`w-1/2 min-h-[44] flex-row justify-center bg-white rounded-full max-h-max items-center my-2 px-2 mx-4 ${isFocused? 'border-2 border-purple-600':''}`}>
      <MaterialIcons name='search' />
      <TextInput placeholder={value} onChangeText={setValue} className=' bg-transparent w-full border-none outline-none ring-0' onFocus={handleFocus} onBlur={handleBlur} />
    </View>
  )
}