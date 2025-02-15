import Link from "next/link"

import { columns } from "@/components/tables/columns/collections"
import { DataTable } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import { getCollections } from "@/lib/data/collection"

type Props = {
    searchParams: Promise<Record<string, string>>
}

const Page = async ({ searchParams }: Props) => {
    const query = await searchParams

    const collections = await getCollections(query)

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="flex items-end justify-between gap-5">
                <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Collections</h1>
                <Link href="/collections/create">
                    <Button>Create collection</Button>
                </Link>
            </div>
            <DataTable
                columns={columns}
                data={collections ?? []}
            />
        </div>

    )
}

export default Page


