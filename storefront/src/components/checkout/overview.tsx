import Image from "next/image"

import { ProductPopulatedCart } from "@/lib/data/cart"
import { DISCOUNT_TYPE, IRegion } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { getLocale, getTranslations } from "next-intl/server"
import DiscountCodeForm from "../forms/discount-code"
import { Separator } from "../ui/separator"
import { getShippingMethodById } from "@/lib/data/shipping-methods"
import { getDiscountCodeById } from "@/lib/data/discount-codes"
import { getProductPrice } from "@/lib/data/products"

type Props = {
    cart: ProductPopulatedCart
    region: IRegion
}

const Overview = async ({ cart, region }: Props) => {
    const t = await getTranslations("Checkout.Overview")
    const locale = await getLocale()

    let shippingMethod = null
    let discountCode = null

    if (cart?.shippingMethod) shippingMethod = await getShippingMethodById(cart.shippingMethod)
    if (cart?.discountCode) discountCode = await getDiscountCodeById(cart.discountCode)

    const prices = cart && await Promise.all(cart.items.map(item => getProductPrice(item.product._id, item.variant ?? undefined)))

    if (prices) {
        cart.items.forEach((item, idx) => {
            const priceObj = prices[idx]

            if (item.variant) {
                const variant = item.product.variants!.find(v => v._id === item.variant)!
                variant.price = priceObj?.discountedPrice ?? variant.price
            } else {
                item.product.price = priceObj?.discountedPrice ?? item.product.price
            }
        })
    }

    const calculateTotal = () => {
        const totalPrice = cart.totalPrice
        let subTotal = totalPrice
        let discount = 0

        const shippingCost = shippingMethod?.cost ?? 0

        subTotal -= shippingCost

        if (discountCode) {
            if (discountCode.type === DISCOUNT_TYPE.PERCENTAGE) {
                const discountAmount = (subTotal * (discountCode.percentage ?? 1))
                subTotal = discountAmount + subTotal
                discount = discountAmount
            }
            if (discountCode.type === DISCOUNT_TYPE.FIXED) {
                subTotal += (discountCode.amount || 0)
                discount = discountCode.amount || 0
            }
        }

        return { subTotal: Math.max(0, subTotal), discount, shipping: shippingCost }
    }

    return (
        <div className="flex flex-col gap-5 lg:max-w-xl w-full lg:ml-auto">
            <p className="font-[family-name:var(--font-montserrat)] text-3xl font-medium">{t("in-your-cart")}</p>
            <Separator />
            <ul className="no-scrollbar lg:max-h-[200px] overflow-y-auto flex flex-col gap-3">
                {cart.items.map((item, idx) => (
                    <li
                        key={idx}
                        className="grid grid-cols-5 items-center text-xs gap-x-2"
                    >
                        <div className="relative overflow-hidden rounded-md border bg-white h-12 w-12 flex items-center justify-center p-1">
                            <Image
                                src={item.product.thumbnail}
                                alt={item.product.name}
                                height={48}
                                width={48}
                                quality={60}
                                style={{ objectFit: "contain" }}
                            />
                        </div>
                        <div className="col-span-2 flex flex-col gap-1">
                            <p className="font-medium">{t("name")}</p>
                            <p className="line-clamp-2">
                                {!item.variant ? item.product.name : item.product.variants!.find(v => v._id === item.variant)!.title}
                            </p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="font-medium">{t("quantity")}</p>
                            <p className="line-clamp-2">
                                {item.quantity}
                            </p>
                        </div>
                        <div className="flex flex-col text-right gap-1">
                            <p className="font-medium">{t("price")}</p>
                            {formatCurrency(locale, region!.currency, !item.variant ? item.product.price : item.product.variants!.find(v => v._id === item.variant)!.price)}
                        </div>
                    </li>
                ))}
            </ul>
            <Separator />
            <div className="flex flex-col gap-2">
                <p>{t("discount-code")}?</p>
                <DiscountCodeForm
                    ctaLabel={t("submit")}
                    successMessage={t("discount-applied")}
                />
            </div>
            <div className="flex flex-col gap-2 w-full text-gray-600">
                <div className="flex w-full justify-between items-end">
                    <span>{t("subtotal")}:</span>
                    <span>{formatCurrency(locale, region!.currency, calculateTotal().subTotal)}</span>
                </div>
                <div className="flex w-full justify-between items-end">
                    <span>{t("shipping")}:</span>
                    <span>{formatCurrency(locale, region!.currency, calculateTotal().shipping)}</span>
                </div>
                {!!discountCode &&
                    <div className="flex w-full justify-between items-end text-blue-500">
                        <span>{t("discount-amount")}:</span>
                        <span>-{formatCurrency(locale, region!.currency, calculateTotal().discount)}</span>
                    </div>
                }
                <div className="flex w-full justify-between items-end font-medium text-black">
                    <span>{t("total")}:</span>
                    <span>{formatCurrency(locale, region!.currency, cart.totalPrice)}</span>
                </div>
            </div>
        </div>
    )
}

export default Overview
