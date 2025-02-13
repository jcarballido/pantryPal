export interface ItemData {
  name: string;
  amount: string | number;
  category:string;
  uid:string;
  [key: string]:string | number ;
}

export interface ParsedItemData {
  id:string;
  value:ItemData;
}

export interface RawItemData{
  id:string;
  value:string;
}