"use client";
import { ThirdWebClient } from "@/lib/thirdWebClient";

import { webSocketService } from "@/lib/websocket";
// CHAPTER 3: Authentication utilities
import {
  generateSessionKey,
  getStoredSessionKey,
  storeSessionKey,

  clearData,
} from "@/lib/yellowUtils";
import { createWallet } from "thirdweb/wallets";

import { ConnectButton } from "thirdweb/react";
import { useBasicAuth } from "@/lib/stores/AuthStore";


declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}



export function TestConnectButton() {
    // const [wsStatus, setWsStatus] = useState<WsStatus>("Disconnected");
    const {

      setSessionKey,

      setWsStatus,
  
    } = useBasicAuth();
  const wallets = [
    createWallet("io.metamask"),
    createWallet("me.rainbow"),
    createWallet("io.rabby"),
    createWallet("io.zerion.wallet"),
    createWallet("com.trustwallet.app"),
    createWallet("com.okex.wallet"),
    createWallet("com.binance.wallet"),
  ];

  return (
    <ConnectButton
      // autoConnect={true}
      
      client={ThirdWebClient}
      connectModal={{
        title: "Sign in to MyApp",
        titleIcon: "https://example.com/logo.png",
        size: "compact",
      }}
      wallets={wallets}
      //   theme={resolvedTheme === "light" ? 'light' : 'dark'}
      connectButton={{
        style: {
          height: "40px",
          minWidth: "120px",
          fontSize: "1rem",
          fontFamily: "Geist Mono, monospace",
          borderRadius: "0px",
          padding: "0",
        },
      }}
      onDisconnect={() => {
        console.log("Disconnected");
        clearData();
        webSocketService.disconnect();
        console.log("data cleared");
      }}
      onConnect={() =>{
        // console.log("Connected");
           const existingSessionKey = getStoredSessionKey();
            if (existingSessionKey) {
              setSessionKey(existingSessionKey);
            } else {
              const newSessionKey = generateSessionKey();
              storeSessionKey(newSessionKey);
              setSessionKey(newSessionKey);
            }
            // const jwt_token = localStorage.getItem('your_app_name_jwt_token');
            // if(!jwt_token){

            // }
        
            webSocketService.addStatusListener(setWsStatus);
            webSocketService.connect();
            console.log("webSocketService status : ",webSocketService.status);

      }}
    />
    // <ConnectButton />
  );
}
