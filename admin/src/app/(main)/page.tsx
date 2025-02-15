import BottomCards from "@/components/dashboard/bottom-cards"
import TopCards from "@/components/dashboard/top-cards"

const Page = () => {
    return (
        <div className="w-full flex flex-col gap-5">
            <TopCards />
            <BottomCards />
        </div>
    )
}

export default Page
