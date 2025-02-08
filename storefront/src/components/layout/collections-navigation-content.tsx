"use client"

import { getCollections } from "@/lib/data/collections"
import { getRegionByCountryCode } from "@/lib/data/regions"
import { IProductCollection } from "@/lib/types"
import { LoaderCircle } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import LocalizedLink from "../localized-link"
import { navigationMenuTriggerStyle } from "../ui/navigation-menu"

const collectionsCache: { collections: IProductCollection[], updatedAt: number } = {
    collections: [],
    updatedAt: 0
}

const CollectionsNavigationContent = () => {
    const { countryCode } = useParams()

    const [loading, setLoading] = useState(
        collectionsCache.collections.length === 0 || collectionsCache.updatedAt < Date.now() - 3600 * 1000
    )

    useEffect(() => {
        const fetchCollections = async () => {
            setLoading(true)
            const region = await getRegionByCountryCode(countryCode as string)

            if (region) {
                const collections = await getCollections({ region: region._id, limit: 999 })
                if (collections) {
                    collectionsCache.collections = collections
                    collectionsCache.updatedAt = Date.now()
                }
            }
            setLoading(false)
        }

        if (collectionsCache.updatedAt < Date.now() - 3600 * 1000) {
            fetchCollections()
        }
    }, [countryCode])

    return (
        <ul className="grid grid-cols-4 gap-3 p-4 w-[600px]">
            {(loading || !collectionsCache.collections.length) ? (
                <li>
                    <LoaderCircle className="animate-spin" size={26} />
                </li>
            ) : (
                collectionsCache.collections.map((collection) => (
                    <li key={collection._id}>
                        <LocalizedLink href={`/collections/${collection.handle}`} className={navigationMenuTriggerStyle()}>{collection.name}</LocalizedLink>
                    </li>
                ))
            )}
        </ul>
    )
}

export default CollectionsNavigationContent

