"use client";
import ThirdWebConnectButton from "@/components/layout/ThirdWebConnectButton";
import StatisticCard1 from "@/components/statistic-card-1";

import { useActiveAccount } from "thirdweb/react";
import { viemAdapter } from "thirdweb/adapters/viem";
import { ethereum } from "thirdweb/chains";

import { ThirdWebClient } from "@/lib/thirdWebClient";

import { useBasicAuth } from "@/lib/stores/AuthStore";
import { fetchBalances } from "@/lib/actions/ClientNodeAction";
import { Button } from "@/components/ui/button";
import SwitchTabs from "@/components/dashboard/SwitchTabs";
import { Separator } from "@/components/ui/separator";
import DashboardChart from "@/components/area-chart-1";
import Component from "@/components/code/copy-button";
import CopyTextComp from "@/components/code/copy-button";
// import BalanceCardDashboard from "@/components/statistic-card-5";

const Page = () => {
  const balances = useBasicAuth((state) => state.balances);
  
  const saltBalance = (balances?.['usdc'] ?? balances?.['USDC'] ?? null)
      const formattedBalance = saltBalance ? parseFloat(saltBalance).toFixed(2) : '0.00';
  const account = useActiveAccount();
  const getWalletClient = async() => {
    if(!account) return;
    // console.log(account)
    const walletClient =  viemAdapter.walletClient.toViem({
      account, // your thirdweb account object
      client: ThirdWebClient,
      chain: ethereum, // or any supported chain object
    });
    console.log(walletClient);
  }
  const _fetchBalance = () =>{
    fetchBalances(account?.address);
  }

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6">

<DashboardChart/>
        {/* <Button className="max-w-2xs"  onClick={_fetchBalance}>Fetch Balance</Button> */}
        <Separator/>
         <div>
          <SwitchTabs/>
         </div>
    </div>
  );
};
export default Page;
      // <div className="flex gap-10 items-center">
      //   <Button className="max-w-2xs"  onClick={getWalletClient}>Fetch WalletClient</Button>

      //   <div className="border rounded-2xl px-6 py-2"> Balance {formattedBalance}</div>
      //   {/* <ThirdWebConnectButton /> */}
      //   {/* <TestConnectButton/> */}
      // </div>
