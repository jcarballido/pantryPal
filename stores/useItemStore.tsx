import { ParsedRecordStoredItem, ParsedRecordShoppingListItem, DbRecordStoredCategory } from '@/sharedTypes/ItemType'
import { create } from 'zustand'

type ID = ParsedRecordStoredItem['id']

interface ItemState{
  allStoredItems: ParsedRecordStoredItem[];
  shoppingList: ParsedRecordShoppingListItem[];
  savedCategories: {id:string,name:string}[];
  reservedCategories: string[];
  setSavedCategories: (data: {id:string,name:string}[]) => void;
  setShoppingList: (data: ParsedRecordShoppingListItem[]) => void;
  setReservedCategories: (data:string[]) => void;
  updateShoppingList: (updatedItem: ParsedRecordShoppingListItem)=> void;
  addToShoppingList: (neededItem: ParsedRecordShoppingListItem)=> void;
  deleteFromShoppingList: (idsToDeleteArray: number[])=> void;
  setStoredItems: (data: ParsedRecordStoredItem[]) => void;
  updateStoredItems: (item: ParsedRecordStoredItem) => void;
  addStoredItems: (item: ParsedRecordStoredItem) => void;
  addListItems: (itemArr: ParsedRecordStoredItem[]) => void;
  deleteStoredItems: (idsToDeleteArray: number[]) => void;
  // addCategory:  (category:string) => void;
  // updatedCategory: (updatedCategory:  {oldCategory: string, update:string}) => void;
  deleteCategory: (categoryIdsToDelete: string[]) => void;
}

const useItemStore = create<ItemState>()((set) => ({
  allStoredItems:[],
  shoppingList: [],
  savedCategories: [],
  reservedCategories:[],
  setShoppingList: (data) => set({shoppingList:data}),
  setStoredItems: ( data ) => set({allStoredItems:data}),
  setSavedCategories: (data) => set({savedCategories: data}),
  setReservedCategories: (data) => set({reservedCategories:data}),
  updateStoredItems: ( item ) => set(( state ) => ({
    allStoredItems: state.allStoredItems.map( individualItem => individualItem.id === (item.id) ? item:individualItem)
  })),
  updateShoppingList: (neededItem) => set((state) => (
    {
      shoppingList:state.shoppingList.map( individualItem => JSON.stringify(individualItem.id) === (neededItem.id) ? neededItem:individualItem) 
    }
  )), 
  addStoredItems:(item) => set((state) => ({allStoredItems:[...state.allStoredItems, item]})),
  addListItems: (itemArr) => set((state) => ({allStoredItems:[...state.allStoredItems,...itemArr]})),
  // addCategory : (category) => set((state)=>({savedCategories:[...state.savedCategories, category]})),
  addToShoppingList: (neededItem) => set((state)=> ({shoppingList:[...state.shoppingList, neededItem]})),
  deleteStoredItems:(itemIdsToDeleteArray)=>set((state) => ({
    allStoredItems: state.allStoredItems.filter( individualItem => !itemIdsToDeleteArray.includes(parseInt(individualItem.id)))
  })),
  deleteFromShoppingList:(idsToDelete) => set((state) => ({shoppingList:state.shoppingList.filter( individualItem => !idsToDelete.includes(parseInt(individualItem.id)))})),
  // updatedCategory: (updatedCategory) => set((state) => ({
  //   savedCategories: state.savedCategories.map( savedCategory => updatedCategory.oldCategory === savedCategory ? updatedCategory.update:savedCategory)
  // })),
  deleteCategory:(categoriesToDelete)=> set((state)=>({
    savedCategories: state.savedCategories.filter(cat => !categoriesToDelete.includes(cat.id))
  }))
}))

export default useItemStore