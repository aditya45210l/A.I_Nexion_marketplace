import {
  BalanceUpdateResponse,
  GetLedgerBalancesResponse,
  parseAnyRPCResponse,
  RPCMethod,
  TransferResponse,
} from "@erc7824/nitrolite";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleMessage = async (data: any) => {
  const response = parseAnyRPCResponse(JSON.stringify(data));
  // console.log("response: ", response);
  if (response.method === RPCMethod.AuthChallenge) {
    console.log("entering in AuthChallenge");
    return;
  }

  // Handle auth success
  if (response.method === RPCMethod.AuthVerify && response.params?.success) {
    return true;
  }
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
      return balancesMap;
    } else {
      console.log("No balance data received - wallet appears empty");
    }
    // CHAPTER 4: Stop loading once we receive any balance response
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
  }

  if (response.method === RPCMethod.Transfer) {
    const transferResponse = response as TransferResponse;
    console.log("Transfer completed:", transferResponse.params);

    alert(`Transfer completed successfully!`);
  }

  // Handle errors
  if (response.method === RPCMethod.Error) {
    // setSessionExpireTimestamp("");
    // localStorage.removeItem("SESSION_EXPIRE_KEY");

    // setSessionKey(null);
    // removeJWT();
    // // Clear session key on auth failure to regenerate next time
    // removeSessionKey();
    alert(`Authentication failed: ${response.params.error}`);
  }
};
