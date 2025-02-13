"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import Image from "next/image"

import { Input } from "../ui/input"
import { IProduct, IRegion } from "@/lib/types"
import { searchProducts } from "@/lib/data/products"
import { formatCurrency } from "@/lib/utils"
import LocalizedLink from "../localized-link"
import { useParams } from "next/navigation"
import { getRegionByCountryCode } from "@/lib/data/regions"
import { SheetClose } from "../ui/sheet"
import SearchListSkeleton from "../skeletons/search-list"

type Props = {
    searchInputLabel: string
    fromLabel: string
    locale: string
}

const SearchContainer = ({ searchInputLabel, fromLabel, locale }: Props) => {
    const [searchVal, setSearchVal] = useState("")
    const [products, setProducts] = useState<IProduct[]>([])
    const [region, setRegion] = useState<IRegion | null>(null)
    const [loading, setLoading] = useState(false)

    const { countryCode } = useParams()

    const debounced = useDebouncedCallback((value) => {
        setSearchVal(value);
    }, 300);

    const populateProducts = async (query: string) => {
        setLoading(true)
        const data = await searchProducts(query, countryCode as string)

        if (data) {
            setProducts(data)
            setLoading(false)
            return
        }

        setProducts([])
        setLoading(false)
    }

    const populateRegion = async () => {
        const data = await getRegionByCountryCode(countryCode as string)

        if (data) setRegion(data)
    }

    useEffect(() => {
        populateRegion()
    }, [])

    useEffect(() => {
        if (searchVal.trim()) {
            populateProducts(searchVal.trim())
        } else {
            setProducts([])
        }
    }, [searchVal])

    return (
        <>
            <div className="w-full border-b pb-5">
                <div className="max-w-xl w-full mx-auto">
                    <Input
                        aria-label={searchInputLabel}
                        placeholder={searchInputLabel}
                        autoFocus={true}
                        onChange={e => debounced(e.target.value)}
                    />
                </div>
            </div>
            {
                loading ? <SearchListSkeleton /> : !!products.length && (
                    <ul className="flex flex-col py-5 gap-3">
                        {products.map(prod => (
                            <li key={prod._id}>
                                <LocalizedLink href={`/products/${prod.handle}`} className="hover:opacity-70 w-full">
                                    <SheetClose className="w-full">
                                        <div className="grid grid-cols-10 gap-3">
                                            <div className="col-span-8 lg:col-span-9 flex items-center gap-3">
                                                <Image
                                                    src={prod.thumbnail}
                                                    alt={prod.name}
                                                    height={50}
                                                    width={50}
                                                    quality={70}
                                                />
                                                <span className="line-clamp-2 truncate text-sm lg:text-base">{prod.name}</span>
                                            </div>
                                            {!!region &&
                                                <div className="col-span-2 xl:col-span-1 flex flex-col items-start justify-center text-xs lg:text-sm">
                                                    <span className="font-medium">{fromLabel}:</span>
                                                    <span>{formatCurrency(locale, region.currency, prod.price)}</span>
                                                </div>
                                            }
                                        </div>
                                    </SheetClose>
                                </LocalizedLink>
                            </li>
                        ))}
                    </ul>
                )
            }
        </>
    )
}

export default SearchContainer
