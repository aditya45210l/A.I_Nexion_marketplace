import { create } from "zustand";

export interface BasicAuth {
  privateKey: string | null;
  proxyAddress: string | null;
  jwt_auth: string | null;
  proxy_exp_time: string | null;
  setPrivateKey: (value: string) => void;
  setProxyAddress: (value: string) => void;
  setProxy_exp_time: (value: string) => void;
  setJwt_auth: (value: string) => void;
}

export const useChatStore = create<BasicAuth>((set) => ({
  privateKey: null,
  setPrivateKey: (value) => set({ privateKey: value }),
  proxyAddress: null,
  setProxyAddress: (value) => set({ proxyAddress: value }),
  proxy_exp_time: null,
  setProxy_exp_time: (value) => set({ proxy_exp_time: value }),
  jwt_auth: null,
  setJwt_auth: (value) => set({ jwt_auth: value }),
}));
