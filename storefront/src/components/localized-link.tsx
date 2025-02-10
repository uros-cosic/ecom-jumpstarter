"use client"

import Link from "next/link"
import { ClassNameValue } from "tailwind-merge"
import { useParams } from "next/navigation"

import { cn } from "@/lib/utils"

type Props = {
    children: Readonly<React.ReactNode>
    href: string
    className?: ClassNameValue
    prefetch?: boolean
}

const LocalizedLink = ({ children, href, className, prefetch = false }: Props) => {
    const { countryCode } = useParams()

    return (
        <Link href={`/${countryCode}${href}`} className={cn(className)} prefetch={prefetch}>
            {children}
        </Link>
    )
}

export default LocalizedLink
