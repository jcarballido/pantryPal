import { NeededItem, ParsedItemData, ParsedNeededItemData } from '@/sharedTypes/ItemType'
import { create } from 'zustand'

type ID = ParsedItemData['id']

interface ItemState{
  allStoredItems: ParsedItemData[];
  shoppingList: ParsedNeededItemData[];
  savedCategories: string[];
  setSavedCategories: (data: string[]) => void;
  setShoppingList: (data: ParsedNeededItemData[]) => void;
  updateShoppingList: (updatedItem: ParsedNeededItemData)=> void;
  addToShoppingList: (neededItem: ParsedNeededItemData)=> void;
  deleteFromShoppingList: (idsToDeleteArray: number[])=> void;
  setStoredItems: (data: ParsedItemData[]) => void;
  updateStoredItems: (item: ParsedItemData) => void;
  addItems: (item: ParsedItemData) => void;
  deleteStoredItems: (idsToDeleteArray: number[]) => void;
  addCategory:  (category:string) => void;
  updatedCategory: (updatedCategory:  {oldCategory: string, update:string}) => void;
  deleteCategory: (categoryToDelete: string) => void;
}

const useItemStore = create<ItemState>()((set) => ({
  allStoredItems:[],
  shoppingList: [],
  savedCategories: [],
  setShoppingList: (data) => set({shoppingList:data}),
  setStoredItems: ( data ) => set({allStoredItems:data}),
  setSavedCategories: (data) => set({savedCategories: data}),
  updateStoredItems: ( item ) => set(( state ) => ({
    allStoredItems: state.allStoredItems.map( individualItem => individualItem.id === (item.id) ? item:individualItem)
  })),
  updateShoppingList: (neededItem) => set((state) => (
    {
      shoppingList:state.shoppingList.map( individualItem => JSON.stringify(individualItem.id) === (neededItem.id) ? neededItem:individualItem) 
    }
  )), 
  addItems:(item) => set((state) => ({allStoredItems:[...state.allStoredItems, item]})),
  addCategory : (category) => set((state)=>({savedCategories:[...state.savedCategories, category]})),
  addToShoppingList: (neededItem) => set((state)=> ({shoppingList:[...state.shoppingList, neededItem]})),
  deleteStoredItems:(itemIdsToDeleteArray)=>set((state) => ({
    allStoredItems: state.allStoredItems.filter( individualItem => !itemIdsToDeleteArray.includes(parseInt(individualItem.id)))
  })),
  deleteFromShoppingList:(idsToDelete) => set((state) => ({shoppingList:state.shoppingList.filter( individualItem => !idsToDelete.includes(parseInt(individualItem.id)))})),
  updatedCategory: (updatedCategory) => set((state) => ({
    savedCategories: state.savedCategories.map( savedCategory => updatedCategory.oldCategory === savedCategory ? updatedCategory.update:savedCategory)
  })),
  deleteCategory:(categoryToDelete)=> set((state)=>({
    savedCategories: []
  }))
}))

export default useItemStore