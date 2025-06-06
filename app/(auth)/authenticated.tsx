import { View, Text } from 'react-native'
import React from 'react'
import * as WebBrowser from "expo-web-browser";

// WebBrowser.maybeCompleteAuthSession(); // required for web only

export default function authenticated() {
  return (
    <View>
      <Text>Authenticated!</Text>
    </View>
  )
}