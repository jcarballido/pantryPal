export interface ItemData {
  name: string;
  amount: string;
  category:string;
  uid:string;
  [key: string]:string ;
}

export interface ParsedItemData {
  id:string;
  value:ItemData;
}

export interface RawItemData{
  id:string;
  value:string;
}