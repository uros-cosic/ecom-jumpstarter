"use client"

import Link from "next/link"
import { ClassNameValue } from "tailwind-merge"
import { useParams } from "next/navigation"

import { cn } from "@/lib/utils"

type Props = {
    children: Readonly<React.ReactNode>
    href: string
    className?: ClassNameValue
}

const LocalizedLink = ({ children, href, className }: Props) => {
    const { countryCode } = useParams()

    return (
        <Link href={`/${countryCode}${href}`} className={cn(className)}>
            {children}
        </Link>
    )
}

export default LocalizedLink
