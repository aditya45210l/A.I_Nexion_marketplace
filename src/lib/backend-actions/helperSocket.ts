import { sendAndWait } from "@/app/api/v1/ai/api-auth/[apikey]/route";
import {
  createGetLedgerBalancesMessage,
  createTransferMessage,
  type MessageSigner,
} from "@erc7824/nitrolite";

export const getSocketBalance = async (sessionSigner: MessageSigner) => {
  const getBalancesPayload = await createGetLedgerBalancesMessage(
    sessionSigner,
    "0x87BB2758926Dd0095e92005A2b65F26fc745e436"
  );
  const balance_response = await sendAndWait(
    getBalancesPayload,
    "get_ledger_balances",
    2000
  );
  return balance_response;
};
export const getSocketTransafer = async (
  sessionSigner: MessageSigner,
//   from: `0x${string}`,
  destination: `0x${string}`,
  amount: string,
  asset: string
) => {
  const transferPayload = await createTransferMessage(sessionSigner, {
    destination: destination,
    allocations: [
      {
        asset: asset.toLowerCase(),
        amount: amount,
      },
    ],
  });
  console.log("transferPayload: ",transferPayload)
  const transfer_response = await sendAndWait(transferPayload, "transfer", 2000);
  console.log(transfer_response);
  return transfer_response;
};
