import { create } from "zustand";

export interface BasicAuth {
    apiKey:string,
    setApiKey:(value:string)=>void,
}

export const useChatStore = create<BasicAuth>((set) => ({
    apiKey:"",
    setApiKey:(value)=>set({apiKey:value})
}));