import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'

interface Props{
  className: string
}

export default function AmountInput({ className }: Props) {
  const placeholderText: string = 'Full, 100%, 2/3, 8, etc...'
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
        Amount:
      </Text>
      <TextInput placeholder={name} onChangeText={setName} onFocus={handleFocus} onBlur={handleBlur} />
    </>
  )
}