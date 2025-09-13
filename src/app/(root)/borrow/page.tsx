import StatisticCard1 from "@/components/statistic-card-1"
import ApiForRentCard from "@/components/statistic-card-6"

const page = () => {
  return (
    <div className="p-6 lg:p-8 flex flex-col gap-12">
        <StatisticCard1/>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            <ApiForRentCard/>
            <ApiForRentCard/>
            <ApiForRentCard/>
        </div>
    </div>
  )
}
export default page