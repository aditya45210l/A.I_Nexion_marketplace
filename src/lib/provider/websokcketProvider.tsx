"use client";
import { useEffect } from "react";

import { Address, WalletClient } from "viem";
import { webSocketService, WsStatus } from "../websocket";
import { useState } from "react";

const WebsokcketProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<Address | null>(null);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const [wsStatus, setWsStatus] = useState<WsStatus>("Disconnected");

  // This effect runs once on mount to handle the WebSocket connection
  useEffect(() => {
    // Subscribe to status updates from our service
    webSocketService.addStatusListener(setWsStatus);
    // Tell the service to connect
    webSocketService.connect();

    // On cleanup, remove the listener
    return () => {
      webSocketService.removeStatusListener(setWsStatus);
    };
  }, []);

  return <div>{children}</div>;
};
export default WebsokcketProvider;
