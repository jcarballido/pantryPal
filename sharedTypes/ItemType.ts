export interface DbRecordStoredItem {
  id: string;
  name: string;
  amount: string;
  category: string;
  details: string;
  uid:string,
}

export interface ParsedRecordStoredItem extends Omit<DbRecordStoredItem,'details'> {
  details: Record<string, string>
}

export interface DbRecordShoppingListItem extends Omit<DbRecordStoredItem, 'category'|'uid'> {}

export interface ParsedRecordShoppingListItem extends Omit<DbRecordShoppingListItem,'details'> {
  details:Record<string,string>
}

export interface DbRecordStoredCategory{
  id:string;
  name:string
}
// export interface ItemData {
//   name: string;
//   amount: string;
//   category: string;
//   uid: string;
//   id:string;
//   details:{[key: string]: string};
  
// }

// interface NeededItemData{
//   name: string;
//   amount: string;
//   [key:string]: string;
// }

// export interface ParsedItemData {
//   id:string;
//   name: string;
//   category: string;
//   amount: string;
//   uid?:string;
//   details: { [key:string]:string }
// }

// export interface ParsedNeededItemData {
//   id: string;
//   name: string;
//   amount: string;
//   details: {[key:string]:string}
// }

// export interface RawItemData{
//   id: string;
//   name: string;
//   uid:string,
//   category: string;
//   amount: string;
//   details: string;
// }

// export interface RawShoppingListItemData {
//   id: string;
//   name: string;
//   amount: string;
//   details: string;
// }

// export interface NeededItem{
//   id: string
//   name: string;
//   amount: string;
//   [key:string]: string
// }