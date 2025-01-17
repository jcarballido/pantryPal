import { View, Text, Modal, Pressable, ScrollView, TextInput, LayoutChangeEvent } from 'react-native'
import React, { useState } from 'react'
import ItemNameInput from './ItemNameInput'
import CategoryInput from './CategoryInput'
import AmountInput from './AmountInput'
import AdditionalDescriptorsInput from './AdditionalDescriptorsInput'

type Props = {
  visible:{
    status: boolean
  },
  setVisible: React.Dispatch<React.SetStateAction<{ status: boolean }>>
}


export default function AddItemModal({ visible, setVisible }:Props) {

  const [calculatedWidth, setCalculatedWidth] = useState<number|undefined>(undefined)
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


  const calculateWidth = ( event: LayoutChangeEvent ) => {
    const { width } = event.nativeEvent.layout
    console.log('Width:',' ',`w-[${Math.ceil(width)}]`)
    setCalculatedWidth(Math.ceil(width))
  }

  return (
    <Modal visible={ visible.status } onRequestClose={() => setVisible({status:false})}  >
      <ScrollView className='flex-1 flex-col bg-primary-light-base'>
        <View className='flex-1 flex-row items-center justify-center'>
          <View className='flex-1 flex-row justify-center pt-10'>
            <Text className='text-2xl'>Add New Item</Text>
          </View>
          <Pressable onPress={() => setVisible({status:false})} className='absolute right-0 mr-7 top-10'>
            <Text className='text-2xl'>X</Text>
          </Pressable>
        </View>
        <View className='flex flex-col p-3'>
          <View className='flex-row items-center flex-1' >
            <Text style={{width:calculatedWidth}}>
              Name
            </Text>
            <TextInput placeholder='Name Placeholder'/>
          </View>
          <View className='flex-row items-center'>
            <Text style={{width:calculatedWidth}} onLayout={calculateWidth} >
              Category
            </Text>
            <TextInput placeholder='Category Placeholder'/>
          </View>
          <View className='flex-row items-center'>
            <Text style={{width:calculatedWidth}}>
              Amount
            </Text>
            <TextInput placeholder='Amount Placeholder'/>
          </View>
          <Text className='font-extrabold mt-5'>Additional Details</Text>
          {
            additionalDetails.map( detail => {
              return(
                <View className='flex-row items-center'>
                  <Text style={{width:calculatedWidth}} className=''>{ detail }</Text>
                  <TextInput placeholder='Detail (e.g. 10/11/1900, Target, 3.99)' onChangeText={setNewDetail} className='flex-1'/>
                  <Pressable onPress={()=>handleNewDetailRemoval(detail)} className=''>
                    <Text className='w-full flex-1'>
                      X
                    </Text>
                  </Pressable>
                </View>
              )
            })
          }
          <View className={`flex-row items-center ${additionalDetails.length > 0? 'mt-3':'mt-0'}`}>
            <Text style={ {width:calculatedWidth} }  className='flex-wrap flex-0'>New Detail</Text>
            <TextInput className='flex-1 flex-wrap mr-5' placeholder='e.g. Expiration Date, Purchased At, Price' value={newDetailName} onChangeText={setNewDetailName}/>
            <Pressable onPress={handleAddingNewField} className={`border-2 px-2`}>
              <Text>+</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Modal>
  )
}