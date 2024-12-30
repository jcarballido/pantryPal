import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Link } from 'expo-router'


type MaterialCommunityIconNames = keyof typeof MaterialCommunityIcons.glyphMap
type MaterialIconNames = keyof typeof MaterialIcons.glyphMap

interface SettingsButtonProps{
  iconSize: number,
  iconColor:string,
  buttonText:string,
  className:string
}

interface MaterialCommunityIconButton extends SettingsButtonProps{
  iconType: 'Material Community Icon'
  iconName: MaterialCommunityIconNames 
}

interface MaterialIconButton extends SettingsButtonProps{
  iconType: 'Material Icon'
  iconName: MaterialIconNames
}

const SettingsButton = (props: MaterialCommunityIconButton | MaterialIconButton) => {

  const { iconColor,iconName,iconSize,iconType,buttonText,className } = props

  return(
    <View className={className}>
      <View className='rounded-full  mx-2 p-2 bg-primary-action-base '>
        {
          iconType === 'Material Community Icon'
          ? <MaterialCommunityIcons name={iconName} size={iconSize} color={iconColor}  />
          : <MaterialIcons name={iconName} size={iconSize} color={iconColor} />
        }
      </View>
      <Pressable className='flex-1 flex-row items-center'>
        <Text className='flex-1'>
          {buttonText}
        </Text>
        <MaterialIcons name='chevron-right' size={24} color='black' className='pr-2'/>
      </Pressable>
    </View> 
  ) 
}

export default function account() {

  const bottomTabBarHeight = useBottomTabBarHeight()

  const buttonClassName = 'w-full  flex flex-row justify-start min-h-[44] items-center'

  return (
    <View className='flex-1 flex-col bg-[#F8F4EB] items-center justify-start'>
      <View className='flex flex-row items-center justify-start h-[70] mt-10'> 
        <Text>Account</Text>
      </View>
      <View style={{ marginBottom:bottomTabBarHeight + 15 }} className='flex-1 w-full px-[20] gap-[20] '>
        <View className='rounded-xl border-2  items-start pt-2 pb-2 gap-6 bg-[#E3E8EC]'>
          <Link href={'/account/details'} className='w-full'>
            <SettingsButton iconType='Material Icon' iconName='manage-accounts' iconColor='black' iconSize={24} buttonText='Account Details' className={buttonClassName} />
          </Link>
          <Link href='/account/changePassword' className='w-full'>
            <SettingsButton iconType={'Material Icon'} iconName={'lock'} iconColor='black' iconSize={24} buttonText='Change Password' className={buttonClassName} />
          </Link>
          <Link href={'/account/share'} className='w-full'>
            <SettingsButton iconType={'Material Community Icon'} iconName={'account-multiple'} iconSize={24} iconColor='black' buttonText='Manage Shared Inventory' className={buttonClassName} />
          </Link>
        </View>
      </View>
    </View>
  )
}