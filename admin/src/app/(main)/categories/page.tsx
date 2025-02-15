import Link from "next/link"

import { columns } from "@/components/tables/columns/categories"
import { DataTable } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import { getCategories } from "@/lib/data/category"

type Props = {
    searchParams: Promise<Record<string, string>>
}

const Page = async ({ searchParams }: Props) => {
    const query = await searchParams

    const categories = await getCategories(query)

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="flex items-end justify-between gap-5">
                <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Categories</h1>
                <Link href="/categories/create">
                    <Button>Create category</Button>
                </Link>
            </div>
            <DataTable
                columns={columns}
                data={categories ?? []}
            />
        </div>

    )
}

export default Page

