import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const Confirmation = () => {
  return (
    <View className='flex grow bg-white border-4 justify-center items-center'>
      <Text>Confirmation email sent!</Text>
      <Text>
        Click here to go back to 
        <Pressable onPress={() => {
          router.replace('/(auth)/login')
          router.dismissAll()
          }} 
        >
          <Text>LOGIN</Text>
        </Pressable>
      </Text>
    </View>
  )
}

export default Confirmation