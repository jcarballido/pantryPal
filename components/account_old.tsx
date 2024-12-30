import { createStackNavigator } from '@react-navigation/stack'
import Test1 from './Test1'
import Test2 from './Test2'

export default function accountStack () {

  const Stack = createStackNavigator()

  return(
    <Stack.Navigator >
      <Stack.Screen name='Test1' component={Test1} />
      <Stack.Screen name='Test2' component={Test2} />
    </Stack.Navigator>
  )

}