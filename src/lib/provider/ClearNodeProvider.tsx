"use client";
import { ReactNode } from "react";
import { useState, useEffect } from "react";

import { ThirdWebClient } from "@/lib/thirdWebClient";

import {
  createAuthRequestMessage,
  createAuthVerifyMessage,
  createEIP712AuthMessageSigner,
  parseAnyRPCResponse,
  RPCMethod,
  type AuthChallengeResponse,
  type AuthRequestParams,
  createECDSAMessageSigner,
  createGetLedgerBalancesMessage,
  type GetLedgerBalancesResponse,
  type BalanceUpdateResponse,
} from "@erc7824/nitrolite";

import { webSocketService } from "@/lib/websocket";

import {
  // generateSessionKey,
  // getStoredSessionKey,
  // storeSessionKey,
  // removeSessionKey,
  storeJWT,
  // removeJWT,
  // type SessionKey,
} from "@/lib/yellowUtils";

import { viemAdapter } from "thirdweb/adapters/viem";
import { ethereum } from "thirdweb/chains";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { useBasicAuth } from "@/lib/stores/AuthStore";
// import { useQuery, useQueryClient } from "@tanstack/react-query";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

// CHAPTER 3: EIP-712 domain for Nexus authentication
const getAuthDomain = () => ({
  name: "Nexus",
});

// CHAPTER 3: Authentication constants
const AUTH_SCOPE = "nexus.app";
const APP_NAME = "Nexus";
const SESSION_DURATION = 3600; // 1 hour

const ClearNodeProvider = ({ children }: { children: ReactNode }) => {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const [isAuthAttempted, setIsAuthAttempted] = useState(false);
  const [sessionExpireTimestamp, setSessionExpireTimestamp] =
    useState<string>("");
  const [loadingBalances, setIsLoadingBalances] = useState(false);
  const [mounted, setMounted] = useState(false);
  const {
    isAuthenticated,
    setIsAuthenticated,
    sessionKey,

    setBalances,
  } = useBasicAuth();

  // const {
  //   data: tasks,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["fetchBalance"],
  //   queryFn:() => fetchBalances(account?.address),
  //   enabled: !!account,
  //   refetchInterval: 1000,
  // });

  const walletClient = account
    ? viemAdapter.walletClient.toViem({
        account,
        client: ThirdWebClient,
        chain: ethereum,
      })
    : null;

  // CHAPTER 3: Auto-trigger authentication when conditions are met
  useEffect(() => {
    if (
      account &&
      sessionKey &&
      webSocketService.status === "Connected" &&
      !isAuthenticated &&
      !isAuthAttempted
    ) {
      // const jwtToken = localStorage.getItem("your_app_name_jwt_token");
      // if (jwtToken) {
      //   console.log("jwtToken: ", jwtToken);
      //   createAuthVerifyMessageWithJWT(jwtToken).then((payload) => {
      //     webSocketService.send(payload);
      //   });

      // }

      const now = Math.floor(Date.now() / 1000);

      const expTime = localStorage.getItem("SESSION_EXPIRE_KEY");

      if (Number(expTime) > now) {
        console.log("Session still valid, skipping auth request");
        return;
      }

      console.log("now: ", now);

      setIsAuthAttempted(true);

      // Generate fresh timestamp for this auth attempt
      const expireTimestamp = String(
        Math.floor(Date.now() / 1000) + SESSION_DURATION
      );
      localStorage.setItem("SESSION_EXPIRE_KEY", expireTimestamp);
      setSessionExpireTimestamp(expireTimestamp);

      const authParams: AuthRequestParams = {
        address: account.address as `0x${string}`,
        session_key: sessionKey.address,
        app_name: APP_NAME,
        expire: expireTimestamp,
        scope: AUTH_SCOPE,
        application: account.address as `0x${string}`,
        allowances: [],
      };

      createAuthRequestMessage(authParams).then((payload) => {
        webSocketService.send(payload);
      });
    }
  }, [
    account,
    // webSocketService.status,
    isAuthenticated,
    isAuthAttempted,
    sessionKey,
  ]);

  // CHAPTER 4: Automatically fetch balances when user is authenticated
  useEffect(() => {
    if (isAuthenticated && sessionKey && account) {
      console.log("Authenticated! Fetching ledger balances...");

      // CHAPTER 4: Show loading state while we fetch balances
      setIsLoadingBalances(true);

      // CHAPTER 4: Create a "signer" - this is what signs our requests without user popups
      // Think of this like a temporary stamp that proves we're allowed to make requests
      const sessionSigner = createECDSAMessageSigner(sessionKey.privateKey);

      // CHAPTER 4: Create a signed request to get the user's asset balances
      // This is like asking "What's in my wallet?" but with cryptographic proof
      createGetLedgerBalancesMessage(
        sessionSigner,
        account.address as `0x${string}`
      )
        .then((getBalancesPayload) => {
          // Send the signed request through our WebSocket connection
          console.log("Sending balance request...");
          webSocketService.send(getBalancesPayload);
        })
        .catch((error) => {
          console.error("Failed to create balance request:", error);
          setIsLoadingBalances(false); // Stop loading on error
          // In a real app, you might show a user-friendly error message here
        });
    }
  }, [isAuthenticated, sessionKey, account]);

  // CHAPTER 3: Handle server messages for authentication
  useEffect(() => {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMessage = async (data: any) => {
      const response = parseAnyRPCResponse(JSON.stringify(data));
      // console.log("response: ", response);
      if (
        response.method === RPCMethod.AuthChallenge &&
        walletClient &&
        sessionKey &&
        account &&
        sessionExpireTimestamp
      ) {
        const challengeResponse = response as AuthChallengeResponse;

        const authParams = {
          scope: AUTH_SCOPE,
          application: walletClient.account?.address as `0x${string}`,
          participant: sessionKey.address as `0x${string}`,
          expire: sessionExpireTimestamp,
          allowances: [],
        };

        const eip712Signer = createEIP712AuthMessageSigner(
          walletClient,
          authParams,
          getAuthDomain()
        );

        try {
          const authVerifyPayload = await createAuthVerifyMessage(
            eip712Signer,
            challengeResponse
          );
          webSocketService.send(authVerifyPayload);
        } catch (error) {
          // alert("Signature rejected. Please try again.");
          console.log("Signature rejected. Please try again.", error);
          setIsAuthAttempted(false);
        }
      }

      // Handle auth success
      if (
        response.method === RPCMethod.AuthVerify &&
        response.params?.success
      ) {
        setIsAuthenticated(true);
        if (response.params.jwtToken) storeJWT(response.params.jwtToken);
      }

      // CHAPTER 4: Handle balance responses (when we asked for balances)
      if (response.method === RPCMethod.GetLedgerBalances) {
        const balanceResponse = response as GetLedgerBalancesResponse;
        const balances = balanceResponse.params.ledgerBalances;

        console.log("Received balance response:", balances);

        // Check if we actually got balance data back
        if (balances && balances.length > 0) {
          // CHAPTER 4: Transform the data for easier use in our UI
          // Convert from: [{asset: "usdc", amount: "100"}, {asset: "eth", amount: "0.5"}]
          // To: {"usdc": "100", "eth": "0.5"}
          const balancesMap = Object.fromEntries(
            balances.map((balance) => [balance.asset, balance.amount])
          );
          // console.log("Setting balances:", balancesMap);
          setBalances(balancesMap);
        } else {
          console.log("No balance data received - wallet appears empty");
        }
        // CHAPTER 4: Stop loading once we receive any balance response
        setIsLoadingBalances(false);
      }

      // CHAPTER 4: Handle live balance updates (server pushes these automatically)
      if (response.method === RPCMethod.BalanceUpdate) {
        const balanceUpdate = response as BalanceUpdateResponse;
        const balances = balanceUpdate.params.balanceUpdates;
                  
        // console.log("Live balance update received:", balances);

        // Same data transformation as above
        const balancesMap = Object.fromEntries(
          balances.map((balance) => [balance.asset, balance.amount])
        );
        // console.log("Updating balances in real-time:", balancesMap);
        setBalances(balancesMap);
      }

      // Handle errors
      if (response.method === RPCMethod.Error) {
        // setSessionExpireTimestamp("");
        // localStorage.removeItem("SESSION_EXPIRE_KEY");
        setIsAuthenticated(false);
        // setSessionKey(null);
        // removeJWT();
        // // Clear session key on auth failure to regenerate next time
        // removeSessionKey();
        alert(`Authentication failed: ${response.params.error}`);
        setIsAuthAttempted(false);
      }
    };

    webSocketService.addMessageListener(handleMessage);
    return () => webSocketService.removeMessageListener(handleMessage);
  }, [walletClient, sessionKey, sessionExpireTimestamp, account]);
  useEffect(() => {
    setMounted(true); // Only true after hydration
  }, []);

  if (!mounted) {
    // Render a placeholder on server & before hydration
    return <div style={{ height: "40px", minWidth: "120px" }} />;
  }

  //   const formatAddress = (address: Address) =>
  //     `${address.slice(0, 6)}...${address.slice(-4)}`;
  //   if (typeof window === "undefined") return; // 👈 ensures browser only
  return <>{children}</>;
};
export default ClearNodeProvider;
