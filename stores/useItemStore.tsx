import { ParsedItemData } from '@/sharedTypes/ItemType'
import { create } from 'zustand'

type Id = ParsedItemData['id']

interface ItemState{
  allStoredItems: ParsedItemData[];
  setStoredItems: (data: ParsedItemData[]) => void;
  updateStoredItems: (item: ParsedItemData) => void;
  addStoredItems: (item: ParsedItemData) => void;
  deleteStoredItems: (id: Id) => void;
}

const useItemStore = create<ItemState>()((set) => ({
  allStoredItems:[],
  setStoredItems: ( data ) => set({allStoredItems:data}),
  updateStoredItems: ( item ) => set(( state ) => ({
    allStoredItems: state.allStoredItems.map( individualItem =>
      individualItem.id === item.id ? item:individualItem 
    )
  })),
  addStoredItems:(item) => set((state) => ({allStoredItems:[...state.allStoredItems, item]})),
  deleteStoredItems:(itemId)=>set((state) => ({
    allStoredItems: state.allStoredItems.filter( individualItem => individualItem.id !== itemId)
  }))
}))

export default useItemStore