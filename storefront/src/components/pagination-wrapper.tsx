"use client"

import { cn } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, } from "react"
import { ClassNameValue } from "tailwind-merge"

type Props = {
    children: Readonly<React.ReactNode>
    canChange: boolean
    className?: ClassNameValue
    threshold?: number
}

const PaginationWrapper = ({ children, canChange, className, threshold = 1 }: Props) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    const observerRef = useRef<Readonly<HTMLDivElement> | null>(null)

    const currentLimit = parseInt(searchParams.get("limit") || "9", 10);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && canChange) {
                    const newLimit = currentLimit + 9;
                    const params = new URLSearchParams(searchParams);

                    params.set("limit", newLimit.toString());

                    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
                }
            },
            { threshold }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [searchParams, currentLimit, router, threshold, pathname, canChange]);

    return (
        <div className={cn(className)}>
            {children}
            <div className="h-1 w-full" ref={observerRef} />
        </div>
    )

}

export default PaginationWrapper
