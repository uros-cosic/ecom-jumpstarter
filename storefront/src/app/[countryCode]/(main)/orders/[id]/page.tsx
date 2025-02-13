import { getLocale, getTranslations } from "next-intl/server"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Metadata } from "next"

import { Separator } from "@/components/ui/separator"
import { getAddressById } from "@/lib/data/addresses"
import { getCartById } from "@/lib/data/cart"
import { getDiscountCodeById } from "@/lib/data/discount-codes"
import { getOrderById } from "@/lib/data/orders"
import { getPaymentById } from "@/lib/data/payment"
import { getPaymentMethodById } from "@/lib/data/payment-methods"
import { getProductPrice } from "@/lib/data/products"
import { getRegionById } from "@/lib/data/regions"
import { getShippingMethodById } from "@/lib/data/shipping-methods"
import { AUTOMATED_PAYMENT_METHODS, DISCOUNT_TYPE } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"

export async function generateMetadata(): Promise<Metadata> {
    // orders shouldn't be indexable - robots

    const t = await getTranslations("Order")

    const title = t("title")
    const description = t("description")

    return {
        title,
        description,
        openGraph: {
            type: 'website',
            title,
            description
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    }
}

type Props = {
    params: Promise<{ id: string }>
}

const Page = async ({ params }: Props) => {
    const { id } = await params

    const order = await getOrderById(id)

    if (!order) notFound()

    const region = await getRegionById(order.region)

    if (!region) notFound()

    const cart = await getCartById(order.cart)

    if (!cart) notFound()

    const t = await getTranslations("Order")
    const locale = await getLocale()

    const prices = await Promise.all(cart.items.map(item => getProductPrice(item.product._id, item.variant ?? undefined)))

    cart.items.forEach((item, idx) => {
        const priceObj = prices[idx]

        if (item.variant) {
            const variant = item.product.variants!.find(v => v._id === item.variant)!
            variant.price = priceObj?.discountedPrice ?? variant.price
        } else {
            item.product.price = priceObj?.discountedPrice ?? item.product.price
        }
    })

    const [shippingMethod, discountCode, address, paymentMethod, orderPayment] = await Promise.all([
        getShippingMethodById(cart.shippingMethod!),
        (cart.discountCode && await getDiscountCodeById(cart.discountCode)) || null,
        getAddressById(cart.address!),
        getPaymentMethodById(cart.paymentMethod!),
        (order.payment && await getPaymentById(order.payment)) || null,
    ])

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
        <div className="max-w-2xl mx-auto w-full px-2 py-10 gap-10 flex flex-col">
            <div className="flex flex-col gap-5">
                <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold">
                    {t("order-sent")}
                </h1>
                <div className="flex flex-col text-foreground/80 gap-2">
                    <p>
                        {t("order-details-sent", { field: cart.email })}
                    </p>
                    <p>{t("order-date", { field: formatDate(order.createdAt, locale) })}</p>
                    <p>{t("order-number", { field: order._id })}</p>
                    <p>{t("order-status", { field: order.status })}</p>
                    <p>{t("order-fulfillment-status", { field: order.fulfillmentStatus })}</p>
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <p className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold">
                    {t("overview")}
                </p>
                <Separator />
                <ul className="flex flex-col gap-2">
                    {
                        cart.items.map((item, idx) => (
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
                        ))
                    }
                </ul>
                <Separator />
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
                <Separator />
                {address && (
                    <>
                        <div className="flex flex-col gap-5">
                            <p className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold">
                                {t("delivery-information")}
                            </p>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="flex flex-col text-sm text-foreground/80">
                                    <p className="text-foreground font-medium">{t("address")}</p>
                                    <span>{`${address.firstName} ${address.lastName}`}</span>
                                    {!!address.company && <span>{address.company}</span>}
                                    <span>{address.address}</span>
                                    <span>{`${address.postalCode}, ${address.city}`}</span>
                                </div>
                                <div className="flex flex-col text-sm text-foreground/80">
                                    <p className="text-foreground font-medium">{t("contact")}</p>
                                    <span>{address.phone}</span>
                                    <span>{cart.email}</span>
                                </div>
                            </div>
                        </div>
                        <Separator />
                    </>
                )}
                {paymentMethod && (
                    <>
                        <div className="flex flex-col gap-5">
                            <p className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold">
                                {t("payment")}
                            </p>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="flex flex-col text-sm text-foreground/80">
                                    <p className="text-foreground font-medium">{t("payment-method")}</p>
                                    <span>
                                        {paymentMethod.name === AUTOMATED_PAYMENT_METHODS.MANUAL ? t("manual") : paymentMethod.name === AUTOMATED_PAYMENT_METHODS.STRIPE ? t("card") : paymentMethod.name}
                                    </span>
                                </div>
                                {orderPayment && (
                                    <div className="flex flex-col text-sm text-foreground/80">
                                        <p className="text-foreground font-medium">{t("payment-details")}</p>
                                        <span>{`${formatCurrency(
                                            locale,
                                            region.currency,
                                            orderPayment.amount
                                        )} ${t("paid-on")} ${formatDate(orderPayment.updatedAt, locale)}`}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Page
