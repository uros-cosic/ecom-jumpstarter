import { CheckCircle2 } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { ProductPopulatedCart } from "@/lib/data/cart"
import { CHECKOUT_STEP, IAddress, IUser } from "@/lib/types"
import EditButton from "./edit-button"
import CheckoutAddressForm from "../forms/checkout-address"
import { getMyAddresses } from "@/lib/data/addresses"

type Props = {
    address: IAddress | null
    customer: IUser | null
    cart: ProductPopulatedCart
    step: CHECKOUT_STEP
}

const Address = async ({ address, customer, step, cart }: Props) => {
    const t = await getTranslations("Checkout.Address")
    const isOpen = step === CHECKOUT_STEP.ADDRESS;

    const addresses = await getMyAddresses()

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-end justify-between gap-5">
                <p className="font-[family-name:var(--font-montserrat)] text-3xl font-medium flex items-center gap-2">
                    <span>{t("address")}</span>
                    {!isOpen && address && <CheckCircle2 size={20} />}
                </p>
                {!isOpen && address && (
                    <EditButton step={CHECKOUT_STEP.ADDRESS}>{t("edit")}</EditButton>
                )}
            </div>
            {isOpen ? (
                <CheckoutAddressForm
                    address={address}
                    email={cart.email ?? customer?.email}
                    customer={customer}
                    addresses={addresses}
                    firstNameLabel={t("first-name")}
                    lastNameLabel={t("last-name")}
                    companyLabel={t("company")}
                    addressLabel={t("address")}
                    postalCodeLabel={t("postal-code")}
                    cityLabel={t("city")}
                    provinceLabel={t("province")}
                    phoneLabel={t("phone")}
                    submitLabel={t("submit")}
                    countryLabel={t("country")}
                    helloMessage={t("hello-message", { field: customer?.name.split(" ")[0] })}
                    chooseAddressLabel={t("choose-address")}
                />
            ) : (
                <div className="grid grid-cols-2 gap-5">
                    {address && (
                        <>
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
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default Address
