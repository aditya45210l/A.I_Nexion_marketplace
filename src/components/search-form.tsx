import { Search } from "lucide-react";

import { Label } from "@/components/ui/label";
import { SidebarInput } from "@/components/ui/sidebar";
import NumberTicker from "./layout/BalanceTicker";
import { useBasicAuth } from "@/lib/stores/AuthStore";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const { balances } = useBasicAuth();
  console.log(balances);
  if (!balances) return ;
  return (
    <form {...props}>
      <div>
        Credits:{" "}
        <NumberTicker
          value={Number(balances!.usdc)}
          duration={2500}
          className=" font-bold"
          prefix="$"
          decimalPlaces={3}
        />
      </div>

      {/* <div className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="Type to search..."
            className="h-8 pl-7"
          />
          <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        </div> */}
    </form>
  );
}
