export interface ItemData {
  name: string;
  id: string;
  amount: string | number;
  category:string;
  [key: string]:string | number;
}