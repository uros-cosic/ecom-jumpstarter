import { CheckCircle2 } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { ProductPopulatedCart } from "@/lib/data/cart"
import { AUTOMATED_PAYMENT_METHODS, CHECKOUT_STEP, IRegion } from "@/lib/types"
import EditButton from "./edit-button"
import { getPaymentMethodById, getPaymentMethods } from "@/lib/data/payment-methods"
import CheckoutPaymentForm from "../forms/checkout-payment"

type Props = {
    cart: ProductPopulatedCart
    step: CHECKOUT_STEP
    region: IRegion
}

const Payment = async ({ step, cart, region }: Props) => {
    const t = await getTranslations("Checkout.Payment")

    const isOpen = step === CHECKOUT_STEP.PAYMENT;

    const paymentMethod = (cart.paymentMethod && await getPaymentMethodById(cart.paymentMethod)) || null

    const paymentMethods = await getPaymentMethods({ region: region._id, limit: 999 })

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-end justify-between gap-5">
                <p className="font-[family-name:var(--font-montserrat)] text-3xl font-medium flex items-center gap-2">
                    <span>{t("payment")}</span>
                    {!isOpen && paymentMethod && <CheckCircle2 size={20} />}
                </p>
                {!isOpen && paymentMethod && (
                    <EditButton step={CHECKOUT_STEP.PAYMENT}>{t("edit")}</EditButton>
                )}
            </div>
            {isOpen ? (
                <CheckoutPaymentForm
                    paymentMethods={paymentMethods!}
                    paymentMethod={paymentMethod}
                    submitLabel={t("submit")}
                    cardLabel={t("card")}
                    manualLabel={t("manual")}
                />
            ) : (
                <div className="grid grid-cols-2 gap-5">
                    {paymentMethod && (
                        <>
                            <div className="flex flex-col text-sm text-foreground/80">
                                <p className="text-foreground font-medium">{t("payment-method")}</p>
                                <span>
                                    {paymentMethod.name === AUTOMATED_PAYMENT_METHODS.MANUAL ? t("manual") : paymentMethod.name === AUTOMATED_PAYMENT_METHODS.STRIPE ? t("card") : paymentMethod.name}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default Payment
