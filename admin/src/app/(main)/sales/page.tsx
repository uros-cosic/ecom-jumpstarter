import Link from "next/link"

import { columns } from "@/components/tables/columns/sales"
import { DataTable } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import { getSales } from "@/lib/data/sale"

type Props = {
    searchParams: Promise<Record<string, string>>
}

const Page = async ({ searchParams }: Props) => {
    const query = await searchParams

    const sales = await getSales(query)

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="flex items-end justify-between gap-5">
                <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Sales</h1>
                <Link href="/sales/create">
                    <Button>Create sale</Button>
                </Link>
            </div>
            <DataTable
                columns={columns}
                data={sales ?? []}
            />
        </div>
    )
}

export default Page

