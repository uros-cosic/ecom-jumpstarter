import Link from "next/link"

import { ArrowLeft } from "lucide-react"
import { getRegions } from "@/lib/data/region"
import { getProducts } from "@/lib/data/product"
import CreateSaleForm from "@/components/forms/create-sale"

const Page = async () => {
    const regions = await getRegions({ limit: 999 })
    const products = await getProducts({ limit: 999 })

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="grid gap-2">
                <Link href="/sales" className="flex gap-1 items-center font-medium text-sm text-foreground/80 w-fit hover:underline">
                    <ArrowLeft size={16} />
                    Go back
                </Link>
                <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Create category</h1>
            </div>
            <CreateSaleForm
                regions={regions ?? []}
                products={products ?? []}
            />
        </div>
    )
}

export default Page


