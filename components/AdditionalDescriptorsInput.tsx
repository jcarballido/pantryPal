import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'

interface Props {
  className: string
}

export default function AdditionalDescriptorsInput({ className }: Props) {

  const [ additionalDetails, setAdditionalDetails] = useState<string[]>([])
  const [ newDetailName, setNewDetailName ] = useState('')
  const [ newDetail, setNewDetail] = useState('')

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

  return (
    <View className={className}>
      <Text className='font-extrabold'>Additional Details</Text>
      {
        additionalDetails.map( detail => {
          return(
            <View className='border-2'>
              <Text className='border-2 border-green-400'>{ detail }</Text>
              <TextInput placeholder='Detail (e.g. 10/11/1900, Target, 3.99)' onChangeText={setNewDetail}/>
              <Pressable onPress={()=>handleNewDetailRemoval(detail)} className='w-full border-2 border-pink-300 flex-row justify-center'>
                <Text className='w-full flex-1'>
                  X
                </Text>
              </Pressable>
            </View>
          )
        })
      }

      <View className='border-2 border-red-600'>
        <Text>New Detail</Text>
        <TextInput placeholder='Name (e.g. Expiration Date, Purchased At, Price)' value={newDetailName} onChangeText={setNewDetailName}/>
        <Pressable onPress={handleAddingNewField}>
          <Text>+</Text>
        </Pressable>
      </View>
    </View>
  )
}