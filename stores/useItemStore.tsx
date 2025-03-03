import { NeededItem, ParsedItemData, ParsedNeededItemData } from '@/sharedTypes/ItemType'
import { create } from 'zustand'

type ID = ParsedItemData['id']

interface ItemState{
  allStoredItems: ParsedItemData[];
  shoppingList: ParsedNeededItemData[];
  setShoppingList: (data: ParsedNeededItemData[]) => void;
  updateShoppingList: (updatedItem: ParsedNeededItemData)=> void;
  addToShoppingList: (neededItem: ParsedNeededItemData)=> void;
  deleteFromShoppingList: (idsToDeleteArray: number[])=> void;
  setStoredItems: (data: ParsedItemData[]) => void;
  updateStoredItems: (item: ParsedItemData) => void;
  addItems: (item: ParsedItemData) => void;
  deleteStoredItems: (idsToDeleteArray: number[]) => void;
}

const useItemStore = create<ItemState>()((set) => ({
  allStoredItems:[],
  shoppingList: [],
  setShoppingList: (data) => set({shoppingList:data}),
  setStoredItems: ( data ) => set({allStoredItems:data}),
  updateStoredItems: ( item ) => set(( state ) => ({
    allStoredItems: state.allStoredItems.map( individualItem => JSON.stringify(individualItem.id) === (item.id) ? item:individualItem)
  })),
  updateShoppingList: (neededItem) => set((state) => (
    {
      shoppingList:state.shoppingList.map( individualItem => JSON.stringify(individualItem.id) === (neededItem.id) ? neededItem:individualItem) 
    }
  )), 
  addItems:(item) => set((state) => ({allStoredItems:[...state.allStoredItems, item]})),
  addToShoppingList: (neededItem) => set((state)=> ({shoppingList:[...state.shoppingList, neededItem]})),
  deleteStoredItems:(itemIdsToDeleteArray)=>set((state) => ({
    allStoredItems: state.allStoredItems.filter( individualItem => !itemIdsToDeleteArray.includes(parseInt(individualItem.id)))
  })),
  deleteFromShoppingList:(idsToDelete) => set((state) => ({shoppingList:state.shoppingList.filter( individualItem => !idsToDelete.includes(parseInt(individualItem.id)))}))
}))

export default useItemStore