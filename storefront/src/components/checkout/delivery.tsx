import { CheckCircle2 } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import { ProductPopulatedCart } from "@/lib/data/cart"
import { CHECKOUT_STEP, IRegion } from "@/lib/types"
import EditButton from "./edit-button"
import { getShippingMethodById, getShippingMethods } from "@/lib/data/shipping-methods"
import CheckoutDeliveryForm from "../forms/checkout-delivery"

type Props = {
    cart: ProductPopulatedCart
    step: CHECKOUT_STEP
    region: IRegion
}

const Delivery = async ({ step, cart, region }: Props) => {
    const t = await getTranslations("Checkout.Delivery")
    const locale = await getLocale()

    const isOpen = step === CHECKOUT_STEP.DELIVERY;

    const shippingMethod = (cart.shippingMethod && await getShippingMethodById(cart.shippingMethod)) || null

    const shippingMethods = await getShippingMethods({ region: region._id, limit: 999 })

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-end justify-between gap-5">
                <p className="font-[family-name:var(--font-montserrat)] text-3xl font-medium flex items-center gap-2">
                    <span>{t("delivery")}</span>
                    {!isOpen && shippingMethod && <CheckCircle2 size={20} />}
                </p>
                {!isOpen && shippingMethod && (
                    <EditButton step={CHECKOUT_STEP.DELIVERY}>{t("edit")}</EditButton>
                )}
            </div>
            {isOpen ? (
                <CheckoutDeliveryForm
                    region={region}
                    locale={locale}
                    shippingMethods={shippingMethods!}
                    shippingMethod={shippingMethod}
                    submitLabel={t("submit")}
                />
            ) : (
                <div className="grid grid-cols-2 gap-5">
                    {shippingMethod && (
                        <>
                            <div className="flex flex-col text-sm text-foreground/80">
                                <p className="text-foreground font-medium">{t("delivery-method")}</p>
                                <span>{shippingMethod.name}</span>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default Delivery
