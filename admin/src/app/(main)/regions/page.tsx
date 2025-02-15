import Link from "next/link"

import { columns } from "@/components/tables/columns/regions"
import { DataTable } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import { getRegions } from "@/lib/data/region"

type Props = {
    searchParams: Promise<Record<string, string>>
}

const Page = async ({ searchParams }: Props) => {
    const query = await searchParams

    const regions = await getRegions(query)

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="flex items-end justify-between gap-5">
                <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Regions</h1>
                <Link href="/regions/create">
                    <Button>Create region</Button>
                </Link>
            </div>
            <DataTable
                columns={columns}
                data={regions ?? []}
            />
        </div>

    )
}

export default Page
