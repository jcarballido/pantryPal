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
  loading: boolean|null,
  initializeSession: () => Promise<void>
}

const useAuthStore = create<AuthState>()((set)=>({
  sessionData:null,
  setSession: (sessionObj) => set({sessionData:sessionObj}),
  user:null,
  loading:null,
  setUser: (userData) => set({user:userData}),
  clearSession: () => set({sessionData:null}),
  clearUser: () => set({user:null}),
  initializeSession: async() => {
    try {
      set({ loading: true })
      const sessionExists = await SecureStore.getItemAsync('session')
      if(sessionExists){
        console.log('Existing session found.')
        const currentSession:Session = JSON.parse(sessionExists)
        const {data,error} = await supabase.auth.setSession({
          access_token: currentSession.access_token,
          refresh_token: currentSession.refresh_token
        })

        if(!error && data.session){
          console.log('New session set.')
          const latestSession = data.session
          await SecureStore.setItemAsync('session',JSON.stringify(latestSession))
          set({sessionData:latestSession, user:latestSession.user})
        }else{
          console.log('Existing session expired.')
          await SecureStore.deleteItemAsync('session')
          throw error
        } 
      }

      supabase.auth.onAuthStateChange(async (event,session) => {
        console.log('Auth state change detected: ', event)
        if(session){
          await SecureStore.setItemAsync('session',JSON.stringify(session))
          set({sessionData:session, user:session.user})
        }else{
          set({loading:true})
          console.log('Session not detected in state change response')
          await SecureStore.deleteItemAsync('session')
          set({sessionData:null,user:null, loading:false})
        }
      })

    } catch (error) {
      console.log('Error checking for an initial session: ',error)
    } finally {
      console.log('Auth initialization complete')
        set({ loading: false })
    }
  }
}))

export default useAuthStore