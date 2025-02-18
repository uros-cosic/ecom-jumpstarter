import { notFound } from "next/navigation"

import { getProductById } from "@/lib/data/product"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import EditProductForm from "@/components/forms/edit-product"
import { getRegions } from "@/lib/data/region"
import { getCategories } from "@/lib/data/category"
import { getCollections } from "@/lib/data/collection"

type Props = {
    params: Promise<{ id: string }>
}

const Page = async ({ params }: Props) => {
    const { id } = await params

    const product = await getProductById(id)

    if (!product) notFound()

    const regions = await getRegions({ limit: 999 })
    const categories = await getCategories({ limit: 999 })
    const collections = await getCollections({ limit: 999 })

    return (
        <div className="grid gap-10">
            <div className="grid gap-2">
                <Link href="/products" className="flex gap-1 items-center font-medium text-sm text-foreground/80 w-fit hover:underline">
                    <ArrowLeft size={16} />
                    Go back
                </Link>
                <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Edit Product - {product._id}</h1>
            </div>
            <EditProductForm
                product={product}
                regions={regions ?? []}
                categories={categories ?? []}
                collections={collections ?? []}
            />
        </div>
    )
}

export default Page

