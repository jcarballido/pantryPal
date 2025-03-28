export interface ItemData {
  name: string;
  amount: string;
  category: string;
  uid: string;
  id:string;
  details:{[key: string]: string};
  
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
  name: string;
  quantity: string;
  details: {[key:string]:string}
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
  name: string;
  quantity: string;
  details: string;
}

export interface NeededItem{
  id: string
  name: string;
  quantity: string;
  [key:string]: string
}