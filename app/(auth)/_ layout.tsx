import { Slot, Stack } from 'expo-router';
import { View } from 'react-native';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,  // usually hide header on auth screens

      }}
    />
  );
}

// export default function AuthLayout() {
//   return (
//     <View >
//       <Slot />
//     </View>
//   );
// }