import StatisticCard1 from "@/components/statistic-card-1"
import ApiForRentCard from "@/components/statistic-card-6"
import { fetchActiveKeys } from "@/lib/actions/GetActiveKeys";

export interface keysType{
  id:string,
  lenderAddress:string,
  provider:string,
  model:string,
  status:string,
  encryptedKey:string,
  pricing:{
    ratePerCall:number
  },
  settings:{
    isActive:boolean,
    maxDailyUsage:number,
    autoDisableOnLimit:boolean
  },
}

const page = async () => {
  const apiData =  await fetchActiveKeys();
  const data = apiData.keys;
  console.log("data from borrow page",data);
  
  return (
    <div className="p-6 lg:p-8 flex flex-col gap-12">
        <StatisticCard1/>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {
            data && data.length > 0 ? data.map((keyProps:keysType) =>{
              return <ApiForRentCard key={keyProps.id} keyProps={keyProps}/>
            }): <p className="text-center text-muted-foreground col-span-3">No API Keys available for rent at the moment.</p>
          }

        </div>
    </div>
  )
}
export default page