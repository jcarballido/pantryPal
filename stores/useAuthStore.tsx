import { create } from "zustand";
import { Session, User } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import { supabase } from "@/utilities/supabase";

interface AuthState {
  sessionData: Session | null,
  setSession: (sessionObj: Session) => void,
  user: User | null,
  setUser: (userData: User) => void,
  clearSession: ()=> void,
  clearUser: () => void,
  initialzeSession: () => Promise<void>
}

const useAuthStore = create<AuthState>()((set)=>({
  sessionData:null,
  setSession: (sessionObj) => set({sessionData:sessionObj}),
  user:null,
  setUser: (userData) => set({user:userData}),
  clearSession: () => set({sessionData:null}),
  clearUser: () => set({user:null}),
  initialzeSession: async() => {
    try {
      const sessionExists = await SecureStore.getItemAsync('session')
      if(sessionExists){
        const currentSession:Session = JSON.parse(sessionExists)
        const {data,error} = await supabase.auth.setSession({
          access_token: currentSession.access_token,
          refresh_token: currentSession.refresh_token
        })

        if(!error && data.session){
          const latestSession = data.session
          await SecureStore.setItemAsync('session',JSON.stringify(latestSession))
          set({sessionData:latestSession, user:latestSession.user})
        }else{
          await SecureStore.deleteItemAsync('session')
          throw error
        } 
      }

      supabase.auth.onAuthStateChange(async (event,session) => {
        if(session){
          await SecureStore.setItemAsync('session',JSON.stringify(session))
          set({sessionData:session, user:session.user})
        }else{
          await SecureStore.deleteItemAsync('session')
          set({sessionData:null,user:null})
        }
      })

    } catch (error) {
      console.log('Error checking for an initial session: ',error)
    }
  }
}))

export default useAuthStore