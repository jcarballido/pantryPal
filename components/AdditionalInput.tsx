import { View, Text, TextInput, Pressable } from 'react-native'
import React from 'react'

interface Props{
  detail:string;
  handleNewDetailRemoval: (input:string) => void;
  allowableWidth: number|undefined;
  onChange:(value:string) => void;
  onBlur:() => void;
  value: string;  
}

export default function AdditionalInput({ detail, handleNewDetailRemoval, allowableWidth, onChange, onBlur, value }: Props) {
  console.log('Detail passed into additional input component: ',detail)
  return (
    <View className='flex-row items-center mb-4'>
      <Text style={{width:allowableWidth}} className=''>{ detail }</Text>
      <TextInput placeholder='Ex. 10/11/1900, Target, 3.99' className='flex-1  px-4 py-3 border border-gray-300 rounded-lg mr-5' onChangeText={onChange} onBlur={onBlur} value={value} />
      <Pressable onPress={()=>handleNewDetailRemoval(detail)} className='py-3 px-6 min-w-[50px] border-2 rounded-lg'>
        <Text className='w-full flex-1 '>
          X
        </Text>
      </Pressable>
    </View>
  )
}