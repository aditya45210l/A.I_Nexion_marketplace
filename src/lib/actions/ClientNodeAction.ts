import {
  AuthRequestParams,
  createAuthRequestMessage,
  createECDSAMessageSigner,
  createGetLedgerBalancesMessage,
} from "@erc7824/nitrolite";
import { getStoredSessionKey } from "../yellowUtils";
import { webSocketService } from "../websocket";
import { useActiveAccount } from "thirdweb/react";
import { useBasicAuth } from "../stores/AuthStore";

export async function fetchBalances(address: string) {
  try {
    const sessionKey = getStoredSessionKey();
    // Create signer
    if (!sessionKey) {
      throw new Error("Session key not found");
    }
    // console.log("sessionKeys: ",sessionKey)
    if (webSocketService.status !== "Connected") {
      // webSocketService.connect();
    }
    const sessionSigner = createECDSAMessageSigner(sessionKey!.privateKey);

    // Build signed request
    createGetLedgerBalancesMessage(
      sessionSigner,
      address as `0x${string}`
    ).then((getBalancesPayload) => {
      // Send the signed request through our WebSocket connection
      console.log("Sending balance request...");
      webSocketService.send(getBalancesPayload);
    });
    return "Balance request sent successfully";
  } catch (error) {
    console.error("Failed to create balance request:", error);
  }
}
export const AuthenticateUser = () => {
  const account = useActiveAccount();
  const { sessionKey, setIsAuthAttempted } = useBasicAuth();

  // const getAuthDomain = () => ({
  //   name: "Nexus",
  // });

  // CHAPTER 3: Authentication constants
  const AUTH_SCOPE = "nexus.app";
  const APP_NAME = "Nexus";
  const SESSION_DURATION = 3600; // 1 hour
  try {
    setIsAuthAttempted(true);

    // Generate fresh timestamp for this auth attempt
    const expireTimestamp = String(
      Math.floor(Date.now() / 1000) + SESSION_DURATION
    );
    localStorage.setItem("SESSION_EXPIRE_KEY", expireTimestamp);
    // setSessionExpireTimestamp(expireTimestamp);

    const authParams: AuthRequestParams = {
      address: account!.address as `0x${string}`,
      session_key: sessionKey!.address,
      app_name: APP_NAME,
      expire: expireTimestamp,
      scope: AUTH_SCOPE,
      application: account!.address as `0x${string}`,
      allowances: [],
    };

    createAuthRequestMessage(authParams).then((payload) => {
      webSocketService.send(payload);
    });
  } catch (error) {
    console.log(error);
  }
};
