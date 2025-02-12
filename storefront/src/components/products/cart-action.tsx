"use client"

import { toast } from "sonner"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import { useContext, useEffect, useState } from "react"

import { ICartItem, IProduct, IProductVariant, IRegion } from "@/lib/types"
import { cn, formatCurrency } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "../ui/button"
import { addToCart } from "@/lib/data/cart"
import { CartSheetContext, CartSheetContent } from "@/lib/context/cart-sheet"

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
    priceObj?: { discountedPrice: number; originalPrice: number } | null
}

const CartAction = ({ priceObj, product, region, locale, quantityLabel, plusLabel, minusLabel, leftInStockText, notInStock, productLabel, variantLabel, addToBagLabel }: Props) => {
    const [price, setPrice] = useState(priceObj?.discountedPrice ?? product.price)
    const [quantity, setQuantity] = useState(1)
    const [available, setAvailable] = useState(!!product.quantity)
    const [variant, setVariant] = useState<IProductVariant | null>(null)

    const { setOpen } = useContext<CartSheetContent>(CartSheetContext)

    const availableQuantity = variant?.quantity ?? product.quantity
    const maxQuantity = Math.min(availableQuantity, Math.max(availableQuantity, 10))

    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const handleAddToCart = async () => {
        const item: Omit<ICartItem, '_id' | 'createdAt' | 'updatedAt'> = { product: product._id, quantity }

        if (variant) item.variant = variant._id

        const [, err] = await addToCart(item)

        if (err) {
            toast.error(err)
            return
        }

        setOpen(true)
    }

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
        if (!variantAvailable) setVariant(null)
    }

    const handleVariantChange = (v: IProductVariant | null) => {
        const params = new URLSearchParams(searchParams)

        if (!v) params.delete('variantId')
        else params.set('variantId', v._id)

        router.replace(`${pathname}?${params.toString()}`)
    }

    useEffect(() => {
        setQuantity(1)
        calculatePrice()
    }, [searchParams])

    useEffect(() => {
        handleVariantChange(variant)
    }, [variant])


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
                        <button className="disabled:cursor-not-allowed" disabled={!available} onClick={() => setQuantity(prev => Math.min(prev + 1, maxQuantity ?? 1))}>
                            <Plus size={16} aria-label={plusLabel} />
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    {(priceObj && priceObj.discountedPrice !== priceObj.originalPrice) && <span className="line-through text-gray-500">{formatCurrency(locale, region.currency, priceObj.originalPrice)}</span>}
                    <span className="text-2xl font-medium">{formatCurrency(locale, region.currency, priceObj?.discountedPrice ?? price)}</span>
                </div>
            </div>
            <Button disabled={!available} className="max-w-md" onClick={handleAddToCart}>
                {!available ? `${searchParams.keys().toArray().length ? variantLabel : productLabel} ${notInStock.toLowerCase()}` : <>
                    <ShoppingBag />
                    <span>{addToBagLabel}</span>
                </>}
            </Button>
        </div>
    )
}

export default CartAction
