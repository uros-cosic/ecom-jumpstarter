import Link from "next/link"

import { columns } from "@/components/tables/columns/deliveries"
import { DataTable } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import { getShippingMethods } from "@/lib/data/delivery"

type Props = {
    searchParams: Promise<Record<string, string>>
}

const Page = async ({ searchParams }: Props) => {
    const query = await searchParams

    const shippingMethods = await getShippingMethods(query)

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="flex items-end justify-between gap-5">
                <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Delivery</h1>
                <Link href="/delivery/create">
                    <Button>Create shipping method</Button>
                </Link>
            </div>
            <DataTable
                columns={columns}
                data={shippingMethods ?? []}
            />
        </div>

    )
}

export default Page



