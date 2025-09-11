"use client";
import { ThirdWebClient } from "@/lib/thirdWebClient";
import { ConnectButton } from "thirdweb/react";
import { useTheme } from "next-themes";

import { createWallet } from "thirdweb/wallets";

const wallets = [
  createWallet("io.metamask"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
  createWallet("com.trustwallet.app"),
  createWallet("com.okex.wallet"),
  createWallet("com.binance.wallet"),
];

export default function ThirdWebConnectButton() {
  const { resolvedTheme } = useTheme();
  return (
    <ConnectButton
      autoConnect={true}
      client={ThirdWebClient}
      connectModal={{
        title: "Sign in to MyApp",
        titleIcon: "https://example.com/logo.png",
        size: "compact",
      }}
      wallets={wallets}
      //   theme={resolvedTheme === "light" ? 'light' : 'dark'}
      theme={resolvedTheme === "light" ? "light" : "dark"}
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
      
    />
  );
}
