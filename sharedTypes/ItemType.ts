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
  name: string;
  category: string;
  amount: string;
  uid?:string;
  details: { [key:string]:string }
}

export interface ParsedNeededItemData {
  id: string;
  value: NeededItemData;
}

export interface RawItemData{
  id: string;
  name: string;
  uid:string,
  category: string;
  amount: string;
  details: string;
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