import { createThirdwebClient } from "thirdweb";
import { inAppWallet } from "thirdweb/wallets";
import { createWallet } from "thirdweb/wallets";
import { sepolia } from "thirdweb/chains";
import { THIRDWEB_CLIENT_ID } from "@/lib/env";

if(!THIRDWEB_CLIENT_ID){
    throw new Error("Missing THIRDWEB_CLIENT_ID environment variable");
}

const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID || "",
});
const wallet = inAppWallet();

// External wallet authentication

const account = await wallet.connect({
  client,
  strategy: "wallet",
  wallet: createWallet("io.metamask"),
  chain: sepolia,
});

// Once connected, you can use the account to send transactions
console.log("Connected as:", account?.address);
