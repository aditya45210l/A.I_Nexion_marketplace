"use client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HandCoins, Landmark } from "lucide-react";
import SubscriptionTable, { IData } from "./SubscriptionTable";
import axios from "axios";
import { useActiveAccount } from "thirdweb/react";
import { useQuery } from "@tanstack/react-query";

function transformKeys(rawKeys: any[], type: "lended" | "borrowed"): IData[] {
  return rawKeys.map((item) => ({
    id: item.id,
    provider: item.provider,
    model: item.model,
    status: item.status,
    lenderAddress: item.lenderAddress,
    BorrowerAddress: item.BorrowerAddress ?? "0x0000000000000000000000000000000000000000",
    api_key: item.encryptedKey,
    api_total_calls: item.analytics?.totalCallsAllTime ?? 0,
    revenue: item.analytics?.totalEarningsAllTime ?? 0,
  }));
}

async function fetchDashboardData(
  address: string
): Promise<{ lended: IData[]; borrowed: IData[] }> {
  const rawLended = (await axios.get(`/api/v1/fetch/borrower-keys/${address}`))
    .data;
  const rawBorrowed = (await axios.get(`/api/v1/fetch/lender-keys/${address}`))
    .data;

  return {
    lended: transformKeys(rawLended.data, "lended"),
    borrowed: transformKeys(rawBorrowed.data, "borrowed"),
  };
}

export default function SwitchTabs() {
  const account = useActiveAccount();

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["dashboard", account?.address],
    queryFn: () => fetchDashboardData(account!.address),
    enabled: !!account?.address, // ✅ Only run when wallet is ready
    refetchInterval: 5000, // ✅ Auto refresh every 5s
    staleTime: 0, // ✅ Always considered stale → will refetch
    keepPreviousData: true, // ✅ Prevents flicker when refetching
  });

  return (
    <Tabs defaultValue="profile" className="text-sm text-muted-foreground">
      <TabsList className="grid w-[375px] grid-cols-2">
        <TabsTrigger value="profile">
          <Landmark /> Lended key
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <HandCoins />
          Borrowed key
          <Badge variant="destructive" shape="circle" size="xs">
            {data?.borrowed?.length ?? 0}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        {isLoading ? (
          "Loading..."
        ) : error ? (
          "Error loading data"
        ) : (
          <SubscriptionTable type="lender" data={data?.lended!} />
        )}
      </TabsContent>

      <TabsContent value="notifications">
        {isLoading ? (
          "Loading..."
        ) : (
          <SubscriptionTable type="borrower" data={data?.borrowed ?? []} />
        )}
      </TabsContent>
    </Tabs>
  );
}
