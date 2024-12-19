import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
import { ItemData } from '@/sharedTypes/ItemType';


const data:ItemData[] = [
  {name:'Milk', id: nanoid(10), amount:'Full',purchased:'11-12-2024',opened:'11-15-2024', expires:'11-19-2024',category:'Category C'},
  {name:'cheetos', id: nanoid(10), amount:'1/2',purchased:'11-12-2024',opened:'11-15-2024',category:'Category R'},
  {name:'yogurt', id: nanoid(10), amount:'10%',category:'Category A', type:'Yogurt'},
  {name:'garbage bags', id: nanoid(10), amount:'half', category:'Category A'},
  {name:'Waffles', id: nanoid(10), amount:'3',category:'Category R'},
  {name:'Olive oil', id: nanoid(10), amount:'Almost empty',brand:'Aldi', category:'Category B'},
  {name:'Olive oil', id: nanoid(10), amount:'Almost empty',brand:'Aldi', category:'Category b'},  
  {name:'Olive oil', id: nanoid(10), amount:'Almost empty',brand:'Aldi', category:'Category E'},  
]

export default data