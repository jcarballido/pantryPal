import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'

interface Props {
  className: string
}

export default function ItemNameInput({ className }: Props) {
 
  const placeholderText: string = 'Orange Juice, Grapes, Paper Towels, etc.'
  const [ name, setName ] = useState(placeholderText)
  const [ isFocused, setIsFocused ] = useState({status:false})

  const handleBlur = () => {
    setIsFocused({status:false})
    if(name === '' && isFocused.status === false) setName(placeholderText)
  }

  const handleFocus = () => {
    setIsFocused({status:true})
  }

  return (
    <>
      <Text className=''>Name:</Text>
      <TextInput placeholder={name} onChangeText={setName} onFocus={handleFocus} onBlur={handleBlur}  className=''/>
    </>
  )
}