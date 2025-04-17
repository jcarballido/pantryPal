import { View, Text, Pressable } from 'react-native'
import React, { SetStateAction, useEffect, useState } from 'react'
import { ParsedRecordStoredItem } from '@/sharedTypes/ItemType'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

interface CategoryItemProps {
  item: ParsedRecordStoredItem;
  setEditModalVisible: React.Dispatch<SetStateAction<{ status:boolean; item?:ParsedRecordStoredItem }>>;
  deleteMode: { status:boolean, category?: string };
  setItemsMarkedForDeletion: React.Dispatch<SetStateAction<number[]>>;
  itemsMarkedForDeletion: number[]  
}

export default function CategoryItem({item, setEditModalVisible, deleteMode, setItemsMarkedForDeletion, itemsMarkedForDeletion}: CategoryItemProps) {

  const [ show, setShow ] = useState({status:false})
  const [ isFlagged, setIsFlagged ] = useState(false)
  const [ isChecked, setIsChecked ] = useState(false)
  const {name,uid,amount, category , details} = item
  const itemId = item.id
  
  const descriptors:(string|number)[][] = []
  // console.log('Item passed into Category Item component:',item)

  for (const key in details){
    const value = details[key]
    descriptors.push([key,value])
  }

  const handleFlag = () => {
    
    setIsFlagged(!isFlagged )
  }

  const handleEdit = (item: ParsedRecordStoredItem) => {
    // console.log('Item passed in:', item)
    setEditModalVisible({status: true, item:item})
  }

  const handleCheck = () => {
    if(isChecked){
      const updatedArray = itemsMarkedForDeletion.filter( itemId => parseInt(item.id) !== itemId)
      setItemsMarkedForDeletion(updatedArray)
    }else{
      setItemsMarkedForDeletion(prev => [...prev, parseInt(item.id)])
    }
    setIsChecked(prev => !prev)
  }

  useEffect(() => {
    // console.log('Items checked:', itemsMarkedForDeletion)
  }, [itemsMarkedForDeletion])

  useEffect(()=>{
    if(itemsMarkedForDeletion.includes(parseInt(item.id))) setIsChecked(true) 
  },[])

  const bodyText = 'text-dark-charcoal-gray text-lg font-bold'
  const subtleText = `${isFlagged? 'text-zinc-700':'text-zinc-400'} font-sm mb-2 flex-1`
  const headerText = `${isFlagged? 'text-dark-charcoal-gray':'text-primary-action-base'} text-xl font-bold`
  
  return (
    <View className='flex-row'>
      <View className={` mx-2 flex-1 overflow-hidden  border-4 border-primary-action-base rounded-xl mb-4`}>
        <View className={`${isFlagged? 'bg-red-300':'bg-white'} p-2 flex flex-row ${show.status? '':''}`}>
          <View className='flex-1'>
            <Text className={headerText}>{name}</Text>
            <Text className={subtleText}>Item ID: {uid}</Text>
            <Text className={bodyText}>Amount: <Text className='text-dark-charcoal-gray text-lg font-normal'>{amount}</Text></Text>
          </View>
          <View className='flex-0 flex-col'>
            <View className='flex-1 flex-row mb-2'>
              <Pressable onPress={() => handleEdit(item)} className='bg-primary-action-base min-w-[44] min-h-[44] max-h-[60] rounded-lg flex  justify-center items-center mr-8 py-4'>
                <MaterialIcons name='edit' size={24} color={'white'} />
                <Text className='text-base text-white font-bold'>Edit</Text>
              </Pressable>
              <Pressable onPress={handleFlag} className='min-w-[44] flex justify-center items-center min-h-[44] max-h-[60] rounded-lg border-2 border-red-300 py-4'>
                <MaterialIcons name='flag' size={24} color='#333333' />
                {isFlagged? <Text className='text-base'>Ignore</Text>:<Text className='text-base'>Flag</Text>}
              </Pressable>
            </View>
            {
              details && Object.keys(details).length > 0
              ? <Pressable className={`flex items-center justify-center min-w-[44] h-[44] border-2 border-light-cool-gray rounded-lg ${show.status? 'bg-light-cool-gray':'bg-transparent'}`} onPress={()=>setShow(previousShow => {return {status:!previousShow.status}})} > 
                  <Text className='text-base'>Details</Text>
                </Pressable>
              : null
            }
          </View>
        </View>
        <View className={`${show.status?'bg-light-cool-gray p-2':''} `}>
          { show.status && descriptors.map( descriptor => {
            return(
              <View key={descriptor[0]} className='flex flex-row mb-2'>
                <Text className={'text-dark-charcoal-gray font-bold'}>{descriptor[0]}: </Text>
                <Text className={'text-dark-charcoal-gray'}>{descriptor[1]}</Text>
              </View>
            )})
          }
        </View>
      </View>
      {
        deleteMode.status
        ? <View className='mr-4 justify-center '>
            <Pressable className='' onPress={handleCheck}>
              {
                isChecked
                ? <View className='size-8 border items-center justify-center bg-white rounded-lg'><Text>X</Text></View>
                : <View className='size-8 bg-white rounded-lg'></View>
              }
            </Pressable>
          </View>
        : null
      }
      
    </View>
    )
}