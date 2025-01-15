import { View, Text, Modal, Pressable, ScrollView, TextInput } from 'react-native'
import React from 'react'
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
  return (
    <Modal visible={ visible.status } onRequestClose={() => setVisible({status:false})}  >
      <ScrollView className='flex-1 flex-col bg-primary-light-base'>
        <View className='flex-1 flex-row items-center justify-center'>
          <View className='flex-1 flex-row justify-center border-2 border-orange-500'>
            <Text className='text-2xl'>Add New Item</Text>
          </View>
          <Pressable onPress={() => setVisible({status:false})} className='absolute right-0 mr-2'>
            <Text className='text-2xl'>X</Text>
          </Pressable>
        </View>
        <View className='flex flex-row'>
          <View className='max-w-max flex-1 border-2 border-red-500'>
            <Text className='border-2 border-red-800'>Name</Text>
            <Text>Category</Text>
            <Text>Amount</Text>
          </View>
          <View className='flex-1'>
            <TextInput className='border-2'/>
            <TextInput className='border-2'/>
            <TextInput className='border-2'/>
          </View>
        </View>
      </ScrollView>
    </Modal>
  )
}