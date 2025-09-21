import { create } from "zustand";
import { type SessionKey } from "../yellowUtils";
import { WsStatus } from "../websocket";

export interface BasicAuth {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  sessionKey: SessionKey | null;
  setSessionKey: (value: SessionKey | null) => void;
  balances:Record<string, string> | null;
  setBalances:(value:Record<string, string> | null)=>void;
  wsStatus:WsStatus,
  setWsStatus:(value:WsStatus)=>void,
  isAuthAttempted:boolean,
  setIsAuthAttempted:(value:boolean)=>void,
}

export const useBasicAuth = create<BasicAuth>((set) => ({
  // bears: 0,
  isAuthenticated: false,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  sessionKey: null,
  setSessionKey: (value) => set({ sessionKey: value }),
  balances:null,
  setBalances:(value)=>set({balances:value}),
  wsStatus:"Disconnected",
  setWsStatus:(value)=>set({wsStatus:value}),
  isAuthAttempted:false,
  setIsAuthAttempted:(value)=>set({isAuthAttempted:value})
  // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 }),
  // updateBears: (newBears) => set({ bears: newBears }),
}));
