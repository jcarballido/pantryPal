import { create } from "zustand";
import { Session, User } from '@supabase/supabase-js'

interface AuthState {
  sessionData: Session | null,
  setSession: (sessionObj: Session) => void,
  user: User | null,
  setUser: (userData: User) => void
}

const useAuthStore = create<AuthState>()((set)=>({
  sessionData:null,
  setSession: (sessionObj) => set({sessionData:sessionObj}),
  user:null,
  setUser: (userData) => set({user:userData})
}))

export default useAuthStore