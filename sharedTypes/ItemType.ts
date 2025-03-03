export interface ItemData {
  name: string;
  amount: string;
  category: string;
  uid: string;
  [key: string]: string ;
}

interface NeededItemData{
  name: string;
  quantity: string;
  [key:string]: string;
}

export interface ParsedItemData {
  id:string;
  value: ItemData;
}

export interface ParsedNeededItemData {
  id: string;
  value: NeededItemData;
}

export interface RawItemData{
  id: string;
  value: string;
}

export interface RawShoppingListItemData {
  id: string;
  value: string;
}

export interface NeededItem{
  id: string
  name: string;
  quantity: string;
  [key:string]: string
}