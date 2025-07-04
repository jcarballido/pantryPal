import React, { useEffect, useState } from 'react';
import { Button, Pressable, Text, TextInput, View } from "react-native";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "../../utilities/supabase";
import { Redirect, useRouter } from 'expo-router';
import useAuthStore from '@/stores/useAuthStore';

WebBrowser.maybeCompleteAuthSession(); // required for web only

const redirectTo = makeRedirectUri({path:'login'});

export default function login() {
  
  const {sessionData,setSession, setUser} = useAuthStore()

  const createSessionFromUrl = async (url: string) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);
    if (errorCode) {
      console.log('Error in query params:', errorCode)
      throw new Error(errorCode)
    };
    const { access_token, refresh_token } = params;
    if (!access_token) {
      console.log('No access token from createSessionFromURL.')
      return
    };
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) {
      console.log('Error from supabase setSession:', error)  
      throw error
    };
    return data.session;
  };

  const performOAuth = async () => {

    await supabase.auth.signOut();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect:true,
        queryParams: {
          prompt: 'select_account'
        },
      },
    });

    if (error) {
      console.log('Error from signInWithOAuth:', error)
      throw error
    };
    // if (data) console.log('Data URL recieved from signIn:', data.url)
    console.log("Opening browser...")

    try{
      const res = await WebBrowser.openAuthSessionAsync(
        data.url ,
        redirectTo
      );
      // console.log('Response from openAuthSession:', res)
      if (res.type === "success") {
        const { url } = res;
        const sessionData = await createSessionFromUrl(url);
        // console.log('Session Data:', sessionData)
        if(sessionData) setSession(sessionData)
        if(sessionData?.user) setUser(sessionData.user)
      }
    }catch(e){
      console.log('Error opening Auth session:',e)
    }
  };

  useEffect(() => {
    // console.log('Session Data:', sessionData)
    if(sessionData){
      router.replace('/')
    }
  }, [sessionData])

  const router = useRouter()

  const redirectToSignUp = () => {
    console.log('Pressed')
    router.push('./signUp')
  }

  const [emailValue, setEmailValue] = useState<string>('')
  const [passwordValue, setPasswordValue] = useState<string>('')

  return (
    <View className='flex flex-col gap-2 grow items-center bg-white'>
      <Text className='p-8 my-10'>LOGO</Text>
      <View className='flex grow w-full p-8 gap-4'>
        <Text className='text-lg font-bold'>Login to Your Account</Text>
        <TextInput className='border w-full text-gray rounded-lg px-4 py-3 text-lg' placeholderTextColor='#9CA3AF' value={emailValue} onChangeText={setEmailValue} placeholder='Email' />
        <TextInput className='border w-full rounded-lg px-4 py-3 text-lg' value={passwordValue} onChangeText={setPasswordValue} placeholder='Password' placeholderTextColor='#9CA3AF' />
        <Pressable className='w-full border flex items-center bg-blue-300 p-5 rounded-xl'>
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

