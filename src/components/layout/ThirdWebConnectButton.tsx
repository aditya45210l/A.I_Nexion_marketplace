"use client";
import {ThirdWebClient}  from "@/lib/thirdWebClient";
import { ConnectButton, useActiveWallet } from "thirdweb/react";
import { useTheme } from "next-themes";
import { createWallet } from "thirdweb/wallets";
import { useActiveAccount } from "thirdweb/react";

const wallets = [
  createWallet("io.metamask"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
  createWallet("com.trustwallet.app"),
  createWallet("com.okex.wallet"),
  createWallet("com.binance.wallet"),
];

  function ThirdWebConnectButton() {
  const { resolvedTheme } = useTheme();
  const wallet = useActiveWallet();
  const account = useActiveAccount();


// Assume you already have a thirdweb account object (e.g., from a connected wallet)
// const client = createThirdwebClient({
//   clientId: '5e55900bcfa9090da91b0bdd621088e8',
// });




// console.log("Active account:", account);
// console.log("Active wallet:", wallet);
// const signIn = async() =>{
//   const hash = await account?.signMessage({message:"hello world"});
// console.log("Active hash:", hash);
// }
  // if(!account) return <div>loading...</div>

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