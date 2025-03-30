import { View, Text, Modal } from 'react-native'
import React, { SetStateAction } from 'react'

interface Props{
  saveModalVisible: {status: boolean};
  setSaveModalVisible: React.Dispatch<SetStateAction<{status: boolean}>>;
  itemsMarkedForSaving: number[]
}

const SaveModal = ({saveModalVisible, setSaveModalVisible, itemsMarkedForSaving}: Props) => {

  console.log('Items for saving:', itemsMarkedForSaving)

  return (
    <Modal visible={saveModalVisible.status} onRequestClose={()=>setSaveModalVisible({status: false})}>
      <Text>SaveModal</Text>
    </Modal>
  )
}

export default SaveModal