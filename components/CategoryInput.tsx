import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'

interface Props{
  className: string
}

export default function CategoryInput({ className }: Props) {
  const placeholderText: string = 'Category A, Bathroom Cabinet, Kitchen Drawer-Left, Kitchen Drawer-Right, etc...'
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
      <Text>
        Category:
      </Text>
      <TextInput placeholder={name} onChangeText={setName} onFocus={handleFocus} onBlur={handleBlur} />
    </>
  )
}