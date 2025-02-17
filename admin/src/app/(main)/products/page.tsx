import Link from "next/link"

import { columns } from "@/components/tables/columns/products"
import { DataTable } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import { getProducts } from "@/lib/data/product"

type Props = {
    searchParams: Promise<Record<string, string>>
}

const Page = async ({ searchParams }: Props) => {
    const query = await searchParams

    const products = await getProducts(query)

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="flex items-end justify-between gap-5">
                <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Products</h1>
                <Link href="/products/create">
                    <Button>Create product</Button>
                </Link>
            </div>
            <DataTable
                columns={columns}
                data={products ?? []}
                columnVisibilityObj={{ thumbnail: false }}
            />
        </div>
    )
}

export default Page
