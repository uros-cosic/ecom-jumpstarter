"use client"

import { ClassNameValue } from "tailwind-merge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { cn } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type Props = {
    placeholderLabel: string
    items: {
        label: string
        value: string
    }[]
    className?: ClassNameValue
}

const DEFAULT_PAGINATION_LIMIT = 9

const SortSelect = ({ placeholderLabel, items, className }: Props) => {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleChange = (val: string) => {
        const params = new URLSearchParams(searchParams)

        params.set("sort", val)
        params.set("limit", String(DEFAULT_PAGINATION_LIMIT))

        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <Select value={searchParams.get("sort") ?? undefined} onValueChange={handleChange}>
            <SelectTrigger className={cn(className)}>
                <SelectValue placeholder={placeholderLabel} />
            </SelectTrigger>
            <SelectContent>
                {items.map(item => (
                    <SelectItem key={item.label} value={item.value}>{item.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default SortSelect
