import React from 'react';
import { supabase } from '../../utilities/supabase' // your configured Supabase client
import * as AuthSession from 'expo-auth-session';
import { Button, View, Text } from 'react-native';

export default function login() {
  // const handleLogin = async () => {
  //   const redirectTo = AuthSession.makeRedirectUri({scheme:'madeUpScheme'});

  //   const { data, error } = await supabase.auth.signInWithOAuth({
  //     provider: 'google',
  //     options: {
  //       redirectTo,
  //     },
  //   });

  //   if (error) {
  //     console.error('Error logging in:', error.message);
  //   }
  // };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome!</Text>
      <Button title="Sign in with Google" />
    </View>
  );
}

// import { View, Text } from 'react-native'
// import React from 'react'

// const login = () => {
//   return (
//     <View>
//       <Text>login</Text>
//     </View>
//   )
// }

