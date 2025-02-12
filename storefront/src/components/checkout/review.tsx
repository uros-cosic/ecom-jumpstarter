import { getTranslations } from "next-intl/server"

import { ProductPopulatedCart } from "@/lib/data/cart"
import { CHECKOUT_STEP } from "@/lib/types"
import CheckoutReviewForm from "../forms/checkout-review"

type Props = {
    cart: ProductPopulatedCart
    step: CHECKOUT_STEP
}

const Review = async ({ step, cart, }: Props) => {
    const t = await getTranslations("Checkout.Review")

    const isOpen = step === CHECKOUT_STEP.REVIEW;

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-end justify-between gap-5">
                <p className="font-[family-name:var(--font-montserrat)] text-3xl font-medium flex items-center gap-2">
                    <span>{t("review")}</span>
                </p>
            </div>
            {isOpen && (
                <div className="flex flex-col gap-3">
                    <p>
                        {`${t("starting-agreement")} `}
                        <a
                            href="/policies/privacy-policy"
                            target="_blank"
                            className="text-blue-500 underline"
                        >
                            {t("privacy-policy")}
                        </a>{` ${t("and")} `}
                        <a
                            href="/policies/refund-policy"
                            target="_blank"
                            className="text-blue-500 underline"
                        >
                            {t("refund-policy")}
                        </a>
                    </p>
                    <CheckoutReviewForm
                        cart={cart}
                        submitLabel={t("submit")}
                    />
                </div>
            )}
        </div>
    )
}

export default Review
