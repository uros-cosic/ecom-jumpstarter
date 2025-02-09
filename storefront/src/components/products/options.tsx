"use client"

import { IProductOptions } from "@/lib/types"
import { cn } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type Props = {
    options: IProductOptions[]
}

const ProductOptions = ({ options }: Props) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const handleClick = (key: string, val: string) => {
        const params = new URLSearchParams(searchParams)

        params.set(key, val)

        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="flex flex-col gap-7 max-w-md w-full">
            {
                options.map(option => (
                    <div key={option._id} className="flex flex-col gap-2 text-sm">
                        <p className="font-medium">{option.name}</p>
                        <ul className="grid grid-cols-4 gap-2">
                            {option.values.map(val => (
                                <li key={val}>
                                    <button
                                        type="button"
                                        className={cn("bg-gray-100 rounded-md border p-2 truncate w-full text-gray-800 hover:bg-gray-200", {
                                            "border-black": searchParams.get(option.name) === val
                                        })}
                                        onClick={() => handleClick(option.name, val)}
                                    >{val}</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            }

        </div>
    )
}

export default ProductOptions
