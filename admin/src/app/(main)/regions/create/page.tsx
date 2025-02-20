import Link from "next/link"

import { ArrowLeft } from "lucide-react"
import { getCountries } from "@/lib/data/country"
import CreateRegionForm from "@/components/forms/create-region"

const Page = async () => {
    const countries = await getCountries({ limit: 999 })

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="grid gap-2">
                <Link href="/regions" className="flex gap-1 items-center font-medium text-sm text-foreground/80 w-fit hover:underline">
                    <ArrowLeft size={16} />
                    Go back
                </Link>
                <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Create reigon</h1>
            </div>
            <CreateRegionForm
                countries={countries ?? []}
            />
        </div>
    )
}

export default Page

