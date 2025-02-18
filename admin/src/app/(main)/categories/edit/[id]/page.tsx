import Link from "next/link"

import { ArrowLeft } from "lucide-react"
import { getRegions } from "@/lib/data/region"
import { getCategories, getCategoryById } from "@/lib/data/category"
import EditCategoryForm from "@/components/forms/edit-category"
import { notFound } from "next/navigation"

type Props = {
    params: Promise<{ id: string }>
}

const Page = async ({ params }: Props) => {
    const { id } = await params

    const category = await getCategoryById(id)

    if (!category) notFound()

    const regions = await getRegions({ limit: 999 })
    const categories = await getCategories({ limit: 999 })

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="grid gap-2">
                <Link href="/categories" className="flex gap-1 items-center font-medium text-sm text-foreground/80 w-fit hover:underline">
                    <ArrowLeft size={16} />
                    Go back
                </Link>
                <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Edit category - {category._id}</h1>
            </div>
            <EditCategoryForm
                category={category}
                regions={regions ?? []}
                categories={categories ?? []}
            />
        </div>
    )
}

export default Page



