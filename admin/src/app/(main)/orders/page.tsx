import { columns } from "@/components/tables/columns/orders"
import { DataTable } from "@/components/tables/data-table"
import { getOrders } from "@/lib/data/order"

type Props = {
    searchParams: Promise<Record<string, string>>
}

const Page = async ({ searchParams }: Props) => {
    const query = await searchParams

    const orders = await getOrders(query)

    return (
        <div className="w-full flex flex-col gap-5">
            <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Orders</h1>
            <DataTable
                columns={columns}
                data={orders ?? []}
            />
        </div>

    )
}

export default Page

