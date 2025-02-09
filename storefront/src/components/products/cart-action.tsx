"use client"

import { IProduct, IProductVariant, IRegion } from "@/lib/types"
import { cn, formatCurrency } from "@/lib/utils"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"

type Props = {
    product: IProduct,
    region: IRegion,
    locale: string,
    quantityLabel: string,
    minusLabel: string,
    plusLabel: string,
    leftInStockText: string
    notInStock: string
    variantLabel: string
    productLabel: string
    addToBagLabel: string
}

const CartAction = ({ product, region, locale, quantityLabel, plusLabel, minusLabel, leftInStockText, notInStock, productLabel, variantLabel, addToBagLabel }: Props) => {
    const [price, setPrice] = useState(product.price)
    const [quantity, setQuantity] = useState(1)
    const [available, setAvailable] = useState(!!product.quantity)
    const [variant, setVariant] = useState<IProductVariant | null>(null)

    const availableQuantity = variant?.quantity ?? product.quantity

    const searchParams = useSearchParams()

    const calculatePrice = () => {
        if (!product.variants || !searchParams.keys().toArray().length) return

        let variantAvailable = false

        for (const variant of product.variants) {
            let foundVariant = true

            for (const option of variant.options) {
                const param = searchParams.get(option.name)

                if (option.value !== param) {
                    foundVariant = false
                    break
                }
            }

            if (foundVariant) {
                variantAvailable = !!variant.quantity
                setVariant(variant)
                setPrice(variant.price)
                break
            }
        }

        setAvailable(variantAvailable)
    }

    useEffect(() => {
        setQuantity(1)
        calculatePrice()
    }, [searchParams])


    return (
        <div className="flex flex-col gap-7">
            <div className="max-w-md w-full flex justify-between gap-10 items-end">
                <div className="flex flex-col gap-2 text-sm">
                    <span className="font-medium flex items-center gap-1">{quantityLabel}{(availableQuantity > 0 && availableQuantity <= 10) && <span className="text-gray-500 text-xs">{`(${leftInStockText.replace("#quantity#", availableQuantity.toString())})`}</span>}</span>
                    <div className={cn("rounded-full flex items-center gap-5 p-3 bg-white border border-black justify-between", { "opacity-50": !available })}>
                        <button className="disabled:cursor-not-allowed" disabled={!available} onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}>
                            <Minus size={16} aria-label={minusLabel} />
                        </button>
                        <span>{quantity}</span>
                        <button className="disabled:cursor-not-allowed" disabled={!available} onClick={() => setQuantity(prev => Math.min(prev + 1, availableQuantity ?? 1))}>
                            <Plus size={16} aria-label={plusLabel} />
                        </button>
                    </div>
                </div>
                <span className="text-2xl font-medium">{formatCurrency(locale, region.currency, price)}</span>
            </div>
            <Button disabled={!available} className="max-w-md">
                {!available ? `${searchParams.keys().toArray().length ? variantLabel : productLabel} ${notInStock.toLowerCase()}` : <>
                    <ShoppingBag />
                    <span>{addToBagLabel}</span>
                </>}
            </Button>
        </div>
    )
}

export default CartAction
