import { View, Text, TextInput, LayoutChangeEvent } from 'react-native'
import React from 'react'

type Props = {
  label: string;
  placeholderText:string;
  allowableWidth?:number | undefined;
  setCalculatedWidth?: React.Dispatch<React.SetStateAction<number|undefined>>;
  onChange:(value:string) => void;
  onBlur:() => void;
  value: string;
}

export default function RequiredInput({ label, placeholderText, allowableWidth, setCalculatedWidth, onChange, onBlur, value }:Props) {

  const calculateWidth = ( event: LayoutChangeEvent ) => {
    if( setCalculatedWidth ){
      // console.log('Calculated Width ran')
      const { width } = event.nativeEvent.layout
      // console.log('Width:',' ',`w-[${Math.ceil(width)}]`)
      setCalculatedWidth(Math.ceil(width))
    }
    return
  }

  return (
    <View className='flex-row items-center flex-1 mb-4' >
      <Text style={allowableWidth ? {width:allowableWidth}:{paddingRight:20}} onLayout={calculateWidth}>
        { label }
      </Text>
      <TextInput className='px-4 py-3 border border-gray-300 flex-1 rounded-lg' placeholder={placeholderText} onChangeText={onChange} onBlur={onBlur} value={value} />
    </View>
  )
}