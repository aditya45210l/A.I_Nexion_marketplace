// "use client";
// import { ThirdWebClient } from "@/lib/thirdWebClient";
// import { ConnectButton } from "thirdweb/react";
// import { useTheme } from "next-themes";
// import { createWallet } from "thirdweb/wallets";
// import { useState, useEffect } from 'preact/hooks';
// import { createWalletClient, custom, type Address, type WalletClient, toAccount } from 'viem';
// import { mainnet } from 'viem/chains';

// import {
//     createAuthRequestMessage,
//     createAuthVerifyMessage,
//     createEIP712AuthMessageSigner,
//     parseAnyRPCResponse,
//     RPCMethod,
//     type AuthChallengeResponse,
//     type AuthRequestParams,
//     // ... other imports
// } from '@erc7824/nitrolite';

// import { webSocketService, type WsStatus } from '@/lib/websocket';
// import {
//     generateSessionKey,
//     getStoredSessionKey,
//     storeSessionKey,
//     removeSessionKey,
//     storeJWT,
//     removeJWT,
//     getStoredJWT,
//     type SessionKey,
// } from '@/lib/yellowUtils';

// declare global {
//     interface Window {
//         ethereum?: any;
//     }
// }

// const getAuthDomain = () => ({
//     name: 'Nexus',
// });

// const AUTH_SCOPE = 'nexus.app';
// const APP_NAME = 'Nexus';
// const SESSION_DURATION = 3600; // 1 hour

// const wallets = [
//   createWallet("io.metamask"),
//   createWallet("me.rainbow"),
//   createWallet("io.rabby"),
//   createWallet("io.zerion.wallet"),
//   createWallet("com.trustwallet.app"),
//   createWallet("com.okex.wallet"),
//   createWallet("com.binance.wallet"),
// ];
// import { viemAdapter } from "thirdweb/adapters/viem";
// import {
//   useActiveWallet,
//   useActiveAccount,
  
// } from "thirdweb/react";
// import { ethereum } from "thirdweb/chains";

// export default function ThirdWebConnectButton() {
//   const { resolvedTheme } = useTheme();


//   const [sessionKey, setSessionKey] = useState<SessionKey | null>(null);
//   const [wsStatus, setWsStatus] = useState('Disconnected');
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isAuthAttempted, setIsAuthAttempted] = useState(false);

// const wallet = useActiveWallet();
// const account = useActiveAccount();

// const walletClient = viemAdapter.wallet.toViem({
//   wallet,
//   ThirdWebClient,
//   chain: ethereum, // or your desired chain
// });

//   useEffect(() => {
//     const existingSessionKey = getStoredSessionKey();
//     if (existingSessionKey) {
//         setSessionKey(existingSessionKey);
//     } else {
//         const newSessionKey = generateSessionKey();
//         storeSessionKey(newSessionKey);
//         setSessionKey(newSessionKey);
//     }

//     webSocketService.addStatusListener(setWsStatus);
//     webSocketService.connect();

//     return () => {
//         webSocketService.removeStatusListener(setWsStatus);
//     };
//   }, []);

//   return (
//     <ConnectButton
//       autoConnect={true}
//       client={ThirdWebClient}
//       connectModal={{
//         title: "Sign in to MyApp",
//         titleIcon: "https://example.com/logo.png",
//         size: "compact",
//       }}
//       wallets={wallets}
//       theme={resolvedTheme === "light" ? "light" : "dark"}
//       connectButton={{
//         style: {
//           height: "40px",
//           minWidth: "120px",
//           fontSize: "1rem",
//           fontFamily: "Geist Mono, monospace",
//           borderRadius: "0px",
//           padding: "0",
//         },
//       }}
//       auth={{
//         async isLoggedIn() {
//           const jwtToken = getStoredJWT();
//           return !!jwtToken;
//         },
//         async getLoginPayload({ address }) {
//           // You can also connect to WebSocket here if needed
//           if (webSocketService.status !== 'Connected') {
//               webSocketService.connect();
//           }

//           const expireTimestamp = String(Math.floor(Date.now() / 1000) + SESSION_DURATION);
//           const authParams = {
//               wallet: address,
//               participant: sessionKey?.address,
//               app_name: APP_NAME,
//               expire: expireTimestamp,
//               scope: AUTH_SCOPE,
//               application: address,
//               allowances: [],
//           };
//           return authParams;
//         },
//         async doLogin(params) {
//           const { wallet, payload } = params;
          
//           // Wait for WebSocket connection if it's not ready
//           const status = await new Promise(resolve => {
//             const checkStatus = (s: string) => {
//               if (s === 'Connected' || s === 'Error') {
//                 webSocketService.removeStatusListener(checkStatus);
//                 resolve(s);
//               }
//             };
//             webSocketService.addStatusListener(checkStatus);
//           });
//           if (status !== 'Connected') {
//             throw new Error("WebSocket connection failed.");
//           }

//           // const walletClient = createWalletClient({
//           //   chain: wallet.chain,
//           //   transport: custom(wallet.provider),
//           //   account: toAccount(wallet.address),
//           // });

//           return new Promise((resolve, reject) => {
//             const handleMessage = async (data: any) => {
//               const response = parseAnyRPCResponse(JSON.stringify(data));
              
//               if (response.method === RPCMethod.AuthChallenge) {
//                 const challengeResponse = response as AuthChallengeResponse;
//                 const eip712Signer = createEIP712AuthMessageSigner(walletClient, payload, getAuthDomain());
                
//                 try {
//                   const authVerifyPayload = await createAuthVerifyMessage(eip712Signer, challengeResponse);
//                   webSocketService.send(authVerifyPayload);
//                 } catch (error) {
//                   console.error('Signature rejected or failed:', error);
//                   webSocketService.removeMessageListener(handleMessage);
//                   reject(new Error('Signature failed.'));
//                 }
//               } else if (response.method === RPCMethod.AuthVerify) {
//                 webSocketService.removeMessageListener(handleMessage);
//                 if (response.params?.success) {
//                   storeJWT(response.params.jwtToken);
//                   resolve({ success: true });
//                 } else {
//                   removeJWT();
//                   removeSessionKey();
//                   reject(new Error(response.params.error));
//                 }
//               } else if (response.method === RPCMethod.Error) {
//                 webSocketService.removeMessageListener(handleMessage);
//                 removeJWT();
//                 removeSessionKey();
//                 reject(new Error(response.params.error));
//               }
//             };
//             webSocketService.addMessageListener(handleMessage);

//             // Send the initial auth request message
//             createAuthRequestMessage(payload).then(authRequestMsg => {
//               webSocketService.send(authRequestMsg);
//             });
//           });
//         },
//         async doLogout() {
//           removeJWT();
//           removeSessionKey();
//         },
//       }}
//     />
//   );
// }