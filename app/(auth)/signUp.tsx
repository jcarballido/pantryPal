import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from "react-native";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../../utilities/supabase";
import { Redirect, useRouter } from 'expo-router';
import useAuthStore from '@/stores/useAuthStore';

const redirectTo = makeRedirectUri({path:'login'});

export default function login() {

  const [emailValue, setEmailValue] = useState<string>('')
  const [passwordValue, setPasswordValue] = useState<string>('')

  const router = useRouter()
  const {user, signUpWithEmail, performOAuth} = useAuthStore()

  const handleSignUpWithEmail = async() => {
    try {
      const data = await signUpWithEmail(emailValue,passwordValue)
      if(data.user){
        router.replace('/(auth)/confirmation')
      }
    } catch (error) {
      console.log('Error signing up new user:', error)
    }
  }

  if(user){
    return <Redirect href='/(protected)/(tabs)' />
  }
  
  return (
    <View className='flex flex-col gap-2 grow items-center bg-white'>
      <View className='border self-start absolute left-8'>
        <Text onPress={() => router.push('/(auth)/login')}>
          BACK
        </Text>
      </View>
      <Text className='p-8 my-10'>LOGO</Text>
      <View className='flex grow w-full p-8 gap-4'>
        <Text className='text-lg font-bold'>Create Your Account</Text>
        <TextInput className='border w-full text-gray rounded-lg px-4 py-3 text-lg' placeholderTextColor='#9CA3AF' value={emailValue} onChangeText={setEmailValue} placeholder='Email' />
        <TextInput className='border w-full rounded-lg px-4 py-3 text-lg' value={passwordValue} onChangeText={setPasswordValue} placeholder='Password' placeholderTextColor='#9CA3AF' />
        {/* <TextInput className='border w-full rounded-lg px-4 py-3 text-lg' value={passwordValue} onChangeText={setPasswordValue} placeholder='Confirm Password' placeholderTextColor='#9CA3AF' /> */}
        <Pressable className='w-full border flex items-center bg-blue-300 p-5 rounded-xl ' onPress={handleSignUpWithEmail}>
          <Text className=''>
            Sign Up
          </Text>
        </Pressable>
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

