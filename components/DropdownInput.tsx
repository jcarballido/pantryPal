import { View, Text, Pressable, LayoutChangeEvent } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ParsedRecordStoredItem } from '@/sharedTypes/ItemType';

interface Props{
  styles: string;
  value: string;
  onChange:(value:string)=>void;
  setCalculatedWidth: React.Dispatch<React.SetStateAction<number | undefined>>;
  savedCategories: {id:string, name:string}[]
}

export default function DropdownInput({styles,value,onChange, setCalculatedWidth, savedCategories}: Props) {

  // const [category, setCategory] = useState<string>('Select Category...')
  const [expand, setExpand] = useState<boolean>(false)

  const dropdown = () => {
    setExpand(prev => !prev)
  }

  const setVal = (newVal: string) => {
    onChange(newVal)
    setExpand(false)
  }

  const calculateWidth = ( event: LayoutChangeEvent ) => {
    if( setCalculatedWidth ){
      // console.log('Calculated Width ran')
      const { width } = event.nativeEvent.layout
      // console.log('Width:',' ',`w-[${Math.ceil(width)}]`)
      setCalculatedWidth(Math.ceil(width))
    }
    return
  }

  // useEffect(()=>{
  //   console.log('Stored Categories:',storedCategories)
  // })

  return (
    <View className='flex-row flex-1 '>
      <View className='justify-center mb-4'>
        <Text className='pr-8' onLayout={calculateWidth}>Category</Text>
      </View>
      <View className={`${styles} relative z-10 flex-1`}>
        <View className='px-4 py-3 border border-gray-300 rounded-lg mb-4 '>
          <Pressable onPress={dropdown}>
            <Text className={`${value === undefined? 'text-gray-500':'text-black'}`}>{value || 'Select Category...'}</Text>
          </Pressable>
        </View>
        <View className={`${expand ? '-mt-2 w-full scale-y-100 absolute top-full bg-white':'scale-y-0 hidden'} border-2 border-red-600`} >
          {
            savedCategories && savedCategories.map( category => {
              // console.log('Category registered as string:', category)
              if(typeof category === 'string'){
                return(
                  <Text key={category} className='m-2' onPress={()=>setVal(category)}>
                    {category}
                  </Text>
                )  
              }
              if(category.id){
                // console.log('Category registered as object:', category)
                return(
                  <Text key={category.id} className='m-2' onPress={()=>setVal(category.name)}>
                    {category.name}
                  </Text>
                )  
              }
            })
          }
          <Text className='m-2' onPress={()=> setVal('New Category')}>New Category</Text>
        </View>
      </View>
    </View>
  )
}