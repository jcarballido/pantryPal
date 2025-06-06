import React, { useEffect } from 'react';
// import { supabase } from '../../utilities/supabase' // your configured Supabase client
// import * as AuthSession from 'expo-auth-session';
// import { Button, View, Text } from 'react-native';
import { Button, Text, View } from "react-native";
import { makeRedirectUri } from "expo-auth-session";
// import * as Google from "expo-auth-session/providers/google";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "../../utilities/supabase";
// import { useEffect } from "react";
//
WebBrowser.maybeCompleteAuthSession(); // required for web only



const redirectTo = makeRedirectUri({path:'login'});
// const redirectTo = Linking.createURL('/login')
// console.log('RedirectTo:', redirectTo)

// const url = Linking.useURL();
// console.log('Received deep link:', url);


const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) {
    console.log('Error in query params:', errorCode)
    throw new Error(errorCode)
  };
  const { access_token, refresh_token } = params;
  if (!access_token) {
    console.log('No access token from createSeesionFromURL.')
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
        prompt: 'select_account', // <- this is the key
    },
    },
  });

  if (error) {
    console.log('Error from signInWithOAuth:', error)
    throw error
  };
  if (data) console.log('Data URL recieved from signIn:', data.url)
  console.log("Opening browser...")
  // console.log('Redirect path passed into openAuthSession:', redirectTo)

  try{

    const res = await WebBrowser.openAuthSessionAsync(
      data.url ,
      redirectTo
    );
    console.log('Response from openAuthSession:', res)
    if (res.type === "success") {
      const { url } = res;
      await createSessionFromUrl(url);
    }
  }catch(e){
    console.log('Error opening Auth session:',e)
  }
};

export default function login() {

  // const url = Linking.useURL();
  // if (url) createSessionFromUrl(url);

  const url = Linking.useURL();
console.log('Received deep link:', url);

  // useEffect(() => {
  //   const url = Linking.useURL();
  //   console.log('Received deep link:', url);
  // }, []);


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome!</Text>
      <Button onPress={performOAuth} title="Sign in with Google"  />
    </View>
  );
}

