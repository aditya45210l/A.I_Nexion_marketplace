
import StatisticCard1 from "@/components/statistic-card-1"
import { fetchActiveKeys } from "@/lib/actions/GetActiveKeys";
import RentCardContainer from "@/components/marketplace/RentCardContainer";
export interface keysType{
  id:string,
  lenderAddress:string,
  provider:string,
  model:string,
  status:string,
  apiKey:string,
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
  const data =  await fetchActiveKeys();
  
  console.log("data from borrow page",data);
  
  return (
    <div className="p-6 lg:p-8 flex flex-col gap-12">
        <StatisticCard1/>
<RentCardContainer data={data}/>
    </div>
  )
}
export default page