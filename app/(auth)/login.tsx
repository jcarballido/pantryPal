import React, { useEffect, useState } from 'react';
import { Button, Pressable, Text, TextInput, View } from "react-native";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "../../utilities/supabase";
import { Redirect, useRouter } from 'expo-router';
import useAuthStore from '@/stores/useAuthStore';
import * as SecureStore from 'expo-secure-store'

WebBrowser.maybeCompleteAuthSession(); // required for web only



export default function login() {
  
  const {user, passwordSignIn, performOAuth} = useAuthStore()

  const [emailValue, setEmailValue] = useState<string>('')
  const [passwordValue, setPasswordValue] = useState<string>('')

  const handlePasswordSignIn = async() => {
    try {
      await passwordSignIn(emailValue,passwordValue)
    } catch (error) {
      console.log('Error during sign-on:', error)
    }
  }

  const router = useRouter()

  const redirectToSignUp = () => {
    console.log('Pressed')
    router.push('./signUp')
  }

  if(user){
    return <Redirect href='/(protected)/(tabs)' />
  }

  return (
    <View className='flex flex-col gap-2 grow items-center bg-white'>
      <Text className='p-8 my-10'>LOGO</Text>
      <View className='flex grow w-full p-8 gap-4'>
        <Text className='text-lg font-bold'>Login to Your Account</Text>
        <TextInput className='border w-full text-gray rounded-lg px-4 py-3 text-lg' placeholderTextColor='#9CA3AF' value={emailValue} onChangeText={setEmailValue} placeholder='Email' />
        <TextInput className='border w-full rounded-lg px-4 py-3 text-lg' value={passwordValue} onChangeText={setPasswordValue} placeholder='Password' placeholderTextColor='#9CA3AF' />
        <Pressable className='w-full border flex items-center bg-blue-300 p-5 rounded-xl' onPress={handlePasswordSignIn}>
          <Text className=''>
            Sign In
          </Text>
        </Pressable>
        <View className='flex flex-row gap-1 justify-center items-center py-3 mt-6 '>
          <Text className=''>
            Dont have an account? 
          </Text>
          <Text className='underline' onPress={redirectToSignUp}>
            Sign Up
          </Text>
        </View>
        <View className='shrink-0 mt-6 flex gap-4'>
          <View className='text-lg flex justify-center items-center'>
            <Text className=''>
              - Or continue with -
            </Text>
          </View>
          <Pressable onPress={performOAuth} className='self-center border px-6 py-4 rounded-lg'>
            <Text className='text-lg'>
              G
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

