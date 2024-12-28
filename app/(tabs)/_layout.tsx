import { View, Text, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
// import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui'
import MaterialIcons  from '@expo/vector-icons/MaterialIcons'
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'

const CustomTabBarButton = (props: BottomTabBarButtonProps) => {
  const { onPress, onLongPress, accessibilityRole, accessibilityState, style, children, android_ripple } = props;

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      className='h-max p-0 m-0 bg-white'
    >
      <View className=' m-0 p-0 flex flex-1 justify-center items-center h-50' style={[{ borderWidth:4,flex: 1,padding:0,margin:0, alignItems:'center',justifyContent:'center' }]}>{children}</View>
    </TouchableWithoutFeedback>
  );
};

export default function TabsLayout() {

  

  return (
    <Tabs screenOptions={
      {

        tabBarStyle:{
          backgroundColor:'#A3C7C9',
          position:'absolute',
          bottom: 10,
          borderRadius:999,
          marginHorizontal:20,
          flex:1,
          display:'flex',
          flexDirection:'row',
          flexGrow:1,
        },
        tabBarActiveTintColor:'#1A3554',
        tabBarInactiveTintColor:'#505050',
        tabBarItemStyle:{
          display:'flex',
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center',
          flex:1
        },
        tabBarShowLabel: false,
        headerStyle:{
          backgroundColor:'red'
        },
        headerShadowVisible:false,
        headerShown:false
      }
    }>
      
      <Tabs.Screen name='index' options={{ 
        title: 'Categories',
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialIcons name="category" size={size} color={color} style={focused? {  backgroundColor:'#E0E4E8',borderRadius:999}:{}}/>         
        ),
        }}
      
       />
      <Tabs.Screen name='search' options={{ 
        title: 'Search',
        tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons name="search" size={size} color={color} style={focused? {backgroundColor:'#E0E4E8', borderRadius:999}:{}} />         
        )
       }} 
      />
      <Tabs.Screen name='list' options={{ 
        title: 'Shopping List',
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialIcons name="format-list-bulleted" size={size} color={color}  style={focused? {backgroundColor:'#E0E4E8', borderRadius:999}:{}}/>         
        )
        }} 
      />
      <Tabs.Screen name='account' options={{
         title: 'Account',
         tabBarIcon: ({ focused, color, size }) => (
          <MaterialIcons name="account-circle" size={size} color={color} style={focused? {backgroundColor:'#E0E4E8', borderRadius:999}:{}}/>         
        ) 
        }} 
      />
    </Tabs>
  )
}
// <Tabs>
//   <TabSlot />
//   <TabList className=' w-full border-4 border-blue-800 bg-red-600' >
//         <TabTrigger name='index' href='/' className='border-2 border-black'>
//           <Text>Categories</Text>
//         </TabTrigger>
//         <TabTrigger name='search' href='/search'>
//           <Text>Search</Text>
//         </TabTrigger>
//         <TabTrigger name='list' href='/list'>
//           <Text>List</Text>
//         </TabTrigger>
//         <TabTrigger name='account' href='/account'>
//           <Text>Account</Text>
//         </TabTrigger>

//   </TabList>
// </Tabs>