import { View, Text, TextInput, Pressable } from 'react-native'
import React, { SetStateAction, useState } from 'react'

interface Props {
  allowableWidth: number | undefined;
  numberAddedDetails: number;
  handleAddingNewField: () => void;
  newDetailName: string;
  setNewDetailName: React.Dispatch<React.SetStateAction<string>> 
}

export default function AdditionalInput({ allowableWidth,numberAddedDetails,handleAddingNewField,newDetailName, setNewDetailName }:Props) {
  
  return (
    <View className={`flex-row items-center ${ numberAddedDetails > 0? 'mt-3':'mt-0'}`}>
      <Text style={ {width:allowableWidth} }  className='flex-wrap flex-0'>New Detail</Text>
      <TextInput className='flex-1 flex-wrap mr-5 px-4 py-3 border border-gray-300 rounded-lg' placeholder='Ex. Expiration Date, Price' value={newDetailName} onChangeText={setNewDetailName}/>
      <Pressable onPress={handleAddingNewField} className={`py-3 px-6 min-w-[50px] border-2 rounded-lg`}>
        <Text className='text-xl'>+</Text>
      </Pressable>
    </View>
  )
}