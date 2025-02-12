import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { notFound, redirect } from "next/navigation"

import Address from "@/components/checkout/address"
import Delivery from "@/components/checkout/delivery"
import Overview from "@/components/checkout/overview"
import Payment from "@/components/checkout/payment"
import Review from "@/components/checkout/review"
import { Separator } from "@/components/ui/separator"
import { getAddressById } from "@/lib/data/addresses"
import { getCart } from "@/lib/data/cart"
import { getRegionByCountryCode } from "@/lib/data/regions"
import { getMe } from "@/lib/data/user"
import { CHECKOUT_STEP } from "@/lib/types"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Checkout.metadata")

    const title = t("title")
    const description = t("description")

    // Checkout page shouldn't be indexable - robots

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
    params: Promise<{ countryCode: string }>
    searchParams: Promise<Record<string, string>>
}

const Page = async ({ params, searchParams }: Props) => {
    const { countryCode } = await params

    const region = await getRegionByCountryCode(countryCode)

    if (!region) notFound()

    const query = await searchParams
    const cart = await getCart()

    if (!cart) notFound()

    const step = query.step

    const address = (cart.address && await getAddressById(cart.address)) || null

    if (!address && step !== CHECKOUT_STEP.ADDRESS) redirect(`/checkout?step=${CHECKOUT_STEP.ADDRESS}`)

    const customer = await getMe()

    return (
        <div className="max-w-screen-2xl mx-auto w-full px-2 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div className="flex flex-col gap-5">
                    <Address
                        cart={cart}
                        address={address}
                        customer={customer}
                        step={step as CHECKOUT_STEP}
                    />
                    <Separator />
                    <Delivery
                        cart={cart}
                        step={step as CHECKOUT_STEP}
                        region={region}
                    />
                    <Separator />
                    <Payment
                        region={region}
                        step={step as CHECKOUT_STEP}
                        cart={cart}
                    />
                    <Separator />
                    <Review
                        cart={cart}
                        step={step as CHECKOUT_STEP}
                    />
                </div>
                <Overview
                    cart={cart}
                    region={region}
                />
            </div>
        </div>
    )
}

export default Page
