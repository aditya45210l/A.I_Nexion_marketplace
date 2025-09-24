
import StatisticCard1 from "@/components/statistic-card-1";
import { fetchActiveKeys } from "@/lib/actions/GetActiveKeys";
import RentCardContainer from "@/components/marketplace/RentCardContainer";
import { useActiveAccount } from "thirdweb/react";
import { useQuery } from "@tanstack/react-query";
export interface keysType {
  id: string;
  lenderAddress: string;
  provider: string;
  model: string;
  status: string;
  apiKey: string;
  pricing: {
    ratePerCall: number;
  };
  settings: {
    isActive: boolean;
    maxDailyUsage: number;
    autoDisableOnLimit: boolean;
  };
}

const page = async () => {
  // const data = await fetchActiveKeys();
  // const account = useActiveAccount();
  //   const { data, isLoading, isFetching, error } = useQuery({
  //     queryKey: ["borrowerDash"],
  //     queryFn: fetchActiveKeys,
  //     enabled: !!account?.address, // ✅ Only run when wallet is ready
  //     refetchInterval: 5000, // ✅ Auto refresh every 5s
  //     staleTime: 0, // ✅ Always considered stale → will refetch
  //     keepPreviousData: true, // ✅ Prevents flicker when refetching
  //   });

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-12">
      <StatisticCard1 />
      <RentCardContainer />
    </div>
  );
};
export default page;
