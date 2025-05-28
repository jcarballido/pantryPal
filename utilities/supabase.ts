import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto' // required for React Native

const supabaseUrl = process.env.EXPO_BASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error("Missing Supabase environment variables");
// }

export const supabase = !supabaseUrl || !supabaseAnonKey ? null: createClient(supabaseUrl, supabaseAnonKey)
