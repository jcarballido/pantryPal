import React from 'react'
import { Stack } from 'expo-router'
// import 'react-native-url-polyfill' // required for React Native
import '../global.css'
// import * as WebBrowser from "expo-web-browser";

// WebBrowser.maybeCompleteAuthSession(); // required for web only


export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(protected)" options={{
        headerShown: false
      }} />
      {/* <Stack.Screen name="(auth)" options={{
        headerShown: false
      }} /> */}
    </Stack>
  )
}