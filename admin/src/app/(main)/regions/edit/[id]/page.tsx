import Link from "next/link"

import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { getCountries } from "@/lib/data/country"
import { getRegionById } from "@/lib/data/region"
import EditRegionForm from "@/components/forms/edit-region"

type Props = {
    params: Promise<{ id: string }>
}

const Page = async ({ params }: Props) => {
    const { id } = await params

    const region = await getRegionById(id)

    if (!region) notFound()

    const countries = await getCountries({ limit: 999 })

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="grid gap-2">
                <Link href="/regions" className="flex gap-1 items-center font-medium text-sm text-foreground/80 w-fit hover:underline">
                    <ArrowLeft size={16} />
                    Go back
                </Link>
                <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Edit region - {region._id}</h1>
            </div>
            <EditRegionForm
                region={region}
                countries={countries ?? []}
            />
        </div>
    )
}

export default Page

