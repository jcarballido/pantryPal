export interface ItemData {
  name: string;
  id: string;
  amount: string | number;
  category:string;
  [key: string]:string | number;
}

export interface ItemDataProto {
  id:string;
  value:ItemData;
}