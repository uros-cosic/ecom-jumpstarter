import Link from "next/link"

import { ArrowLeft } from "lucide-react"
import CreateDiscountForm from "@/components/forms/create-discount"

const Page = async () => {
    return (
        <div className="w-full flex flex-col gap-5">
            <div className="grid gap-2">
                <Link href="/discounts" className="flex gap-1 items-center font-medium text-sm text-foreground/80 w-fit hover:underline">
                    <ArrowLeft size={16} />
                    Go back
                </Link>
                <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Create discount</h1>
            </div>
            <CreateDiscountForm />
        </div>
    )
}

export default Page
