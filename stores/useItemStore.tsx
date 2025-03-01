import { ParsedItemData } from '@/sharedTypes/ItemType'
import { create } from 'zustand'

type ID = ParsedItemData['id']

interface ItemState{
  allStoredItems: ParsedItemData[];
  setStoredItems: (data: ParsedItemData[]) => void;
  updateStoredItems: (item: ParsedItemData) => void;
  addItems: (item: ParsedItemData) => void;
  deleteStoredItems: (idsToDeleteArray: number[]) => void;
}

const useItemStore = create<ItemState>()((set) => ({
  allStoredItems:[],
  setStoredItems: ( data ) => set({allStoredItems:data}),
  updateStoredItems: ( item ) => set(( state ) => ({
    allStoredItems: state.allStoredItems.map( individualItem => {
      console.log('Individual Item:', typeof(individualItem.id))
      console.log('Item id:', typeof(item.id))
      console.log('Ind item === item id:', individualItem.id === item.id)

      return JSON.stringify(individualItem.id) === (item.id) ? item:individualItem 
    })
  })),
  addItems:(item) => set((state) => ({allStoredItems:[...state.allStoredItems, item]})),
  deleteStoredItems:(itemIdsToDeleteArray)=>set((state) => ({
    allStoredItems: state.allStoredItems.filter( individualItem => !itemIdsToDeleteArray.includes(parseInt(individualItem.id)))
  }))
}))

export default useItemStore