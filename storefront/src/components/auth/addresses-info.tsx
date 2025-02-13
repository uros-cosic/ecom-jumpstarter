import { IAddress } from "@/lib/types"
import { getTranslations } from "next-intl/server"
import NewAddressDialog from "./new-address-dialog"
import { getMe } from "@/lib/data/user"
import DeleteAddressButton from "./delete-address-button"

type Props = {
    addresses: IAddress[] | null
}

const AddressesInfo = async ({ addresses }: Props) => {
    const user = await getMe()

    const t = await getTranslations("Account")

    return (
        <div className="flex flex-col gap-5">
            {(!addresses || addresses.length < 5) &&
                <NewAddressDialog
                    user={user!}
                    dialogDescriptionLabel={t("new-address-dialog-description")}
                    dialogTitleLabel={t("new-address-dialog-title")}
                    createLabel={t("new-address-create-label")}
                    firstNameLabel={t("first-name-label")}
                    postalCodeLabel={t("postal-code-label")}
                    provinceLabel={t("province-label")}
                    lastNameLabel={t("last-name-label")}
                    companyLabel={t("company-label")}
                    addressLabel={t("address-label")}
                    phoneLabel={t("phone-label")}
                    cityLabel={t("city-label")}
                    submitLabel={t("submit-label")}
                    countryLabel={t("country-label")}
                    successMessage={t("success-add-message", { field: t("address-label") })}
                />
            }
            {!!addresses?.length &&
                <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {addresses.map(addy => (
                        <li key={addy._id} className="rounded-md bg-white border p-5 text-sm flex flex-col justify-between w-full min-h-[200px]">
                            <div className="w-full space-y-2 flex flex-col">
                                <div className="flex flex-col">
                                    <span className="font-medium">{`${addy.firstName} ${addy.lastName}`}</span>
                                    <span className="text-foreground/80">{addy.company}</span>
                                </div>
                                <span>{addy.address}</span>
                                <span>
                                    {[addy.postalCode, addy.city].filter((i) => !!i).join(", ")}
                                </span>
                            </div>
                            <DeleteAddressButton
                                addy={addy}
                                deleteLabel={t("delete")}
                                successMessage={t("success-delete-message", { field: t("address-label") })}
                            />
                        </li>
                    ))}
                </ul>
            }
        </div>
    )
}

export default AddressesInfo
