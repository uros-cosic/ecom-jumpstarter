"use client"

import { getCategories } from "@/lib/data/categories"
import { getRegionByCountryCode } from "@/lib/data/regions"
import { IProductCategory } from "@/lib/types"
import { LoaderCircle } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import LocalizedLink from "../localized-link"
import { navigationMenuTriggerStyle } from "../ui/navigation-menu"
import { cn } from "@/lib/utils"

const categoriesCache: { categories: IProductCategory[], updatedAt: number } = {
    categories: [],
    updatedAt: 0
}

const CategoriesNavigationContent = () => {
    const { countryCode } = useParams()

    const [loading, setLoading] = useState(
        categoriesCache.categories.length === 0 || categoriesCache.updatedAt < Date.now() - 3600 * 1000
    )

    const map: Record<string, IProductCategory[]> = {}

    for (const category of categoriesCache.categories) {
        if (category.parentCategory) {
            (map[category.parentCategory] ??= []).push(category);
        }
    }

    const items = useMemo(() => {
        if (!categoriesCache.categories.length) return []

        const map: Record<string, IProductCategory[]> = {}

        for (const category of categoriesCache.categories) {
            if (category.parentCategory) {
                (map[category.parentCategory] ??= []).push(category);
            }
        }

        return Object.keys(map).map(key => ({
            parentCategory: categoriesCache.categories.find(c => c._id === key)!,
            childCategories: map[key]
        }))
    }, [categoriesCache.categories])


    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true)
            const region = await getRegionByCountryCode(countryCode as string)

            if (region) {
                const categories = await getCategories({ region: region._id, limit: 999 })
                if (categories) {
                    categoriesCache.categories = categories
                    categoriesCache.updatedAt = Date.now()
                }
            }
            setLoading(false)
        }

        if (categoriesCache.updatedAt < Date.now() - 3600 * 1000) {
            fetchCategories()
        }
    }, [countryCode])

    return (
        <ul className="grid grid-cols-4 gap-3 p-4 w-[600px]">
            {(loading || !items.length) ? (
                <li>
                    <LoaderCircle className="animate-spin" size={26} />
                </li>
            ) : (
                items.map(item => (
                    <li key={item.parentCategory._id}>
                        <LocalizedLink href={`/categories/${item.parentCategory.handle}`} className={cn(navigationMenuTriggerStyle(), "font-bold")}>{item.parentCategory.name}</LocalizedLink>
                        <div className="flex flex-col">
                            {
                                item.childCategories.map(ctg => (
                                    <LocalizedLink key={ctg._id} href={`/categories/${ctg.handle}`} className={navigationMenuTriggerStyle()}>{ctg.name}</LocalizedLink>
                                ))
                            }
                        </div>
                    </li>
                ))
            )}
        </ul>
    )
}

export default CategoriesNavigationContent

