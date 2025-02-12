"use client"

import { ClassNameValue } from "tailwind-merge"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { CHECKOUT_STEP } from "@/lib/types"

type Props = {
    children: Readonly<React.ReactNode>
    step: CHECKOUT_STEP
    className?: ClassNameValue
}

const EditButton = ({ className, children, step }: Props) => {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    const handleEdit = () => {
        const params = new URLSearchParams(searchParams)

        params.set("step", step)

        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <Button variant="link" className={cn("text-blue-500", className)} onClick={handleEdit}>{children}</Button>
    )
}

export default EditButton
