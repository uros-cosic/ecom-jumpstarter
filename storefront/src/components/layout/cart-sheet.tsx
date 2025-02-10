import { ShoppingBag } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"
import Image from "next/image"
import { cookies } from "next/headers"

import { Button } from "../ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { getCart } from "@/lib/data/cart"
import LocalizedLink from "../localized-link"
import { formatCurrency } from "@/lib/utils"
import { DEFAULT_REGION } from "@/lib/constants"
import { getRegionByCountryCode } from "@/lib/data/regions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Separator } from "../ui/separator"
import { getShippingMethodById } from "@/lib/data/shipping-methods"
import { getDiscountCodeById } from "@/lib/data/discount-codes"
import { DISCOUNT_TYPE } from "@/lib/types"
import DiscountCodeForm from "../forms/discount-code"

const CartSheet = async () => {
    const t = await getTranslations("Header.Navbar")
    const cart = await getCart()
    const locale = await getLocale()

    const countryCode = (await cookies()).get('countryCode')?.value ?? DEFAULT_REGION

    const region = await getRegionByCountryCode(countryCode)

    let shippingMethod = null
    let discountCode = null

    if (cart?.shippingMethod) shippingMethod = await getShippingMethodById(cart.shippingMethod)
    if (cart?.discountCode) discountCode = await getDiscountCodeById(cart.discountCode)

    const calculatePrice = () => {
        if (!cart) return {
            subTotal: 0,
            discount: 0,
            shipping: 0
        }

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

        return { subTotal, discount, shipping: shippingCost }
    }

    return (
        <Sheet>
            <SheetTrigger className="hover:opacity-80 transition-opacity">
                <ShoppingBag aria-label={t("bag-label")} size={22} />
            </SheetTrigger>
            {!!cart?.items.length ?
                <SheetContent className="w-[95vw] sm:w-3/4 sm:max-w-md flex flex-col justify-between">
                    <SheetHeader>
                        <SheetTitle className="text-center">{t("your-cart")}</SheetTitle>
                        <SheetDescription className="text-center">{t("yout-cart-description")}</SheetDescription>
                    </SheetHeader>
                    <ul className="max-h-[200px] overflow-y-auto flex flex-col gap-3">
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
                                    <p className="font-medium text-center">{t("quantity")}</p>
                                    <Select value={item.quantity.toString()}>
                                        <SelectTrigger className="h-7 w-16">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                new Array(!item.variant ? item.product.quantity + 1 : item.product.variants!.find(v => v._id === item.variant)!.quantity + 1)
                                                    .fill(null)
                                                    .map((_, idx) => <SelectItem key={idx} value={idx.toString()}>{idx}</SelectItem>)
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col text-right gap-1">
                                    <p className="font-medium">{t("price")}</p>
                                    {formatCurrency(locale, region!.currency, !item.variant ? item.product.price : item.product.variants!.find(v => v._id === item.variant)!.price)}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-col gap-2">
                        <p>Discount code?</p>
                        <DiscountCodeForm
                            ctaLabel={t("submit")}
                            successMessage={t("discount-applied")}
                        />
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-2 w-full text-gray-600">
                        <div className="flex w-full justify-between items-end">
                            <span>{t("subtotal")}:</span>
                            <span>{formatCurrency(locale, region!.currency, calculatePrice().subTotal)}</span>
                        </div>
                        <div className="flex w-full justify-between items-end">
                            <span>{t("estimated-shipping")}:</span>
                            <span>{formatCurrency(locale, region!.currency, calculatePrice().shipping || 5)}</span>
                        </div>
                        {!!discountCode &&
                            <div className="flex w-full justify-between items-end">
                                <span>{t("discount-amount")}:</span>
                                <span>-{formatCurrency(locale, region!.currency, calculatePrice().discount)}</span>
                            </div>
                        }
                        <div className="flex w-full justify-between items-end font-medium text-black">
                            <span>{t("total")}:</span>
                            <span>{formatCurrency(locale, region!.currency, cart.totalPrice + (!shippingMethod ? 5 : 0))}</span>
                        </div>
                    </div>
                    <Separator />
                    <Button className="uppercase font-medium">{t("checkout-cta")}</Button>
                </SheetContent>
                :
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle className="text-center">{t("empty-bag-title")}</SheetTitle>
                        <SheetDescription className="text-center">{t("empty-bag-description")}</SheetDescription>
                    </SheetHeader>
                    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-10">
                        <div className="flex items-center justify-center text-center mx-auto h-44 w-44 rounded-full bg-gray-200">
                            <ShoppingBag size={120} className="text-gray-500" />
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            <LocalizedLink href="/collections">
                                <SheetClose asChild>
                                    <Button className="w-full uppercase font-semibold">{t("shop-collections")}</Button>
                                </SheetClose>
                            </LocalizedLink>
                            <LocalizedLink href="/categories">
                                <SheetClose asChild>
                                    <Button className="w-full uppercase font-semibold">{t("shop-categories")}</Button>
                                </SheetClose>
                            </LocalizedLink>
                        </div>
                    </div>
                </SheetContent>
            }
        </Sheet>

    )
}

export default CartSheet
