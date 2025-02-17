import Link from "next/link"

import { ArrowLeft } from "lucide-react"
import CreateProductForm from "@/components/forms/create-product"
import { getRegions } from "@/lib/data/region"
import { getCategories } from "@/lib/data/category"
import { getCollections } from "@/lib/data/collection"

const Page = async () => {
    const regions = await getRegions({ limit: 999 })
    const categories = await getCategories({ limit: 999 })
    const collections = await getCollections({ limit: 999 })

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="grid gap-2">
                <Link href="/products" className="flex gap-1 items-center font-medium text-sm text-foreground/80 w-fit hover:underline">
                    <ArrowLeft size={16} />
                    Go back
                </Link>
                <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Create product</h1>
            </div>
            <CreateProductForm
                regions={regions ?? []}
                categories={categories ?? []}
                collections={collections ?? []}
            />
        </div>
    )
}

export default Page
