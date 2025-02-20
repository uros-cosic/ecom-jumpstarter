import Link from "next/link"

import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { getDiscountById } from "@/lib/data/discount"
import EditDiscountForm from "@/components/forms/edit-discount"

type Props = {
    params: Promise<{ id: string }>
}

const Page = async ({ params }: Props) => {
    const { id } = await params

    const discount = await getDiscountById(id)

    if (!discount) notFound()

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="grid gap-2">
                <Link href="/discounts" className="flex gap-1 items-center font-medium text-sm text-foreground/80 w-fit hover:underline">
                    <ArrowLeft size={16} />
                    Go back
                </Link>
                <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Edit discount - {discount._id}</h1>
            </div>
            <EditDiscountForm
                discount={discount}
            />
        </div>
    )
}

export default Page
