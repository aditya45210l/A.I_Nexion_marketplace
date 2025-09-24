'use client'
import ApiForRentCard from "../statistic-card-6";
import { keysType } from "@/app/(root)/borrow/page";
import { useSidebar } from "@/components/ui/sidebar";
import { fetchActiveKeys } from "@/lib/actions/GetActiveKeys";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Separator } from "../ui/separator";




const RentCardContainer = () => {
  const {open} = useSidebar();

    const account = useActiveAccount();
    const { data, isLoading, isFetching, error } = useQuery({
      queryKey: ["borrowerDash"],
      queryFn: fetchActiveKeys,
      enabled: !!account?.address, // ✅ Only run when wallet is ready
      refetchInterval: 5000, // ✅ Auto refresh every 5s
      staleTime: 0, // ✅ Always considered stale → will refetch
      keepPreviousData: true, // ✅ Prevents flicker when refetching
    });

  return (
<div className=" flex flex-col gap-2 ">
<div className="flex flex-col gap-1">
  <Separator/>
  <span >Total:({data?.length || 0})</span>
</div>

    <div className={`grid ${open ? 'lg:grid-cols-2 md:grid-cols-1':"lg:grid-cols-3 md:grid-cols-2"}  grid-cols-1 gap-6 transition-all `}>
      
      {data && data.length > 0 ? (
        data.map((keyProps: keysType) => {
          return <ApiForRentCard key={keyProps.id} keyProps={keyProps} />;
        })
      ) : (
        <p className="text-center text-muted-foreground col-span-3">
          No API Keys available for rent at the moment.
        </p>
      )}
    </div></div>
  );
};
export default RentCardContainer;
