import { create } from "zustand";
import { Session, User } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import { supabase } from "@/utilities/supabase";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from 'expo-web-browser'
import * as QueryParams from "expo-auth-session/build/QueryParams";


interface AuthState {
  // sessionData: Session | null,
  // setSession: (sessionObj: Session) => void,
  user: User | null,
  setUser: (userData: User) => void,
  // clearSession: ()=> void,
  clearUser: () => void,
  loading: boolean|null,
  initializeSession: () => Promise<void>,
  passwordSignIn: (email:string,password:string) => Promise<void>,
  performOAuth: () => Promise<void>,
  signUpWithEmail: (email:string,password:string) => Promise<{user: User|null, session:Session|null}>
}

const useAuthStore = create<AuthState>()((set) => {

  return {
    // sessionData:null,
    // setSession: (sessionObj) => set({sessionData:sessionObj}),
    user:null,
    loading:null,
    setUser: (userData) => set({user:userData}),
    // clearSession: () => set({sessionData:null}),
    clearUser: () => set({user:null}),
    initializeSession: async() => {
      try {
        set({ loading: true })

        // const sessionExists = await SecureStore.getItemAsync('session')
        // if(sessionExists){
        //   console.log('Existing session found.')
        //   const currentSession:Session = JSON.parse(sessionExists)
        //   const {data,error} = await supabase.auth.setSession({
        //     access_token: currentSession.access_token,
            // refresh_token: currentSession.refresh_token
          // })


          // if(!error && data.session){
          //   console.log('New session set.')
          //   const latestSession = data.session
          //   await SecureStore.setItemAsync('session',JSON.stringify(latestSession))
          //   set({sessionData:latestSession, user:latestSession.user})
          // }else{
          //   console.log('Existing session expired.')
          //   await SecureStore.deleteItemAsync('session')
          //   throw error
          // } 
        // }else{
        //   const {data} = await supabase.auth.getSession()
        //   if(data) {
        //     console.log('No session data locally stored. Checked with \'getsession\': ',data)
        //   }else{
        //     console.log('No session found either locally or on the supabase auth server from \'getSession\'.')
        //   }
        // }

        const { data, error } = await supabase.auth.getSession()
        if(error) throw error
        if(data.session) {
          set({user:data.session.user})
        }

        supabase.auth.onAuthStateChange(async (event,session) => {
          console.log('Auth state change detected: ', event)
          if(session){
          //   await SecureStore.setItemAsync('session',JSON.stringify(session))
            set({user:session.user})
          }else{
            set({loading:true})
            // console.log('Session not detected in state change response')
            // await SecureStore.deleteItemAsync('session')
            set({user:null, loading:false})
          }
        })

      } catch (error) {
        console.log('Error checking for an initial session: ',error)
      } finally {
        console.log('Auth initialization complete')
          set({ loading: false })
      }
    },
    passwordSignIn: async(email,password) => {
      try {
        const {data, error} = await supabase.auth.signInWithPassword({
          email,password
        })
        if(error) throw error
        if(!data.session) throw new Error('No session returned')
        if(data.session){
          set({user: data.user})
          // await SecureStore.setItemAsync('session',JSON.stringify(data.session))
        }
      } catch (error) {
        throw error
      }
    },
    performOAuth: async() => {
      const createSessionFromUrl = async (url: string) => {
        const { params, errorCode } = QueryParams.getQueryParams(url);
        if (errorCode) {
          console.log('Error in query params:', errorCode)
          throw new Error(errorCode)
        };
        const { access_token, refresh_token } = params;
        if (!access_token) {
          console.log('No access token from createSessionFromURL.')
          return
        };
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (error) {
          console.log('Error from supabase setSession:', error)  
          throw error
        };
        return data.session;
      };

      const redirectTo = makeRedirectUri({path:'login'});
    
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect:true,
          queryParams: {
            prompt: 'select_account'
          },
        },
      });

      if (error) {
        console.log('Error from signInWithOAuth:', error)
        throw error
      };
      console.log("Opening browser...")

      try{
        const res = await WebBrowser.openAuthSessionAsync(
          data.url ,
          redirectTo
        );
        if (res.type === "success") {
          const { url } = res;
          const sessionData = await createSessionFromUrl(url);
          if(sessionData) {
            set({user:sessionData.user})
            // await SecureStore.setItemAsync('session', JSON.stringify(sessionData))
          }
        }
      }catch(e){
        console.log('Error opening Auth session:',e)
      }
    },
    signUpWithEmail: async(email: string, password: string) => {
    try {
      const {data,error} = await supabase.auth.signUp({
        email,password
      })
      console.log('Data recieved from user sign up:', data)
      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  } 
  }
})

export default useAuthStore