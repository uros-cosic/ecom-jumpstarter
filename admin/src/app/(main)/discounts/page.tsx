import Link from "next/link"

import { columns } from "@/components/tables/columns/discounts"
import { DataTable } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import { getDiscounts } from "@/lib/data/discount"

type Props = {
    searchParams: Promise<Record<string, string>>
}

const Page = async ({ searchParams }: Props) => {
    const query = await searchParams

    const discounts = await getDiscounts(query)

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="flex items-end justify-between gap-5">
                <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Discounts</h1>
                <Link href="/discounts/create">
                    <Button>Create discount</Button>
                </Link>
            </div>
            <DataTable
                columns={columns}
                data={discounts ?? []}
            />
        </div>

    )
}

export default Page

