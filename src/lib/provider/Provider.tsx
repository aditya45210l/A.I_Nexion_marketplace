"use client";
// import { CampProvider } from "@camp/origin";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { WagmiProvider } from "wagmi";

import { RainbowKitProvider,darkTheme } from "@rainbow-me/rainbowkit";
import config from "../RainbowKitConfig";

const queryClient = new QueryClient();
// const apollo = new ApolloClient({
//   uri: import.meta.env.VITE_SUBGRAPH_URL,
//   cache: new InMemoryCache(),
// });
export function Provider({ children }: { children: ReactNode }) {
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({borderRadius:'none',fontStack:'system'}) }>

            {/* <ApolloProvider client={apollo}> */}
            {children}
            {/* </ApolloProvider> */}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}