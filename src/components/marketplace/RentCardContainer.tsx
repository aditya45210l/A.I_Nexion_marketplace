
'use client'
import ApiForRentCard from "../statistic-card-6";
import { keysType } from "@/app/(root)/borrow/page";
import { useSidebar } from "@/components/ui/sidebar";

const RentCardContainer = ({data}:{data:keysType[]}) => {
  const {open} = useSidebar();
  console.log('open: ',open);
  return (
    <div className={`grid ${open ? 'lg:grid-cols-2 md:grid-cols-1':"lg:grid-cols-3 md:grid-cols-2"}  grid-cols-1 gap-6 transition-all`}>
      {data && data.length > 0 ? (
        data.map((keyProps: keysType) => {
          return <ApiForRentCard key={keyProps.id} keyProps={keyProps} />;
        })
      ) : (
        <p className="text-center text-muted-foreground col-span-3">
          No API Keys available for rent at the moment.
        </p>
      )}
    </div>
  );
};
export default RentCardContainer;
